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
    CONF_SERVER_ADDR
)

_LOGGER = logging.getLogger(DOMAIN)

SERVICE_ADD_ITEM = "add_item"
SERVICE_REMOVE_ITEM = "remove_item"
SERVICE_GET_ITEMS = "get_items"

SERVICE_ITEM_SCHEMA = vol.Schema({vol.Required(ATTR_NAME): cv.string})

async def async_setup_entry(hass, config_entry):
    anylist = hass.data[DOMAIN] = Anylist(config_entry)

    async def add_item_service(call):
        name = call.data[ATTR_NAME]
        await anylist.add_item(name)

    async def remove_item_service(call):
        name = call.data[ATTR_NAME]
        await anylist.remove_item(name)

    async def get_items_service(call) -> ServiceResponse:
        _, items = await anylist.get_items()
        return {"items": items}

    hass.services.async_register(
        DOMAIN, SERVICE_ADD_ITEM, add_item_service, schema=SERVICE_ITEM_SCHEMA
    )
    hass.services.async_register(
        DOMAIN, SERVICE_REMOVE_ITEM, remove_item_service, schema=SERVICE_ITEM_SCHEMA
    )
    hass.services.async_register(
        DOMAIN, SERVICE_GET_ITEMS, get_items_service, supports_response=SupportsResponse.ONLY
    )

    return True

class Anylist:

    def __init__(self, config_entry):
        self.config_entry = config_entry

    async def add_item(self, item):
        async with aiohttp.ClientSession() as session:
            async with session.post(self.get_server_url("add"), json = {"item": item.capitalize()}) as response:
                return response.status

    async def remove_item(self, item):
        async with aiohttp.ClientSession() as session:
            async with session.post(self.get_server_url("remove"), json = {"item": item.capitalize()}) as response:
                return response.status

    async def get_items(self):
        async with aiohttp.ClientSession() as session:
            async with session.get(self.get_server_url("list")) as response:
                code = response.status
                if code == 200:
                    body = await response.json()
                    return (code, body["items"])
                else:
                    return (code, [])

    def get_server_url(self, endpoint):
        addr = self.config_entry.data[CONF_SERVER_ADDR]
        return "{}/{}".format(addr, endpoint)
