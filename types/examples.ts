/**
 * Example usage of the AnyList TypeScript types
 * 
 * This file demonstrates how to use the type definitions in practice.
 * It's not part of the build but serves as documentation and validation.
 */

import {
  // Core types
  AnyListOptions,
  ListItem,
  Recipe,
  NutritionalInfo,
  RecipeCollection,
  
  // API types  
  AddItemRequest,
  GetItemsResponse,
  ApiErrorResponse,
  ApiStatusCode,
  isApiErrorResponse,
  
  // Event types
  AnyListEventEmitter,
  ItemAddedEvent,
  createEvent,
  
  // Constants
  SERVICES,
  INTENTS,
  CONFIG_KEYS
} from './index';

// Example: Configuration setup
const config: AnyListOptions = {
  server_addr: 'http://localhost:28597',
  default_list: 'Shopping List',
  refresh_interval: 30
};

// Example: Working with list items
const groceryItem: ListItem = {
  id: '123',
  name: 'Organic Milk',
  checked: false,
  notes: '2% fat, 1 gallon',
  list: 'Groceries'
};

// Example: API request
const addItemRequest: AddItemRequest = {
  name: 'Bananas',
  notes: 'Ripe, organic if available',
  list: 'Groceries'
};

// Example: Recipe with nutrition info
const nutrition: NutritionalInfo = {
  calories: 280,
  protein: 24,
  totalCarbohydrates: 12,
  totalFat: 16,
  sodium: 450,
  dietaryFiber: 3
};

const chickenSalad: Recipe = {
  id: 'recipe-001',
  name: 'Grilled Chicken Caesar Salad',
  description: 'Fresh and healthy salad with grilled chicken',
  ingredients: [
    {
      id: 'ing-001',
      name: 'Chicken breast',
      quantity: 6,
      unit: 'oz',
      preparation: 'boneless, skinless'
    },
    {
      id: 'ing-002', 
      name: 'Romaine lettuce',
      quantity: 1,
      unit: 'head',
      preparation: 'chopped'
    },
    {
      id: 'ing-003',
      name: 'Caesar dressing',
      quantity: 2,
      unit: 'tbsp'
    }
  ],
  instructions: [
    'Preheat grill to medium-high heat',
    'Season chicken with salt and pepper',
    'Grill chicken 6-7 minutes per side until internal temp reaches 165°F',
    'Let chicken rest 5 minutes, then slice',
    'Toss lettuce with dressing',
    'Top with sliced chicken and serve'
  ],
  prepTime: 15,
  cookTime: 15,
  totalTime: 30,
  servings: 2,
  nutrition,
  category: 'Main Course',
  cuisine: 'American',
  difficulty: 2,
  rating: 5,
  tags: ['healthy', 'high-protein', 'low-carb'],
  createdAt: new Date('2024-01-15'),
  updatedAt: new Date('2024-01-20')
};

// Example: Recipe collection
const healthyMeals: RecipeCollection = {
  id: 'collection-001',
  name: 'Healthy Family Meals',
  description: 'Nutritious and delicious meals the whole family will love',
  recipes: [chickenSalad],
  owner: 'user123',
  isPublic: false,
  createdAt: new Date('2024-01-10'),
  tags: ['healthy', 'family-friendly']
};

// Example: Type-safe API response handling
async function handleItemsResponse(response: GetItemsResponse | ApiErrorResponse): Promise<ListItem[]> {
  if (isApiErrorResponse(response)) {
    console.error(`API Error: ${response.error.message}`);
    throw new Error(response.error.message);
  }
  
  if (response.code !== ApiStatusCode.OK) {
    console.warn(`Unexpected status code: ${response.code}`);
  }
  
  return response.data.items;
}

// Example: Event handling with type safety
class AnyListIntegration {
  private eventEmitter: AnyListEventEmitter;
  
  constructor(emitter: AnyListEventEmitter) {
    this.eventEmitter = emitter;
    this.setupEventListeners();
  }
  
  private setupEventListeners(): void {
    // Type-safe event listeners
    this.eventEmitter.on('item:added', this.handleItemAdded.bind(this));
    this.eventEmitter.on('list:refreshed', this.handleListRefreshed.bind(this));
    this.eventEmitter.on('api:error', this.handleApiError.bind(this));
  }
  
  private handleItemAdded(event: ItemAddedEvent): void {
    console.log(`New item "${event.item.name}" added to ${event.listName}`);
    
    // Emit a custom event
    const customEvent = createEvent('item:added', {
      item: event.item,
      listName: event.listName
    }, 'integration');
    
    this.eventEmitter.emit('item:added', customEvent);
  }
  
  private handleListRefreshed(event: { listName: string; items: ListItem[] }): void {
    console.log(`List "${event.listName}" refreshed with ${event.items.length} items`);
  }
  
  private handleApiError(event: { endpoint: string; error: { message: string } }): void {
    console.error(`API Error on ${event.endpoint}: ${event.error.message}`);
  }
  
  // Example service call using constants
  async addItem(): Promise<void> {
    console.log(`Calling service: ${SERVICES.ADD_ITEM}`);
    // Implementation would go here
  }
}

// Example: Using configuration constants
function validateConfig(config: Record<string, unknown>): boolean {
  const requiredFields = [
    CONFIG_KEYS.SERVER_ADDR,
    CONFIG_KEYS.EMAIL,
    CONFIG_KEYS.PASSWORD
  ];
  
  return requiredFields.every(field => field in config);
}

// Example: Intent handling  
function processIntent(intentType: string, slots: Record<string, string>): string {
  switch (intentType) {
    case INTENTS.ADD_ITEM:
      return `Adding "${slots.item}" to your list`;
    case INTENTS.REMOVE_ITEM:
      return `Removing "${slots.item}" from your list`;
    case INTENTS.GET_ITEMS:
      return 'Getting your list items';
    default:
      return 'Unknown intent';
  }
}

// Export examples for documentation
export {
  config,
  groceryItem,
  addItemRequest,
  chickenSalad,
  healthyMeals,
  handleItemsResponse,
  AnyListIntegration,
  validateConfig,
  processIntent
};