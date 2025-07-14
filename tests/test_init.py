"""Tests for the anylist integration."""

import pytest
from unittest.mock import Mock

from custom_components.anylist.const import DOMAIN


def test_domain_constant():
    """Test that the domain constant is correct."""
    assert DOMAIN == "anylist"


@pytest.mark.asyncio
async def test_async_setup_entry():
    """Test async setup entry."""
    from custom_components.anylist import async_setup_entry
    
    # Mock the necessary objects
    hass = Mock()
    hass.data = {}
    hass.services = Mock()
    hass.config_entries = Mock()
    hass.bus = Mock()
    hass.config = Mock()
    hass.config.path = Mock(return_value="/tmp/test_credentials")
    
    config_entry = Mock()
    config_entry.data = {
        "server_addr": "http://localhost:8080",
        "email": "test@example.com", 
        "password": "test",
        "server_binary": None
    }
    config_entry.options = {}
    
    # Mock the platforms setup
    hass.config_entries.async_forward_entry_setups = Mock(return_value=True)
    
    # Test that setup returns True
    result = await async_setup_entry(hass, config_entry)
    assert result is True
    assert DOMAIN in hass.data