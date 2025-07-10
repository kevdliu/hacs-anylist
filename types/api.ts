/**
 * API response and error type definitions for AnyList integration
 */

import { ListItem, Recipe, RecipeCollection } from './core';

/**
 * Standard HTTP status codes used by the AnyList API
 */
export enum ApiStatusCode {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  NOT_MODIFIED = 304,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  CONFLICT = 409,
  INTERNAL_SERVER_ERROR = 500,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
  GATEWAY_TIMEOUT = 504,
}

/**
 * Base API response structure
 */
export interface ApiResponse<T = unknown> {
  /** HTTP status code */
  code: ApiStatusCode;
  
  /** Response data payload */
  data?: T;
  
  /** Human-readable message */
  message?: string;
  
  /** Additional metadata */
  meta?: Record<string, unknown>;
  
  /** Timestamp of the response */
  timestamp?: string;
}

/**
 * API error details
 */
export interface ApiError {
  /** Error code or type */
  code: string;
  
  /** Human-readable error message */
  message: string;
  
  /** Detailed error description */
  details?: string;
  
  /** Field-specific validation errors */
  fieldErrors?: Record<string, string[]>;
  
  /** Stack trace (development only) */
  stack?: string;
  
  /** Request ID for tracking */
  requestId?: string;
}

/**
 * API error response
 */
export interface ApiErrorResponse extends ApiResponse<never> {
  /** Error details */
  error: ApiError;
}

/**
 * Response for getting lists
 */
export interface GetListsResponse extends ApiResponse {
  data: {
    /** Array of list names */
    lists: string[];
  };
}

/**
 * Response for getting items from a list
 */
export interface GetItemsResponse extends ApiResponse {
  data: {
    /** Array of list items */
    items: ListItem[];
  };
}

/**
 * Response for getting all items (checked and unchecked)
 */
export interface GetAllItemsResponse extends ApiResponse {
  data: {
    /** Items that are not checked */
    uncheckedItems: string[];
    
    /** Items that are checked/completed */
    checkedItems: string[];
  };
}

/**
 * Response for item manipulation operations (add, remove, update, check)
 */
export interface ItemOperationResponse extends ApiResponse {
  data?: {
    /** The affected item */
    item?: ListItem;
    
    /** Number of items affected */
    affected?: number;
  };
}

/**
 * Response for recipe operations
 */
export interface RecipeResponse extends ApiResponse {
  data: {
    /** Recipe data */
    recipe: Recipe;
  };
}

/**
 * Response for getting multiple recipes
 */
export interface RecipesResponse extends ApiResponse {
  data: {
    /** Array of recipes */
    recipes: Recipe[];
    
    /** Total count for pagination */
    total?: number;
    
    /** Current page number */
    page?: number;
    
    /** Number of items per page */
    limit?: number;
  };
}

/**
 * Response for recipe collection operations
 */
export interface RecipeCollectionResponse extends ApiResponse {
  data: {
    /** Recipe collection data */
    collection: RecipeCollection;
  };
}

/**
 * Response for getting multiple recipe collections
 */
export interface RecipeCollectionsResponse extends ApiResponse {
  data: {
    /** Array of recipe collections */
    collections: RecipeCollection[];
    
    /** Total count for pagination */
    total?: number;
    
    /** Current page number */
    page?: number;
    
    /** Number of items per page */
    limit?: number;
  };
}

/**
 * Request payload for adding an item
 */
export interface AddItemRequest {
  /** Name of the item to add */
  name: string;
  
  /** Optional notes for the item */
  notes?: string;
  
  /** List to add the item to */
  list?: string;
  
  /** Whether the item should be checked initially */
  checked?: boolean;
}

/**
 * Request payload for updating an item
 */
export interface UpdateItemRequest {
  /** Item ID to update */
  id?: string;
  
  /** Item name to update (alternative to ID) */
  name?: string;
  
  /** New name for the item */
  newName?: string;
  
  /** New notes for the item */
  notes?: string;
  
  /** New checked status */
  checked?: boolean;
  
  /** List the item belongs to */
  list?: string;
}

/**
 * Request payload for removing an item
 */
export interface RemoveItemRequest {
  /** Item ID to remove */
  id?: string;
  
  /** Item name to remove (alternative to ID) */
  name?: string;
  
  /** List the item belongs to */
  list?: string;
}

/**
 * Request payload for checking/unchecking an item
 */
export interface CheckItemRequest {
  /** Item ID to check/uncheck */
  id?: string;
  
  /** Item name to check/uncheck (alternative to ID) */
  name?: string;
  
  /** New checked status */
  checked: boolean;
  
  /** List the item belongs to */
  list?: string;
}

/**
 * Request payload for creating a recipe
 */
export interface CreateRecipeRequest {
  /** Recipe data */
  recipe: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>;
}

/**
 * Request payload for updating a recipe
 */
export interface UpdateRecipeRequest {
  /** Recipe ID */
  id: string;
  
  /** Updated recipe data */
  recipe: Partial<Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>>;
}

/**
 * Request payload for creating a recipe collection
 */
export interface CreateRecipeCollectionRequest {
  /** Collection data */
  collection: Omit<RecipeCollection, 'id' | 'createdAt' | 'updatedAt'>;
}

/**
 * Request payload for updating a recipe collection
 */
export interface UpdateRecipeCollectionRequest {
  /** Collection ID */
  id: string;
  
  /** Updated collection data */
  collection: Partial<Omit<RecipeCollection, 'id' | 'createdAt' | 'updatedAt'>>;
}

/**
 * Pagination parameters for API requests
 */
export interface PaginationParams {
  /** Page number (1-based) */
  page?: number;
  
  /** Number of items per page */
  limit?: number;
  
  /** Sort field */
  sortBy?: string;
  
  /** Sort direction */
  sortOrder?: 'asc' | 'desc';
}

/**
 * Query parameters for filtering recipes
 */
export interface RecipeQueryParams extends PaginationParams {
  /** Search term for recipe name or description */
  search?: string;
  
  /** Filter by category */
  category?: string;
  
  /** Filter by cuisine */
  cuisine?: string;
  
  /** Filter by tags */
  tags?: string[];
  
  /** Minimum difficulty level */
  minDifficulty?: number;
  
  /** Maximum difficulty level */
  maxDifficulty?: number;
  
  /** Minimum rating */
  minRating?: number;
  
  /** Maximum preparation time in minutes */
  maxPrepTime?: number;
  
  /** Maximum cooking time in minutes */
  maxCookTime?: number;
}

/**
 * Type guard to check if a response is an error response
 */
export function isApiErrorResponse(response: ApiResponse | ApiErrorResponse): response is ApiErrorResponse {
  return 'error' in response && response.error !== undefined;
}

/**
 * Type guard to check if a status code indicates success
 */
export function isSuccessStatusCode(code: ApiStatusCode): boolean {
  return code >= 200 && code < 300;
}

/**
 * Type guard to check if a status code indicates an error
 */
export function isErrorStatusCode(code: ApiStatusCode): boolean {
  return code >= 400;
}