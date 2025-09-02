/**
 * Centralized export for all unified dashboard configurations
 * Single source of truth for all entity configurations
 */

export { authorsUnifiedConfig } from './authors.unified.config';
export { booksUnifiedConfig } from './books.unified.config';
export { genresUnifiedConfig } from './genres.unified.config';
export { usersUnifiedConfig } from './users.unified.config';
export { publishersUnifiedConfig } from './publishers.unified.config';
export { inventoryMovementsUnifiedConfig } from './inventory-movements.unified.config';
export { auditUnifiedConfig } from './audit.unified.config';

// Type-safe configuration registry
export const unifiedConfigs = {
  authors: authorsUnifiedConfig,
  books: booksUnifiedConfig,
  genres: genresUnifiedConfig,
  users: usersUnifiedConfig,
  publishers: publishersUnifiedConfig,
  'inventory-movements': inventoryMovementsUnifiedConfig,
  audit: auditUnifiedConfig,
} as const;

export type EntityType = keyof typeof unifiedConfigs;

/**
 * Utility function to get configuration by entity type
 */
export function getUnifiedConfig(entityType: EntityType) {
  return unifiedConfigs[entityType];
}

/**
 * Utility function to validate entity type
 */
export function isValidEntityType(entityType: string): entityType is EntityType {
  return entityType in unifiedConfigs;
}