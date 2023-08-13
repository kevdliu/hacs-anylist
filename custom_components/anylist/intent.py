import logging

from homeassistant.helpers import intent
import homeassistant.helpers.config_validation as cv

from .const import DOMAIN

_LOGGER = logging.getLogger(DOMAIN)

INTENT_ADD_ITEM = "AnylistAddItem"
INTENT_REMOVE_ITEM = "AnylistRemoveItem"
INTENT_GET_ITEMS = "AnylistGetItems"

async def async_setup_intents(hass):
    intent.async_register(hass, AddItemIntent())
    intent.async_register(hass, RemoveItemIntent())
    intent.async_register(hass, GetItemsIntent())

class AddItemIntent(intent.IntentHandler):

    intent_type = INTENT_ADD_ITEM
    slot_schema = {"item": cv.string}

    async def async_handle(self, intent_obj: intent.Intent):
        slots = self.async_validate_slots(intent_obj.slots)
        item = slots["item"]["value"]
        await intent_obj.hass.data[DOMAIN].add_item(item)

        response = intent_obj.create_response()
        response.async_set_speech("I have added {} to your list.".format(item))
        return response

class RemoveItemIntent(intent.IntentHandler):

    intent_type = INTENT_REMOVE_ITEM
    slot_schema = {"item": cv.string}

    async def async_handle(self, intent_obj: intent.Intent):
        slots = self.async_validate_slots(intent_obj.slots)
        item = slots["item"]["value"]
        await intent_obj.hass.data[DOMAIN].remove_item(item)

        response = intent_obj.create_response()
        response.async_set_speech("I have removed {} from your list.".format(item))
        return response

class GetItemsIntent(intent.IntentHandler):

    intent_type = INTENT_GET_ITEMS

    async def async_handle(self, intent_obj: intent.Intent):
        _, items = await intent_obj.hass.data[DOMAIN].get_items()

        response = intent_obj.create_response()
        if not items:
            response.async_set_speech("There are no items on your list.")
        else:
            response.async_set_speech("You have: {}.".format(self.format_items(items)))
        return response

    def format_items(self, items):
        count = len(items)
        if count == 1:
            return items[0]

        if count == 2:
            return "{} and {}".format(items[0], items[1])

        return "{}, and {}".format(", ".join(items[0:-1]), items[-1])
