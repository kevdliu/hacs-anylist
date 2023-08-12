# Home Assistant Integration For Anylist

## Prerequisites
This integration requires [Home Assistant Addon For Anylist](https://github.com/kevdliu/hassio-addon-anylist). Please install and configure the addon first before setting up this integration.

## Installation
You can install this custom integration using [HACS](https://hacs.xyz/). It is not a part of the official list of repositories but you can add it as a [custom repository](https://hacs.xyz/docs/faq/custom_repositories/).

## Configuration
The integration will prompt for the address of the [Anylist Home Assistant addon](https://github.com/kevdliu/hassio-addon-anylist) server during setup. The address includes the scheme (currently only plain-text http is supported), hostname or IP, and port of the server. For example, if you're running the addon locally and have it configured to listen on port 1234, the server address would be `http://127.0.0.1:1234`. Please do not include a trailing slash at the end of the address. 

## Usage
There are two ways to use this integration: service calls and Home Assistant intents. 

### Service Calls
The integration has three services: `anylist.add_item`, `anylist.remove_item`, and `anylist.get_items`.


#### anylist.add_item
Parameters:
| Parameter | Required | Description          |
| --------- | -------- | -------------------- |
| name      | Yes      | The name of the item |

Example service call:
```
service: anylist.add_item
data:
  name: milk
```


#### anylist.remove_item
Parameters:
| Parameter | Required | Description          |
| --------- | -------- | -------------------- |
| name      | Yes      | The name of the item |

Example service call:
```
service: anylist.remove_item
data:
  name: milk
```


#### anylist.get_items
Parameters: None

Response: A dictionary containing the key `items` which contains an array of items on the list

Example service call:
```
service: anylist.get_items
```

Example response:

items:
  - Milk
  - Flour
  - [Your kiss](https://www.youtube.com/watch?v=lsHld-iArOc)
  - Eggs


### Home Assistant Intents

#### Assist
Home Assistant [2023.8.0](https://www.home-assistant.io/blog/2023/08/02/release-20238/) added support for wildcard matching in intents and as a result re-added support for adding items to shopping lists using intents. However, I was not able to get this to work via [Assist](https://www.home-assistant.io/voice_control/) without installing the built-in [Shopping List](https://www.home-assistant.io/integrations/shopping_list/) integration first. So beware that you have to install the built-in Shopping List integration first before installing this integration if you want to use it via Assist. Note that Assist does not support removing items or querying the items on a shopping list yet. 

#### Automation
Home Assistant 2023.8.0 also introduced support for [wildcards in sentence triggers](https://www.home-assistant.io/blog/2023/08/02/release-20238/#wildcard-support-for-sentence-triggers) for automations. As a result, you can build your own Anylist automation by combining [sentence triggers](https://www.home-assistant.io/docs/automation/trigger/#sentence-trigger) and the service calls provided by this integration to match your own needs. 
