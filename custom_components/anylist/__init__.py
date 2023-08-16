import aiohttp
import logging
import voluptuous as vol

from homeassistant.const import ATTR_NAME
from homeassistant.core import (
    ServiceResponse,
    SupportsResponse
)
import homeassistant.helpers.config_validation as cv

from .const import (
    DOMAIN,
    CONF_SERVER_ADDR,
    CONF_DEFAULT_LIST
)

_LOGGER = logging.getLogger(DOMAIN)

SERVICE_ADD_ITEM = "add_item"
SERVICE_REMOVE_ITEM = "remove_item"
SERVICE_GET_ITEMS = "get_items"

ATTR_LIST = "list"

SERVICE_ITEM_SCHEMA = vol.Schema(
    {
        vol.Required(ATTR_NAME): cv.string,
        vol.Optional(ATTR_LIST, default = ""): cv.string
    }
)

SERVICE_LIST_SCHEMA = vol.Schema(
    {
        vol.Optional(ATTR_LIST, default = ""): cv.string
    }
)

async def async_setup_entry(hass, config_entry):
    anylist = hass.data[DOMAIN] = Anylist(config_entry)

    async def add_item_service(call):
        item_name = call.data[ATTR_NAME]
        list_name = call.data[ATTR_LIST]
        await anylist.add_item(item_name, list_name)

    async def remove_item_service(call):
        item_name = call.data[ATTR_NAME]
        list_name = call.data[ATTR_LIST]
        await anylist.remove_item(item_name, list_name)

    async def get_items_service(call) -> ServiceResponse:
        list_name = call.data[ATTR_LIST]
        items = await anylist.get_items(list_name)
        return {"items": items or []}

    hass.services.async_register(
        DOMAIN, SERVICE_ADD_ITEM, add_item_service,
        schema = SERVICE_ITEM_SCHEMA
    )
    hass.services.async_register(
        DOMAIN, SERVICE_REMOVE_ITEM, remove_item_service,
        schema = SERVICE_ITEM_SCHEMA
    )
    hass.services.async_register(
        DOMAIN, SERVICE_GET_ITEMS, get_items_service,
        schema = SERVICE_LIST_SCHEMA, supports_response = SupportsResponse.ONLY
    )

    return True

class Anylist:

    def __init__(self, config_entry):
        self.config_entry = config_entry

    async def add_item(self, item_name, list_name = None):
        body = {
            "item": item_name.capitalize(),
            "list": self.get_list_name(list_name)
        }

        async with aiohttp.ClientSession() as session:
            async with session.post(self.get_server_url("add"), json = body) as response:
                code = response.status
                if code == 200 or code == 304:
                    return True
                else:
                    _LOGGER.error("Failed to add item. Received error code %d.", code)
                    return False

    async def remove_item(self, item_name, list_name = None):
        body = {
            "item": item_name.capitalize(),
            "list": self.get_list_name(list_name)
        }

        async with aiohttp.ClientSession() as session:
            async with session.post(self.get_server_url("remove"), json = body) as response:
                code = response.status
                if code == 200 or code == 304:
                    return True
                else:
                    _LOGGER.error("Failed to remove item. Received error code %d.", code)
                    return False

    async def get_items(self, list_name = None):
        if name := self.get_list_name(list_name):
            query = {
                "list": name
            }
        else:
            query = None

        async with aiohttp.ClientSession() as session:
            async with session.get(self.get_server_url("list"), params = query) as response:
                code = response.status
                if code == 200:
                    body = await response.json()
                    return body["items"]
                else:
                    _LOGGER.error("Failed to get items. Received error code %d.", code)
                    return None

    def get_server_url(self, endpoint):
        addr = self.config_entry.data[CONF_SERVER_ADDR]
        return "{}/{}".format(addr, endpoint)

    def get_list_name(self, list_name):
        return list_name or self.config_entry.options.get(CONF_DEFAULT_LIST)
