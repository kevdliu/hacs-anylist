/**
 * Event types for EventEmitter in the AnyList integration
 */

import { ListItem, Recipe, RecipeCollection } from './core';
import { ApiError } from './api';

/**
 * Base event structure for all AnyList events
 */
export interface BaseEvent {
  /** Event timestamp */
  timestamp: Date;
  
  /** Source of the event (e.g., 'api', 'user', 'system') */
  source: string;
  
  /** Optional event metadata */
  metadata?: Record<string, unknown>;
}

/**
 * Event emitted when a list item is added
 */
export interface ItemAddedEvent extends BaseEvent {
  /** The newly added item */
  item: ListItem;
  
  /** List the item was added to */
  listName: string;
}

/**
 * Event emitted when a list item is updated
 */
export interface ItemUpdatedEvent extends BaseEvent {
  /** The updated item */
  item: ListItem;
  
  /** Previous state of the item */
  previousItem: ListItem;
  
  /** List the item belongs to */
  listName: string;
  
  /** Fields that were changed */
  changedFields: (keyof ListItem)[];
}

/**
 * Event emitted when a list item is removed
 */
export interface ItemRemovedEvent extends BaseEvent {
  /** The removed item */
  item: ListItem;
  
  /** List the item was removed from */
  listName: string;
}

/**
 * Event emitted when a list item is checked or unchecked
 */
export interface ItemCheckedEvent extends BaseEvent {
  /** The item that was checked/unchecked */
  item: ListItem;
  
  /** Previous checked state */
  previousChecked: boolean;
  
  /** New checked state */
  checked: boolean;
  
  /** List the item belongs to */
  listName: string;
}

/**
 * Event emitted when a list is refreshed/synchronized
 */
export interface ListRefreshedEvent extends BaseEvent {
  /** Name of the refreshed list */
  listName: string;
  
  /** Current items in the list */
  items: ListItem[];
  
  /** Number of items added since last refresh */
  itemsAdded: number;
  
  /** Number of items updated since last refresh */
  itemsUpdated: number;
  
  /** Number of items removed since last refresh */
  itemsRemoved: number;
}

/**
 * Event emitted when lists are discovered or updated
 */
export interface ListsUpdatedEvent extends BaseEvent {
  /** All available lists */
  lists: string[];
  
  /** Newly discovered lists */
  newLists: string[];
  
  /** Lists that were removed */
  removedLists: string[];
}

/**
 * Event emitted when a recipe is created
 */
export interface RecipeCreatedEvent extends BaseEvent {
  /** The newly created recipe */
  recipe: Recipe;
}

/**
 * Event emitted when a recipe is updated
 */
export interface RecipeUpdatedEvent extends BaseEvent {
  /** The updated recipe */
  recipe: Recipe;
  
  /** Previous state of the recipe */
  previousRecipe: Recipe;
  
  /** Fields that were changed */
  changedFields: (keyof Recipe)[];
}

/**
 * Event emitted when a recipe is deleted
 */
export interface RecipeDeletedEvent extends BaseEvent {
  /** The deleted recipe */
  recipe: Recipe;
}

/**
 * Event emitted when a recipe collection is created
 */
export interface RecipeCollectionCreatedEvent extends BaseEvent {
  /** The newly created collection */
  collection: RecipeCollection;
}

/**
 * Event emitted when a recipe collection is updated
 */
export interface RecipeCollectionUpdatedEvent extends BaseEvent {
  /** The updated collection */
  collection: RecipeCollection;
  
  /** Previous state of the collection */
  previousCollection: RecipeCollection;
  
  /** Fields that were changed */
  changedFields: (keyof RecipeCollection)[];
}

/**
 * Event emitted when a recipe collection is deleted
 */
export interface RecipeCollectionDeletedEvent extends BaseEvent {
  /** The deleted collection */
  collection: RecipeCollection;
}

/**
 * Event emitted when the AnyList server connection is established
 */
export interface ConnectionEstablishedEvent extends BaseEvent {
  /** Server endpoint that was connected to */
  serverUrl: string;
  
  /** Connection mode ('addon' or 'binary') */
  mode: 'addon' | 'binary';
}

/**
 * Event emitted when the AnyList server connection is lost
 */
export interface ConnectionLostEvent extends BaseEvent {
  /** Server endpoint that was disconnected */
  serverUrl: string;
  
  /** Reason for disconnection */
  reason: string;
  
  /** Whether reconnection will be attempted */
  willReconnect: boolean;
}

/**
 * Event emitted when an API error occurs
 */
export interface ApiErrorEvent extends BaseEvent {
  /** The API error details */
  error: ApiError;
  
