import { useApiRequest } from './useApiRequest';
import { SearchFilters } from '@/components/AdvancedSearchForm';

interface UseSearchApiOptions<TResponse> {
  entity: string;
  onSuccess?: (response: TResponse) => void;
  onError?: (error: any) => void;
}

interface SearchApiResponse<T> {
  data: T[];
  meta: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export function useSearchApi<T = any>({ entity, onSuccess, onError }: UseSearchApiOptions<SearchApiResponse<T>>) {
  // Regular search using GET /api/[entity]/search?q=term
  const { loading: searchLoading, execute: executeSearch, ...searchState } = useApiRequest<{ q: string }, SearchApiResponse<T>>({
    endpoint: `/${entity}/search`,
    method: 'GET',
    onSuccess,
    onError
  });

  // Advanced filter using POST /api/[entity]/advanced-filter
  const { loading: filterLoading, execute: executeAdvancedFilter, ...filterState } = useApiRequest<SearchFilters, SearchApiResponse<T>>({
    endpoint: `/${entity}/advanced-filter`,
    method: 'POST',
    onSuccess,
    onError
  });

  // Quick search function for search input (minimum 3 characters)
  const quickSearch = async (searchTerm: string) => {
    const trimmedTerm = searchTerm.trim();
    if (trimmedTerm.length < 3) return;
    
    // Convert to query string for GET request
    const queryParams = new URLSearchParams({ q: trimmedTerm });
    const endpoint = `/${entity}/search?${queryParams.toString()}`;
    
    return executeSearch({ q: trimmedTerm });
  };

  // Advanced filter function (minimum 3 characters in any field)
  const advancedFilter = async (filters: SearchFilters) => {
    // Check if we have at least one field with 3+ characters/digits
    const hasValidSearchTerm = Object.entries(filters).some(([key, value]) => {
      if (!value) return false;
      const trimmedValue = String(value).trim();
      return trimmedValue.length >= 3;
    });

    if (!hasValidSearchTerm) return;

    // Clean filters
    const cleanFilters = Object.entries(filters).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        const trimmedValue = String(value).trim();
        if (trimmedValue.length > 0) {
          acc[key] = trimmedValue;
        }
      }
      return acc;
    }, {} as SearchFilters);

    if (Object.keys(cleanFilters).length === 0) return;

    return executeAdvancedFilter(cleanFilters);
  };

  return {
    // States
    loading: searchLoading || filterLoading,
    searchLoading,
    filterLoading,
    error: searchState.error || filterState.error,
    data: searchState.data || filterState.data,
    
    // Functions
    quickSearch,
    advancedFilter,
    
    // Raw execute functions (if needed)
    executeSearch,
    executeAdvancedFilter
  };
}