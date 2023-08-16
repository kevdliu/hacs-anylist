import logging

from homeassistant import config_entries
import homeassistant.helpers.config_validation as cv
import voluptuous as vol

from .const import (
    DOMAIN,
    CONF_SERVER_ADDR,
    CONF_DEFAULT_LIST
)

_LOGGER = logging.getLogger(DOMAIN)

STEP_USER_DATA_SCHEMA = vol.Schema(
    {
        vol.Required(CONF_SERVER_ADDR): str
    }
)

STEP_INIT_DATA_SCHEMA = vol.Schema(
    {
        vol.Optional(CONF_DEFAULT_LIST, default = ""): str
    }
)

class ConfigFlow(config_entries.ConfigFlow, domain = DOMAIN):

    VERSION = 1

    async def async_step_user(self, user_input):
        if user_input is not None:
            return self.async_create_entry(title = "Anylist", data = user_input)

        return self.async_show_form(
            step_id = "user",
            data_schema = STEP_USER_DATA_SCHEMA
        )

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
