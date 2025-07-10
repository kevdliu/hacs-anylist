# TypeScript Type Definitions for AnyList HACS Integration

This directory contains comprehensive TypeScript type definitions for the AnyList Home Assistant Custom Component (HACS) integration.

## Overview

The TypeScript types provide full type safety for the AnyList integration, covering:

- **Core Data Structures**: `ListItem`, `Recipe`, `Ingredient`, `NutritionalInfo`, etc.
- **API Types**: Request/response interfaces, error handling, pagination
- **Event System**: EventEmitter types for integration events
- **Configuration**: Options and settings for the integration

## Type Modules

### `core.ts`
Defines the main data structures used throughout the integration:

- `AnyListOptions`: Configuration options for the integration
- `ListItem`: Individual todo list items with id, name, checked status, notes
- `Recipe`: Complete recipe with ingredients, instructions, nutrition info
- `Ingredient`: Recipe ingredients with quantity, unit, preparation notes
- `NutritionalInfo`: Comprehensive nutritional data
- `RecipeCollection`: Collections of recipes with metadata

### `api.ts`
Provides types for all API interactions:

- `ApiResponse<T>`: Generic response wrapper with status codes
- Request types: `AddItemRequest`, `UpdateItemRequest`, etc.
- Response types: `GetItemsResponse`, `RecipeResponse`, etc.
- Error handling: `ApiError`, `ApiErrorResponse`
- Type guards: `isApiErrorResponse()`, `isSuccessStatusCode()`

### `events.ts`
Defines a complete event system for the integration:

- Event types: `ItemAddedEvent`, `RecipeCreatedEvent`, etc.
- `AnyListEventEmitter`: Type-safe EventEmitter interface
- `AnyListEventMap`: Maps event names to their types
- Helper functions: `createEvent()` for type-safe event creation

### `index.ts`
Main entry point that exports all types and provides:

- Re-exports of all types from other modules
- Integration constants (`SERVICES`, `INTENTS`, `ENDPOINTS`)
- Utility types (`DeepPartial`, `RequireFields`)
- Type guards and validation functions

## Usage Examples

### Basic List Item Operations

```typescript
import { ListItem, AddItemRequest, ApiResponse } from './types';

// Type-safe item creation
const newItem: AddItemRequest = {
  name: "Buy groceries",
  notes: "Don't forget milk",
  list: "Shopping List"
};

// Type-safe response handling
const response: ApiResponse<ListItem> = await api.addItem(newItem);
if (response.code === 200) {
  console.log(`Added item: ${response.data?.name}`);
}
```

### Recipe Management

```typescript
import { Recipe, CreateRecipeRequest, NutritionalInfo } from './types';

const nutrition: NutritionalInfo = {
  calories: 350,
  protein: 25,
  totalCarbohydrates: 30
};

const recipe: CreateRecipeRequest = {
  recipe: {
    name: "Chicken Stir Fry",
    ingredients: [
      { id: "1", name: "Chicken breast", quantity: 1, unit: "lb" },
      { id: "2", name: "Broccoli", quantity: 2, unit: "cups" }
    ],
    instructions: ["Heat oil", "Cook chicken", "Add vegetables"],
    nutrition,
    prepTime: 15,
    cookTime: 10
  }
};
```

### Event Handling

```typescript
import { AnyListEventEmitter, ItemAddedEvent } from './types';

const emitter: AnyListEventEmitter = new EventEmitter();

// Type-safe event listener
emitter.on('item:added', (event: ItemAddedEvent) => {
  console.log(`Item "${event.item.name}" added to ${event.listName}`);
});
```

### Error Handling

```typescript
import { ApiErrorResponse, isApiErrorResponse } from './types';

const result = await api.getItems();
if (isApiErrorResponse(result)) {
  console.error(`API Error: ${result.error.message}`);
  return;
}

// Type is now narrowed to successful response
const items = result.data.items;
```

## Development

### Building

```bash
npm run build
```

### Type Checking

```bash
npm run type-check
```

### Linting

```bash
npm run lint
```

## Integration with Home Assistant

These types are designed to work seamlessly with the existing Python-based Home Assistant integration. They provide:

1. **Migration Path**: Clear types for converting Python code to TypeScript
2. **API Documentation**: Self-documenting API through type definitions  
3. **Development Safety**: Compile-time type checking prevents runtime errors
4. **IDE Support**: Full IntelliSense and autocompletion

## Contributing

When adding new types:

1. Follow existing naming conventions
2. Add comprehensive JSDoc comments
3. Include usage examples in comments
4. Update the main `index.ts` export
5. Run type checking and linting before committing

## Related Issues

This TypeScript type definition system is part of the broader TypeScript conversion project tracked in issue #1.