  /** HTTP status code */
  statusCode: number;
  
  /** API endpoint that failed */
  endpoint: string;
  
  /** HTTP method used */
  method: string;
}

/**
 * Event emitted when authentication fails
 */
export interface AuthenticationFailedEvent extends BaseEvent {
  /** Reason for authentication failure */
  reason: string;
  
  /** Whether retry is possible */
  canRetry: boolean;
}

/**
 * Event emitted when configuration is updated
 */
export interface ConfigurationUpdatedEvent extends BaseEvent {
  /** New configuration */
  newConfig: Record<string, unknown>;
  
  /** Previous configuration */
  previousConfig: Record<string, unknown>;
  
  /** Fields that were changed */
  changedFields: string[];
}

/**
 * Event emitted when the integration is initialized
 */
export interface IntegrationInitializedEvent extends BaseEvent {
  /** Integration version */
  version: string;
  
  /** Configuration used */
  config: Record<string, unknown>;
}

/**
 * Event emitted when the integration is being shut down
 */
export interface IntegrationShutdownEvent extends BaseEvent {
  /** Reason for shutdown */
  reason: string;
}

/**
 * Event emitted for voice command intents
 */
export interface IntentEvent extends BaseEvent {
  /** Intent type (e.g., 'AnylistAddItem', 'AnylistRemoveItem') */
  intentType: string;
  
  /** Intent slots/parameters */
  slots: Record<string, string>;
  
  /** Whether the intent was successfully processed */
  success: boolean;
  
  /** Response message */
  response: string;
  
  /** Error details if intent failed */
  error?: string;
}

/**
 * Map of event names to event types for type-safe event handling
 */
export interface AnyListEventMap {
  'item:added': ItemAddedEvent;
  'item:updated': ItemUpdatedEvent;
  'item:removed': ItemRemovedEvent;
  'item:checked': ItemCheckedEvent;
  'list:refreshed': ListRefreshedEvent;
  'lists:updated': ListsUpdatedEvent;
  'recipe:created': RecipeCreatedEvent;
  'recipe:updated': RecipeUpdatedEvent;
  'recipe:deleted': RecipeDeletedEvent;
  'collection:created': RecipeCollectionCreatedEvent;
  'collection:updated': RecipeCollectionUpdatedEvent;
  'collection:deleted': RecipeCollectionDeletedEvent;
  'connection:established': ConnectionEstablishedEvent;
  'connection:lost': ConnectionLostEvent;
  'api:error': ApiErrorEvent;
  'auth:failed': AuthenticationFailedEvent;
  'config:updated': ConfigurationUpdatedEvent;
  'integration:initialized': IntegrationInitializedEvent;
  'integration:shutdown': IntegrationShutdownEvent;
  'intent': IntentEvent;
}

/**
 * Type-safe event names
 */
export type AnyListEventName = keyof AnyListEventMap;

/**
 * Get event type for a given event name
 */
export type AnyListEvent<T extends AnyListEventName> = AnyListEventMap[T];

/**
 * Event listener function type
 */
export type EventListener<T extends AnyListEventName> = (event: AnyListEvent<T>) => void | Promise<void>;

/**
 * Type-safe EventEmitter interface for AnyList events
 */
export interface AnyListEventEmitter {
  /**
   * Add an event listener
   */
  on<T extends AnyListEventName>(eventName: T, listener: EventListener<T>): this;
  
  /**
   * Add a one-time event listener
   */
  once<T extends AnyListEventName>(eventName: T, listener: EventListener<T>): this;
  
  /**
   * Remove an event listener
   */
  off<T extends AnyListEventName>(eventName: T, listener: EventListener<T>): this;
  
  /**
   * Emit an event
   */
  emit<T extends AnyListEventName>(eventName: T, event: AnyListEvent<T>): boolean;
  
  /**
   * Remove all listeners for an event
   */
  removeAllListeners<T extends AnyListEventName>(eventName?: T): this;
  
  /**
   * Get listeners for an event
   */
  listeners<T extends AnyListEventName>(eventName: T): EventListener<T>[];
  
  /**
   * Get the number of listeners for an event
   */
  listenerCount<T extends AnyListEventName>(eventName: T): number;
}

/**
 * Helper function to create a properly typed event
 */
export function createEvent<T extends AnyListEventName>(
  eventName: T,
  data: Omit<AnyListEvent<T>, keyof BaseEvent>,
  source = 'system',
  metadata?: Record<string, unknown>
): AnyListEvent<T> {
  return {
    ...data,
    timestamp: new Date(),
    source,
    metadata,
  } as AnyListEvent<T>;
}