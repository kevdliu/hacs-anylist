/**
 * TypeScript type definitions for AnyList Home Assistant integration
 * 
 * This module provides comprehensive type definitions for the AnyList HACS integration,
 * supporting the TypeScript conversion project. It includes types for:
 * 
 * - Core data structures (ListItem, Recipe, Ingredient, etc.)
 * - API requests and responses
 * - Event system with EventEmitter support
 * - Configuration options
 * - Error handling
 * 
 * @version 1.5.9
 * @author AnyList HACS Integration Team
 * @license Apache-2.0
 */

// Core data structures
export {
  AnyListOptions,
  ListItem,
  Ingredient,
  NutritionalInfo,
  Recipe,
  RecipeCollection,
  ATTRIBUTES,
  CONFIG_KEYS,
} from './core';

// API types
export {
  ApiStatusCode,
  ApiResponse,
  ApiError,
  ApiErrorResponse,
  GetListsResponse,
  GetItemsResponse,
  GetAllItemsResponse,
  ItemOperationResponse,
  RecipeResponse,
  RecipesResponse,
  RecipeCollectionResponse,
  RecipeCollectionsResponse,
  AddItemRequest,
  UpdateItemRequest,
  RemoveItemRequest,
  CheckItemRequest,
  CreateRecipeRequest,
  UpdateRecipeRequest,
  CreateRecipeCollectionRequest,
  UpdateRecipeCollectionRequest,
  PaginationParams,
  RecipeQueryParams,
  isApiErrorResponse,
  isSuccessStatusCode,
  isErrorStatusCode,
} from './api';

// Event types
export {
  BaseEvent,
  ItemAddedEvent,
  ItemUpdatedEvent,
  ItemRemovedEvent,
  ItemCheckedEvent,
  ListRefreshedEvent,
  ListsUpdatedEvent,
  RecipeCreatedEvent,
  RecipeUpdatedEvent,
  RecipeDeletedEvent,
  RecipeCollectionCreatedEvent,
  RecipeCollectionUpdatedEvent,
  RecipeCollectionDeletedEvent,
  ConnectionEstablishedEvent,
  ConnectionLostEvent,
  ApiErrorEvent,
  AuthenticationFailedEvent,
  ConfigurationUpdatedEvent,
  IntegrationInitializedEvent,
  IntegrationShutdownEvent,
  IntentEvent,
  AnyListEventMap,
  AnyListEventName,
  AnyListEvent,
  EventListener,
  AnyListEventEmitter,
  createEvent,
} from './events';

/**
 * Integration constants
 */
export const INTEGRATION_INFO = {
  /** Domain name for the integration */
  DOMAIN: 'anylist',
  
  /** Current version */
  VERSION: '1.5.9',
  
  /** Integration name */
  NAME: 'AnyList',
  
  /** Default server port for binary mode */
  DEFAULT_SERVER_PORT: 28597,
  
  /** Default refresh interval in minutes */
  DEFAULT_REFRESH_INTERVAL: 30,
  
  /** Minimum refresh interval in minutes */
  MIN_REFRESH_INTERVAL: 15,
  
  /** Maximum refresh interval in minutes */
  MAX_REFRESH_INTERVAL: 120,
} as const;

/**
 * Service names available in the integration
 */
export const SERVICES = {
  ADD_ITEM: 'add_item',
  REMOVE_ITEM: 'remove_item',
  CHECK_ITEM: 'check_item',
  UNCHECK_ITEM: 'uncheck_item',
  GET_ITEMS: 'get_items',
  GET_ALL_ITEMS: 'get_all_items',
} as const;

/**
 * Intent types for voice commands
 */
export const INTENTS = {
  ADD_ITEM: 'AnylistAddItem',
  REMOVE_ITEM: 'AnylistRemoveItem',
  GET_ITEMS: 'AnylistGetItems',
} as const;

/**
 * API endpoints
 */
export const ENDPOINTS = {
  ADD: 'add',
  REMOVE: 'remove',
  UPDATE: 'update',
  CHECK: 'check',
  ITEMS: 'items',
  LISTS: 'lists',
  RECIPES: 'recipes',
  COLLECTIONS: 'collections',
} as const;

/**
 * Type utility to extract the type of a specific service
 */
export type ServiceType = typeof SERVICES[keyof typeof SERVICES];

/**
 * Type utility to extract the type of a specific intent
 */
export type IntentType = typeof INTENTS[keyof typeof INTENTS];

/**
 * Type utility to extract the type of a specific endpoint
 */
export type EndpointType = typeof ENDPOINTS[keyof typeof ENDPOINTS];

/**
 * Type guard to check if a string is a valid service name
 */
export function isValidService(service: string): service is ServiceType {
  return Object.values(SERVICES).includes(service as ServiceType);
}

/**
 * Type guard to check if a string is a valid intent type
 */
export function isValidIntent(intent: string): intent is IntentType {
  return Object.values(INTENTS).includes(intent as IntentType);
}

/**
 * Type guard to check if a string is a valid endpoint
 */
export function isValidEndpoint(endpoint: string): endpoint is EndpointType {
  return Object.values(ENDPOINTS).includes(endpoint as EndpointType);
}

/**
 * Utility type for deep partial (makes all nested properties optional)
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * Utility type for making specific fields required
 */
export type RequireFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

/**
 * Utility type for making specific fields optional
 */
export type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * Version information
 */
export const VERSION_INFO = {
  /** Package version */
  version: INTEGRATION_INFO.VERSION,
  
  /** TypeScript version used */
  typescriptVersion: '^5.0.0',
  
  /** Build date */
  buildDate: new Date().toISOString(),
} as const;