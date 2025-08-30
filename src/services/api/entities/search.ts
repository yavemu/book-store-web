// Common search interfaces for all entities

export interface SearchParams {
  q: string;
  page?: number;
  limit?: number;
}

export interface AdvancedFilterParams {
  [key: string]: string | number | undefined;
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
}

export interface SearchResponse<T> {
  data: T[];
  meta: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    searchTerm?: string;
    appliedFilters?: Record<string, any>;
  };
}

export interface QuickSearchResponse<T> extends SearchResponse<T> {
  suggestions?: string[];
  searchTime?: number;
}

export interface AdvancedFilterResponse<T> extends SearchResponse<T> {
  filterStats?: {
    totalWithoutFilters: number;
    filtersApplied: number;
  };
}