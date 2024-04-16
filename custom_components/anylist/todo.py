from homeassistant.components.todo import (
    TodoItem,
    TodoItemStatus,
    TodoListEntity,
    TodoListEntityFeature,
)
from homeassistant.helpers.update_coordinator import CoordinatorEntity

from .coordinator import AnylistUpdateCoordinator
from .const import (
    DOMAIN,
    ATTR_ID,
    ATTR_NAME,
    ATTR_CHECKED,
    ATTR_NOTES,
    CONF_REFRESH_INTERVAL
)

async def async_setup_entry(hass, config_entry, async_add_entities):
    refresh_interval = config_entry.options.get(CONF_REFRESH_INTERVAL, 30)

    code, lists = await hass.data[DOMAIN].get_lists()
    for list_name in lists:
        coordinator = AnylistUpdateCoordinator(hass, list_name, refresh_interval)
        await coordinator.async_config_entry_first_refresh()

        async_add_entities(
            [AnylistTodoListEntity(hass, coordinator, list_name)]
        )

class AnylistTodoListEntity(CoordinatorEntity[AnylistUpdateCoordinator], TodoListEntity):

    _attr_has_entity_name = True
    _attr_supported_features = (
        TodoListEntityFeature.CREATE_TODO_ITEM
        | TodoListEntityFeature.DELETE_TODO_ITEM
        | TodoListEntityFeature.UPDATE_TODO_ITEM
        | TodoListEntityFeature.SET_DESCRIPTION_ON_ITEM
    )

    def __init__(self, hass, coordinator, list_name):
        super().__init__(coordinator)
        self._attr_unique_id = f"anylist_{list_name}"
        self._attr_name = list_name
        self.list_name = list_name
        self.hass = hass

    @property
    def todo_items(self):
        if self.coordinator.data is None:
            return None

        items = [
            TodoItem(
                summary = item[ATTR_NAME],
                uid = item[ATTR_ID],
                status = TodoItemStatus.COMPLETED if item[ATTR_CHECKED] else TodoItemStatus.NEEDS_ACTION,
                description = item[ATTR_NOTES]
            )
            for item in self.coordinator.data
        ]
        return items

    async def async_create_todo_item(self, item):
        updates = self.get_item_updates(item)
        await self.hass.data[DOMAIN].add_item(
            item.summary,
            updates = updates,
            list_name = self.list_name
        )
        await self.coordinator.async_refresh()

    async def async_delete_todo_items(self, uids):
        for uid in uids:
            await self.hass.data[DOMAIN].remove_item_by_id(uid, list_name = self.list_name)
        await self.coordinator.async_refresh()

    async def async_update_todo_item(self, item):
        updates = self.get_item_updates(item)
        await self.hass.data[DOMAIN].update_item(
            item.uid,
            updates = updates,
            list_name = self.list_name
        )
        await self.coordinator.async_refresh()

    def get_item_updates(self, item):
        updates = dict()
        updates[ATTR_NAME] = item.summary

        if item.description is not None:
            updates[ATTR_NOTES] = item.description

        if item.status is not None:
            updates[ATTR_CHECKED] = (item.status == TodoItemStatus.COMPLETED)

        return updates

    @property
    def extra_state_attributes(self):
        return {
            "source_name": f"{self.list_name}",
            "checked_items": [item[ATTR_NAME] for item in self.coordinator.data if item[ATTR_CHECKED]],
            "unchecked_items": [item[ATTR_NAME] for item in self.coordinator.data if not item[ATTR_CHECKED]]
        }
