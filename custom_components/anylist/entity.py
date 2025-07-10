"""Base class for AnyList entities."""

from homeassistant.helpers.device_registry import DeviceInfo
from homeassistant.helpers.update_coordinator import CoordinatorEntity

from .const import DOMAIN
from .coordinator import AnyListDataUpdateCoordinator


class AnyListEntity(CoordinatorEntity[AnyListDataUpdateCoordinator]):
    """Defines a base AnyList entity."""

    _attr_has_entity_name = True

    def __init__(self, coordinator: AnyListDataUpdateCoordinator, key: str) -> None:
        """Initialize AnyList entity."""
        super().__init__(coordinator)
        unique_id = coordinator.config_entry.unique_id
        assert unique_id is not None
        self._attr_unique_id = f"{unique_id}_{key}"
        self._attr_device_info = DeviceInfo(
            identifiers={(DOMAIN, unique_id)},
        )
