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
        code = await intent_obj.hass.data[DOMAIN].add_item(item)

        if code == 200 or code == 304:
            speech = "I have added {} to your list.".format(item)
        else:
            speech = "An error has occurred while adding the item. Check logs for details."

        response = intent_obj.create_response()
        response.async_set_speech(speech)
        return response

class RemoveItemIntent(intent.IntentHandler):

    intent_type = INTENT_REMOVE_ITEM
    slot_schema = {"item": cv.string}

    async def async_handle(self, intent_obj: intent.Intent):
        slots = self.async_validate_slots(intent_obj.slots)
        item = slots["item"]["value"]
        code = await intent_obj.hass.data[DOMAIN].remove_item_by_name(item)

        if code == 200 or code == 304:
            speech = "I have removed {} from your list.".format(item)
        else:
            speech = "An error has occurred while removing the item. Check logs for details."

        response = intent_obj.create_response()
        response.async_set_speech(speech)
        return response

class GetItemsIntent(intent.IntentHandler):

    intent_type = INTENT_GET_ITEMS

    async def async_handle(self, intent_obj: intent.Intent):
        code, items = await intent_obj.hass.data[DOMAIN].get_items()

        if code != 200:
            speech = "An error has occurred while getting the items on your list. Check logs for details."
        elif len(items) == 0:
            speech = "There are no items on your list."
        else:
            speech = "You have: {}.".format(self.format_items(items))

        response = intent_obj.create_response()
        response.async_set_speech(speech)
        return response

    def format_items(self, items):
        count = len(items)
        if count == 1:
            return items[0]

        if count == 2:
            return "{} and {}".format(items[0], items[1])

        return "{}, and {}".format(", ".join(items[0:-1]), items[-1])
