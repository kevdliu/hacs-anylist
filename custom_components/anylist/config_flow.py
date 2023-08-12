import logging

from homeassistant import config_entries
import homeassistant.helpers.config_validation as cv
import voluptuous as vol

from .const import (
    DOMAIN,
    CONF_SERVER_ADDR
)

_LOGGER = logging.getLogger(DOMAIN)

STEP_USER_DATA_SCHEMA = vol.Schema(
    {
        vol.Required(CONF_SERVER_ADDR): str
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
