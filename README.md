# Home Assistant Integration For Anylist

## Prerequisites
This integration requires [Home Assistant Addon For Anylist](https://github.com/kevdliu/hassio-addon-anylist). Please install and configure the addon first before setting up this integration.

## Configuration
The integration will prompt for the address of the [Anylist Home Assistant addon](https://github.com/kevdliu/hassio-addon-anylist) server during setup. The address includes the scheme (currently only plain-text http is supported), hostname or IP, and port of the server. For example, if you're running the addon locally and have it configured to listen on port 1234, the server address would be `http://127.0.0.1:1234`. Please do not include a trailing slash at the end of the address. 

## Usage
There are two ways to use this integration: service calls and Home Assistant intents. 

### Service Calls
The integration has two services: `anylist.add_item` and `anylist.remove_item`. Both services have a required `name` parameter providing the name of the item. 

Example service call:
```
service: anylist.add_item
data:
  name: Milk
```

### Home Assistant Intents (WIP)
Home Assistant [2023.8.0](https://www.home-assistant.io/blog/2023/08/02/release-20238/) added support for wildcard matching in intents and as a result re-added support for adding items to shopping lists using intents. However, I was not able to get it to work with either my integration or the builtin [Shopping List](https://www.home-assistant.io/integrations/shopping_list/) integration. 


In addition, the [Home Assistant intents repository](https://github.com/home-assistant/intents) does not support removeing items or querying the items on a shopping list yet. 
