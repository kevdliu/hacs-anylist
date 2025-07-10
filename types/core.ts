/**
 * Core data structure types for AnyList Home Assistant integration
 */

/**
 * Configuration options for AnyList integration
 */
export interface AnyListOptions {
  /** Server address for AnyList API (for addon server mode) */
  server_addr?: string;
  
  /** Email for authentication (for binary server mode) */
  email?: string;
  
  /** Password for authentication (for binary server mode) */
  password?: string;
  
  /** Path to server binary (for binary server mode) */
  server_binary?: string;
  
  /** Default list name to use when none specified */
  default_list?: string;
  
  /** Refresh interval in minutes for data updates */
  refresh_interval?: number;
}

/**
 * Represents a single item in an AnyList todo list
 */
export interface ListItem {
  /** Unique identifier for the item */
  id: string;
  
  /** Display name/title of the item */
  name: string;
  
  /** Whether the item is checked/completed */
  checked: boolean;
  
  /** Optional notes/description for the item */
  notes?: string;
  
  /** List name this item belongs to */
  list?: string;
}

/**
 * Represents an ingredient with optional quantity and unit information
 */
export interface Ingredient {
  /** Unique identifier for the ingredient */
  id: string;
  
  /** Name of the ingredient */
  name: string;
  
  /** Quantity of the ingredient */
  quantity?: number;
  
  /** Unit of measurement (e.g., "cups", "tbsp", "lbs") */
  unit?: string;
  
  /** Optional preparation notes (e.g., "chopped", "diced") */
  preparation?: string;
  
  /** Whether this ingredient has been checked off */
  checked?: boolean;
}

/**
 * Nutritional information for recipes or ingredients
 */
export interface NutritionalInfo {
  /** Calories per serving */
  calories?: number;
  
  /** Total fat in grams */
  totalFat?: number;
  
  /** Saturated fat in grams */
  saturatedFat?: number;
  
  /** Trans fat in grams */
  transFat?: number;
  
  /** Cholesterol in milligrams */
  cholesterol?: number;
  
  /** Sodium in milligrams */
  sodium?: number;
  
  /** Total carbohydrates in grams */
  totalCarbohydrates?: number;
  
  /** Dietary fiber in grams */
  dietaryFiber?: number;
  
  /** Total sugars in grams */
  totalSugars?: number;
  
  /** Added sugars in grams */
  addedSugars?: number;
  
  /** Protein in grams */
  protein?: number;
  
  /** Vitamin D in micrograms */
  vitaminD?: number;
  
  /** Calcium in milligrams */
  calcium?: number;
  
  /** Iron in milligrams */
  iron?: number;
  
  /** Potassium in milligrams */
  potassium?: number;
}

/**
 * Represents a recipe with ingredients and instructions
 */
export interface Recipe {
  /** Unique identifier for the recipe */
  id: string;
  
  /** Name/title of the recipe */
  name: string;
  
  /** Optional description of the recipe */
  description?: string;
  
  /** List of ingredients with quantities */
  ingredients: Ingredient[];
  
  /** Step-by-step cooking instructions */
  instructions: string[];
  
  /** Preparation time in minutes */
  prepTime?: number;
  
  /** Cooking time in minutes */
  cookTime?: number;
  
  /** Total time in minutes (prep + cook) */
  totalTime?: number;
  
  /** Number of servings this recipe makes */
  servings?: number;
  
  /** Nutritional information for the recipe */
  nutrition?: NutritionalInfo;
  
  /** Recipe category (e.g., "Dinner", "Dessert", "Appetizer") */
  category?: string;
  
  /** Cuisine type (e.g., "Italian", "Mexican", "Asian") */
  cuisine?: string;
  
  /** Difficulty level (1-5 scale) */
  difficulty?: number;
  
  /** User rating (1-5 scale) */
  rating?: number;
  
  /** Optional notes about the recipe */
  notes?: string;
  
  /** Source of the recipe (URL, book, etc.) */
  source?: string;
  
  /** Tags for categorization and search */
  tags?: string[];
  
  /** Creation timestamp */
  createdAt?: Date;
  
  /** Last modified timestamp */
  updatedAt?: Date;
}

/**
 * Collection of recipes with metadata
 */
export interface RecipeCollection {
  /** Unique identifier for the collection */
  id: string;
  
  /** Name of the collection */
  name: string;
  
  /** Optional description of the collection */
  description?: string;
  
  /** Array of recipes in this collection */
  recipes: Recipe[];
  
  /** Owner/creator of the collection */
  owner?: string;
  
  /** Whether the collection is public or private */
  isPublic?: boolean;
  
  /** Creation timestamp */
  createdAt?: Date;
  
  /** Last modified timestamp */
  updatedAt?: Date;
  
  /** Tags for categorization */
  tags?: string[];
}

/**
 * Common attributes used throughout the integration
 */
export const ATTRIBUTES = {
  ID: 'id',
  NAME: 'name',
  LIST: 'list',
  CHECKED: 'checked',
  NOTES: 'notes',
} as const;

/**
 * Configuration keys used in Home Assistant
 */
export const CONFIG_KEYS = {
  SERVER_ADDR: 'server_addr',
  EMAIL: 'email',
  PASSWORD: 'password',
  SERVER_BINARY: 'server_binary',
  DEFAULT_LIST: 'default_list',
  REFRESH_INTERVAL: 'refresh_interval',
} as const;