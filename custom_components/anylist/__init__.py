import aiohttp
import logging
import voluptuous as vol

from homeassistant.const import ATTR_NAME, Platform
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

PLATFORMS: list[Platform] = [Platform.TODO]

_LOGGER = logging.getLogger(DOMAIN)

SERVICE_ADD_ITEM = "add_item"
SERVICE_REMOVE_ITEM = "remove_item"
SERVICE_CHECK_ITEM = "check_item"
SERVICE_UNCHECK_ITEM = "uncheck_item"
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
        list_name = call.data.get(ATTR_LIST)
        code = await anylist.add_item(item_name, list_name)
        return {"code": code}

    async def remove_item_service(call):
        item_name = call.data[ATTR_NAME]
        list_name = call.data.get(ATTR_LIST)
        code = await anylist.remove_item_by_name(item_name, list_name)
        return {"code": code}

    async def check_item_service(call):
        item_name = call.data[ATTR_NAME]
        list_name = call.data.get(ATTR_LIST)
        code = await anylist.check_item(item_name, list_name, True)
        return {"code": code}

    async def uncheck_item_service(call):
        item_name = call.data[ATTR_NAME]
        list_name = call.data.get(ATTR_LIST)
        code = await anylist.check_item(item_name, list_name, False)
        return {"code": code}

    async def get_items_service(call) -> ServiceResponse:
        list_name = call.data.get(ATTR_LIST)
        code, items = await anylist.get_items(list_name)
        return {"code": code, "items": items}

    hass.services.async_register(
        DOMAIN, SERVICE_ADD_ITEM, add_item_service,
        schema = SERVICE_ITEM_SCHEMA, supports_response = SupportsResponse.ONLY
    )
    hass.services.async_register(
        DOMAIN, SERVICE_REMOVE_ITEM, remove_item_service,
        schema = SERVICE_ITEM_SCHEMA, supports_response = SupportsResponse.ONLY
    )
    hass.services.async_register(
        DOMAIN, SERVICE_CHECK_ITEM, check_item_service,
        schema = SERVICE_ITEM_SCHEMA, supports_response = SupportsResponse.ONLY
    )
    hass.services.async_register(
        DOMAIN, SERVICE_UNCHECK_ITEM, uncheck_item_service,
        schema = SERVICE_ITEM_SCHEMA, supports_response = SupportsResponse.ONLY
    )
    hass.services.async_register(
        DOMAIN, SERVICE_GET_ITEMS, get_items_service,
        schema = SERVICE_LIST_SCHEMA, supports_response = SupportsResponse.ONLY
    )

    await hass.config_entries.async_forward_entry_setups(config_entry, PLATFORMS)

    return True

class Anylist:

    def __init__(self, config_entry):
        self.config_entry = config_entry

    async def add_item(self, item_name, list_name = None):
        body = {
            "name": item_name.capitalize(),
            "list": self.get_list_name(list_name)
        }

        async with aiohttp.ClientSession() as session:
            async with session.post(self.get_server_url("add"), json = body) as response:
                code = response.status
                if code != 200 and code != 304:
                    _LOGGER.error("Failed to add item. Received error code %d.", code)
                return code

    async def remove_item_by_name(self, item_name, list_name = None):
        body = {
            "name": item_name.capitalize(),
            "list": self.get_list_name(list_name)
        }

        async with aiohttp.ClientSession() as session:
            async with session.post(self.get_server_url("remove"), json = body) as response:
                code = response.status
                if code != 200 and code != 304:
                    _LOGGER.error("Failed to remove item. Received error code %d.", code)
                return code

    async def remove_item_by_id(self, item_id, list_name = None):
        body = {
            "id": item_id,
            "list": self.get_list_name(list_name)
        }

        async with aiohttp.ClientSession() as session:
            async with session.post(self.get_server_url("remove"), json = body) as response:
                code = response.status
                if code != 200 and code != 304:
                    _LOGGER.error("Failed to remove item. Received error code %d.", code)
                return code

    async def update_item(self, item_id, list_name = None, name = None, checked = None):
        body = {
            "id": item_id,
            "list": self.get_list_name(list_name)
        }

        if name is not None:
            body["name"] = name

        if checked is not None:
            body["checked"] = checked

        async with aiohttp.ClientSession() as session:
            async with session.post(self.get_server_url("update"), json = body) as response:
                code = response.status
                if code != 200:
                    _LOGGER.error("Failed to update item. Received error code %d.", code)
                return code

    async def check_item(self, item_name, list_name = None, checked = True):
        body = {
            "name": item_name.capitalize(),
            "list": self.get_list_name(list_name),
            "checked": checked
        }

        async with aiohttp.ClientSession() as session:
            async with session.post(self.get_server_url("check"), json = body) as response:
                code = response.status
                if code != 200 and code != 304:
                    _LOGGER.error("Failed to update item status. Received error code %d.", code)
                return code

    async def get_detailed_items(self, list_name = None):
        if name := self.get_list_name(list_name):
            query = {
                "list": name
            }
        else:
            query = None

        async with aiohttp.ClientSession() as session:
            async with session.get(self.get_server_url("items"), params = query) as response:
                code = response.status
                if code == 200:
                    body = await response.json()
                    return (code, body["items"] or [])
                else:
                    _LOGGER.error("Failed to get items. Received error code %d.", code)
                    return (code, [])

    async def get_items(self, list_name = None):
        code, items = await self.get_detailed_items(list_name)
        if code == 200:
            items = list(filter(lambda item: not item["checked"], items))
            items = list(map(lambda item: item["name"], items))
            return (code, items)
        else:
            return (code, [])

    async def get_lists(self):
        async with aiohttp.ClientSession() as session:
            async with session.get(self.get_server_url("lists")) as response:
                code = response.status
                if code == 200:
                    body = await response.json()
                    return (code, body["lists"] or [])
                else:
                    _LOGGER.error("Failed to get lists. Received error code %d.", code)
                    return (code, [])

    def get_server_url(self, endpoint):
        addr = self.config_entry.data[CONF_SERVER_ADDR]
        return "{}/{}".format(addr, endpoint)

    def get_list_name(self, list_name):
        return list_name or self.config_entry.options.get(CONF_DEFAULT_LIST)
