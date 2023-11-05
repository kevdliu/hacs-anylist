import datetime
import logging

from homeassistant.helpers.update_coordinator import DataUpdateCoordinator

from .const import DOMAIN

_LOGGER = logging.getLogger(DOMAIN)

UPDATE_INTERVAL = datetime.timedelta(minutes = 30)

class AnylistUpdateCoordinator(DataUpdateCoordinator):

    def __init__(self, hass, list_name):
        super().__init__(hass, _LOGGER, name = f"Anylist {list_name}", update_interval = UPDATE_INTERVAL)
        self.list_name = list_name
        self.hass = hass

    async def _async_update_data(self):
        code, items = await self.hass.data[DOMAIN].get_detailed_items(self.list_name)
        return items
