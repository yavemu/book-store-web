'use client';

import { useState } from 'react';
import { useApiRequest } from './useApiRequest';
import { SearchFilters } from '@/components/AdvancedSearchForm';
import { useGlobalPagination } from '@/contexts/GlobalPaginationContext';

// Base interface for search parameters
export interface BaseSearchParams {
  term: string;
  q: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

// Base interface for advanced filter parameters
export interface BaseAdvancedFilterDto {
  pagination: {
    page: number;
    limit: number;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
  };
  [key: string]: any; // Allow additional entity-specific fields
}

// Configuration for each entity
export interface EntitySearchConfig<TSearchParams, TAdvancedFilterDto> {
  // Function to convert SearchFilters to search parameters
  mapToSearchParams: (filters: SearchFilters, pagination?: { page: number; limit: number; sortBy?: string; sortOrder?: 'ASC' | 'DESC' }) => TSearchParams;
  
  // Function to convert SearchFilters to advanced filter parameters  
  mapToAdvancedFilter: (filters: SearchFilters, pagination?: { page: number; limit: number; sortBy?: string; sortOrder?: 'ASC' | 'DESC' }) => TAdvancedFilterDto;
  
  // API functions
  searchApi: (params: TSearchParams) => Promise<any>;
  advancedFilterApi: (params: TAdvancedFilterDto) => Promise<any>;
  
  // Validation schemas
  searchSchema?: any;
  advancedFilterSchema?: any;
}

export interface UseAdvancedSearchOptions<TSearchParams, TAdvancedFilterDto> {
  config: EntitySearchConfig<TSearchParams, TAdvancedFilterDto>;
  entityName: string; // Required for global pagination context
  defaultPagination?: { page: number; limit: number; sortBy?: string; sortOrder?: 'ASC' | 'DESC' };
}

export function useAdvancedSearch<TSearchParams extends BaseSearchParams, TAdvancedFilterDto extends BaseAdvancedFilterDto>({
  config,
  entityName,
  defaultPagination = { page: 1, limit: 10 }
}: UseAdvancedSearchOptions<TSearchParams, TAdvancedFilterDto>) {
  
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({});
  
  // Use global pagination context
  const {
    getEntityPagination,
    updateEntityPagination,
    handlePageChange,
    handleSortChange: globalHandleSortChange,
    handleLimitChange,
    updateFromApiMeta,
    clearEntityParameter
  } = useGlobalPagination();
  
  // Get current pagination for this entity
  const sharedPagination = getEntityPagination(entityName);

  // Hook for search endpoint (button)
  const { 
    loading: searchLoading, 
    error: searchError, 
    data: searchData, 
    execute: executeSearch 
  } = useApiRequest({
    apiFunction: (params: TSearchParams) => {
      console.log(`Calling search API with params:`, params);
      return config.searchApi(params);
    },
    validationSchema: config.searchSchema,
    onSuccess: (response) => {
      console.log('Search response (button):', response);
      // Sync pagination state with API response meta
      updateFromApiMeta(entityName, response?.meta);
    },
    onError: (error) => {
      console.error('Search error (button):', error);
    }
  });

  // Hook for advanced filter endpoint (checkbox)
  const { 
    loading: advancedFilterLoading, 
    error: advancedFilterError, 
    data: advancedFilterData, 
    execute: executeAdvancedFilter 
  } = useApiRequest({
    apiFunction: (params: TAdvancedFilterDto) => {
      console.log(`Calling advanced filter API with params:`, params);
      return config.advancedFilterApi(params);
    },
    validationSchema: config.advancedFilterSchema,
    onSuccess: (response) => {
      console.log('Advanced filter response (checkbox):', response);
      // Sync pagination state with API response meta
      updateFromApiMeta(entityName, response?.meta);
    },
    onError: (error) => {
      console.error('Advanced filter error (checkbox):', error);
    }
  });

  // Handle advanced search with button (uses /search endpoint)
  const handleAdvancedSearch = (filters: SearchFilters) => {
    setSearchFilters(filters);
    console.log('Advanced search with button - using /search endpoint:', filters);

    // Use entity-specific mapping function with shared pagination
    const searchParams = config.mapToSearchParams(filters, sharedPagination);
    
    // Validate that we have search terms
    if (!searchParams.term || searchParams.term.trim().length === 0) {
      console.log('No search terms provided, skipping search');
      return;
    }

    executeSearch(searchParams);
  };

  // Handle advanced filter with checkbox (real-time, uses /advanced-filter endpoint)
  const handleAdvancedFilter = (filters: SearchFilters) => {
    console.log('Advanced filter with checkbox - using /advanced-filter endpoint:', filters);

    // Use entity-specific mapping function with shared pagination
    const filterParams = config.mapToAdvancedFilter(filters, sharedPagination);
    executeAdvancedFilter(filterParams);
  };

  // Clear all filters
  const handleClearAdvancedSearch = () => {
    setSearchFilters({});
  };

  // Handle pagination changes (shared across all search methods)
  const handlePaginationChange = (newPagination: Partial<typeof sharedPagination>) => {
    updateEntityPagination(entityName, newPagination);
  };

  // Handle sorting changes (shared across all search methods)
  const handleSortChange = (field: string, direction: 'ASC' | 'DESC') => {
    globalHandleSortChange(entityName, field, direction);
  };

  // Clear pagination parameters
  const handleClearPagination = () => {
    // Reset to default values
    updateEntityPagination(entityName, {
      page: 1,
      limit: defaultPagination.limit,
      sortBy: defaultPagination.sortBy || 'createdAt',
      sortOrder: defaultPagination.sortOrder || 'DESC'
    });
  };

  // Helper function to update pagination from any API response
  const updatePaginationFromMeta = (meta: any) => {
    updateFromApiMeta(entityName, meta);
  };

  return {
    // State
    searchFilters,
    setSearchFilters,
    sharedPagination,
    entityName,
    
    // Search (button) state
    searchLoading,
    searchError,
    searchData,
    
    // Advanced filter (checkbox) state
    advancedFilterLoading,
    advancedFilterError,
    advancedFilterData,
    
    // Combined loading state
    isLoading: searchLoading || advancedFilterLoading,
    
    // Handlers for AdvancedSearchForm
    handleAdvancedSearch,
    handleAdvancedFilter,
    handleClearAdvancedSearch,
    
    // Pagination handlers
    handlePaginationChange,
    handleSortChange,
    handleClearPagination,
    updatePaginationFromMeta,
    
    // Manual execution functions
    executeSearch,
    executeAdvancedFilter
  };
}