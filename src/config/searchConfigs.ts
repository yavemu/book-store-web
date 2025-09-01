// Centralized search configurations for all entities

import { SearchFilters } from '@/components/AdvancedSearchForm';
import { EntitySearchConfig } from '@/hooks/useAdvancedSearch';

// Import API functions and types
import { genresApi, GenreSearchParams, GenreAdvancedFilterDto } from '@/services/api/entities/genres';
import { genreSearchSchema, genreAdvancedFilterSchema } from '@/services/validation/schemas/genres';

// Utility function to combine text fields into search terms
const combineTextFields = (...fields: (string | undefined)[]): string => {
  return fields.filter(Boolean).join(' ').trim();
};

// Utility function to create base pagination
const createPagination = (pagination?: { page: number; limit: number; sortBy?: string; sortOrder?: 'ASC' | 'DESC' }) => ({
  page: pagination?.page || 1,
  limit: pagination?.limit || 10,
  sortBy: pagination?.sortBy || 'createdAt',
  sortOrder: pagination?.sortOrder || 'DESC' as const
});

// =========================
// GENRES CONFIGURATION
// =========================
export const genresSearchConfig: EntitySearchConfig<GenreSearchParams, GenreAdvancedFilterDto> = {
  // Map SearchFilters to search parameters (/search endpoint)
  mapToSearchParams: (filters: SearchFilters, pagination) => {
    const searchTerms = combineTextFields(filters.name, filters.description);
    
    return {
      term: searchTerms,
      q: searchTerms,
      ...createPagination(pagination)
    };
  },

  // Map SearchFilters to advanced filter parameters (/advanced-filter endpoint)  
  mapToAdvancedFilter: (filters: SearchFilters, pagination) => ({
    name: filters.name,
    description: filters.description,
    isActive: true, // Could be made configurable
    createdDateStart: filters.startDate,
    createdDateEnd: filters.endDate,
    pagination: createPagination(pagination)
  }),

  // API functions
  searchApi: genresApi.search,
  advancedFilterApi: genresApi.advancedFilter,

  // Validation schemas
  searchSchema: genreSearchSchema,
  advancedFilterSchema: genreAdvancedFilterSchema
};

// =========================
// AUTHORS CONFIGURATION (Template for future implementation)
// =========================
/*
export const authorsSearchConfig: EntitySearchConfig<AuthorSearchParams, AuthorAdvancedFilterDto> = {
  mapToSearchParams: (filters: SearchFilters, pagination) => {
    const searchTerms = combineTextFields(filters.name, filters.biography);
    
    return {
      term: searchTerms,
      q: searchTerms,
      ...createPagination(pagination)
    };
  },

  mapToAdvancedFilter: (filters: SearchFilters, pagination) => ({
    name: filters.name,
    biography: filters.biography,
    nationality: filters.nationality,
    birthDateStart: filters.startDate,
    birthDateEnd: filters.endDate,
    pagination: createPagination(pagination)
  }),

  searchApi: authorsApi.search,
  advancedFilterApi: authorsApi.advancedFilter,
  searchSchema: authorSearchSchema,
  advancedFilterSchema: authorAdvancedFilterSchema
};
*/

// =========================
// BOOKS CONFIGURATION (Template for future implementation)  
// =========================
/*
export const booksSearchConfig: EntitySearchConfig<BookSearchParams, BookAdvancedFilterDto> = {
  mapToSearchParams: (filters: SearchFilters, pagination) => {
    const searchTerms = combineTextFields(filters.title, filters.description, filters.isbn);
    
    return {
      term: searchTerms,
      q: searchTerms,
      ...createPagination(pagination)
    };
  },

  mapToAdvancedFilter: (filters: SearchFilters, pagination) => ({
    title: filters.title,
    description: filters.description,
    isbn: filters.isbn,
    authorId: filters.authorId,
    genreId: filters.genreId,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    publicationDateStart: filters.startDate,
    publicationDateEnd: filters.endDate,
    pagination: createPagination(pagination)
  }),

  searchApi: booksApi.search,
  advancedFilterApi: booksApi.advancedFilter,
  searchSchema: bookSearchSchema,
  advancedFilterSchema: bookAdvancedFilterSchema
};
*/

// Export all configurations
export const searchConfigs = {
  genres: genresSearchConfig,
  // authors: authorsSearchConfig,  // Uncomment when implemented
  // books: booksSearchConfig,      // Uncomment when implemented
};