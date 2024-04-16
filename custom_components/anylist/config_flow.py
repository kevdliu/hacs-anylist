import logging
import os
import stat

from homeassistant import config_entries

from homeassistant.helpers.aiohttp_client import async_get_clientsession
from homeassistant.helpers.selector import (
    NumberSelector,
    NumberSelectorConfig,
    NumberSelectorMode,
    TextSelector,
    TextSelectorConfig,
    TextSelectorType
)

import homeassistant.helpers.config_validation as cv
import voluptuous as vol

from .const import (
    DOMAIN,
    CONF_SERVER_ADDR,
    CONF_EMAIL,
    CONF_PASSWORD,
    CONF_SERVER_BINARY,
    CONF_DEFAULT_LIST,
    CONF_REFRESH_INTERVAL
)

_LOGGER = logging.getLogger(DOMAIN)

STEP_ADDON_DATA_SCHEMA = vol.Schema(
    {
        vol.Required(
            CONF_SERVER_ADDR
        ): TextSelector(
            TextSelectorConfig(
                type = TextSelectorType.URL
            )
        )
    }
)

STEP_BINARY_DATA_SCHEMA = vol.Schema(
    {
        vol.Required(
            CONF_SERVER_BINARY
        ): TextSelector(
            TextSelectorConfig(
                type = TextSelectorType.TEXT
            )
        ),
        vol.Required(
            CONF_EMAIL
        ): TextSelector(
            TextSelectorConfig(
                type = TextSelectorType.EMAIL,
                autocomplete = "email"
            )
        ),
        vol.Required(
            CONF_PASSWORD
        ): TextSelector(
            TextSelectorConfig(
                type = TextSelectorType.PASSWORD,
                autocomplete = "current-password"
            )
        )
    }
)

STEP_INIT_DATA_SCHEMA = vol.Schema(
    {
        vol.Optional(
            CONF_DEFAULT_LIST,
            default = ""
        ): TextSelector(
            TextSelectorConfig(
                type = TextSelectorType.TEXT
            )
        ),
        vol.Optional(
            CONF_REFRESH_INTERVAL,
            default = 30,
        ): NumberSelector(
            NumberSelectorConfig(
                min = 15,
                max = 120,
                step = 15,
                unit_of_measurement = "minutes",
                mode = NumberSelectorMode.SLIDER
            )
        )
    }
)

class ConfigFlow(config_entries.ConfigFlow, domain = DOMAIN):

    VERSION = 1

    async def async_step_user(self, user_input):
        return self.async_show_menu(
            step_id = "user",
            menu_options = {
                "addon": "Addon Server (Recommended)",
                "binary": "Binary Server (Experimental)"
            }
        )

    async def async_step_reconfigure(self, user_input):
        return self.async_show_menu(
            step_id = "reconfigure",
            menu_options = {
                "addon": "Addon Server (Recommended)",
                "binary": "Binary Server (Experimental)"
            }
        )

    async def async_step_addon(self, user_input):
        errors = {}
        if user_input is not None:
            url = user_input[CONF_SERVER_ADDR]
            if not await self.verify_addon_server(url):
                errors[CONF_SERVER_ADDR] = "addon_server_cannot_connect"

            if not errors:
                return self.async_create_entry(title = "Anylist", data = user_input)

        return self.async_show_form(
            step_id = "addon",
            data_schema = STEP_ADDON_DATA_SCHEMA,
            errors = errors
        )

    async def verify_addon_server(self, url):
        try:
            r = await async_get_clientsession(self.hass).head(url, timeout = 2, allow_redirects = False)
            return r.status < 500
        except Exception:
            return False

    async def async_step_binary(self, user_input):
        errors = {}
        if user_input is not None:
            path = user_input[CONF_SERVER_BINARY]
            error = self.verify_server_binary(path)
            if error is not None:
                errors[CONF_SERVER_BINARY] = error

            if not errors:
                return self.async_create_entry(title = "Anylist", data = user_input)

        return self.async_show_form(
            step_id = "binary",
            data_schema = STEP_BINARY_DATA_SCHEMA,
            errors = errors
        )

    def verify_server_binary(self, path):
        if not os.path.isfile(path):
            return "server_binary_not_found"

        if not os.access(path, os.X_OK):
            os.chmod(path, os.stat(path).st_mode | stat.S_IEXEC)

        if not os.access(path, os.X_OK):
            return "server_binary_wrong_permissions"

        return None

    def async_get_options_flow(config_entry):
        return OptionsFlow(config_entry)

class OptionsFlow(config_entries.OptionsFlow):

    def __init__(self, config_entry):
        self.config_entry = config_entry

    async def async_step_init(self, user_input):
        if user_input is not None:
            return self.async_create_entry(data = user_input)

        return self.async_show_form(
            step_id = "init",
            data_schema = self.add_suggested_values_to_schema(
                STEP_INIT_DATA_SCHEMA, self.config_entry.options
            )
        )
