from homeassistant.components.todo import (
    TodoItem,
    TodoItemStatus,
    TodoListEntity,
    TodoListEntityFeature,
)
from homeassistant.helpers.update_coordinator import CoordinatorEntity

from .coordinator import AnylistUpdateCoordinator
from .const import DOMAIN

async def async_setup_entry(hass, config_entry, async_add_entities):
    code, lists = await hass.data[DOMAIN].get_lists()
    for list_name in lists:
        coordinator = AnylistUpdateCoordinator(hass, list_name)
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
    )

    def __init__(self, hass, coordinator, list_name):
        super().__init__(coordinator)
        self._attr_name = f"Anylist {list_name}"
        self._attr_unique_id = f"anylist_{list_name}"
        self.list_name = list_name
        self.hass = hass

    @property
    def todo_items(self):
        if self.coordinator.data is None:
            return None

        items = [
            TodoItem(
                summary = item["name"],
                uid = item["id"],
                status = TodoItemStatus.COMPLETED if item["checked"] else TodoItemStatus.NEEDS_ACTION
            )
            for item in self.coordinator.data
        ]
        return items

    async def async_create_todo_item(self, item):
        await self.hass.data[DOMAIN].add_item(item.summary, list_name = self.list_name)
        await self.coordinator.async_refresh()

    async def async_delete_todo_items(self, uids):
        for uid in uids:
            await self.hass.data[DOMAIN].remove_item_by_id(uid, list_name = self.list_name)
        await self.coordinator.async_refresh()

    async def async_update_todo_item(self, item):
        checked = None
        if item.status is not None:
            checked = (item.status == TodoItemStatus.COMPLETED)

        await self.hass.data[DOMAIN].update_item(
            item.uid,
            list_name = self.list_name,
            name = item.summary,
            checked = checked
        )
        await self.coordinator.async_refresh()
