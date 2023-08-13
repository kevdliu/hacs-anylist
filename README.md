# Home Assistant Integration For Anylist

## Prerequisites
This integration requires [Home Assistant Addon For Anylist](https://github.com/kevdliu/hassio-addon-anylist). Please install and configure the addon first before setting up this integration.

## Installation
You can install this custom integration using [HACS](https://hacs.xyz/). It is not a part of the official list of repositories but you can add it as a [custom repository](https://hacs.xyz/docs/faq/custom_repositories/).

If you already have HACS installed, you can simply click this button:


[![Open your Home Assistant instance and open a repository inside the Home Assistant Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=kevdliu&repository=hacs-anylist&category=integration)

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
Home Assistant [2023.8.0](https://www.home-assistant.io/blog/2023/08/02/release-20238/) added support for wildcard matching in intents and as a result re-added support for adding items to shopping lists using intents. However, the built-in shopping list intents seem to only work with the built-in [Shopping List](https://www.home-assistant.io/integrations/shopping_list/) integration. If you wish to use this integration with [Home Assistant Assist](https://www.home-assistant.io/voice_control/), you have to download and place the `custom_sentences` directory in this repository into the `config` directory of your Home Assistant installation. For more details, see [Adding support for custom sentences](https://www.home-assistant.io/integrations/conversation/#adding-custom-sentences).


The `custom_sentences` directory contains a few starter commands allowing you to modify and query your Anylist. For example:
- Adding an item: `Add {item} to my list`
- Removing an item: `Remove {item} from my list`
- Getting items: `What's on my list`


Slight sentence variations are supported in order to capture more commands. If you wish to customize the commands yourself, see [Template sentence syntax](https://developers.home-assistant.io/docs/voice/intent-recognition/template-sentence-syntax/).

#### Automation
Home Assistant 2023.8.0 also introduced support for [wildcards in sentence triggers](https://www.home-assistant.io/blog/2023/08/02/release-20238/#wildcard-support-for-sentence-triggers) for automations. As a result, you can build your own Anylist automation by combining [sentence triggers](https://www.home-assistant.io/docs/automation/trigger/#sentence-trigger) and the service calls provided by this integration to match your own needs. 

If you wish, you can also import these pre-built blueprints into your Home Assistant to get started quickly. 


Adding an item:


[![Open your Home Assistant instance and show the blueprint import dialog with a specific blueprint pre-filled.](https://my.home-assistant.io/badges/blueprint_import.svg)](https://my.home-assistant.io/redirect/blueprint_import/?blueprint_url=https%3A%2F%2Fgist.github.com%2Fkevdliu%2F0c37c29173de949c1c49953ad2cea2ac)


Removing an item: 


[![Open your Home Assistant instance and show the blueprint import dialog with a specific blueprint pre-filled.](https://my.home-assistant.io/badges/blueprint_import.svg)](https://my.home-assistant.io/redirect/blueprint_import/?blueprint_url=https%3A%2F%2Fgist.github.com%2Fkevdliu%2F8158fcf0c42a0a5128abc6492d3b0a4b)


Getting items:


[![Open your Home Assistant instance and show the blueprint import dialog with a specific blueprint pre-filled.](https://my.home-assistant.io/badges/blueprint_import.svg)](https://my.home-assistant.io/redirect/blueprint_import/?blueprint_url=https%3A%2F%2Fgist.github.com%2Fkevdliu%2F537e292c8a930f36412d507321a43d86)


## Category Matching
By default, the integration will apply the "Other" category to added items. However, it also attempts to automatically apply categories to your added items by looking up the categories of recently added items stored on your Anylist account. As such, if you fix the category of added items manually, the integration will "learn" over time and apply the correct categories in the future. I guess you can call this machine learning :laughing:
