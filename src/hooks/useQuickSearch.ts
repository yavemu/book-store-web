import { useState, useEffect } from 'react';
import { useDebounce } from './useDebounce';
import { useSearchApi } from './useSearchApi';

interface UseQuickSearchOptions<T> {
  entity: string;
  onSuccess?: (response: any) => void;
  onError?: (error: any) => void;
}

export function useQuickSearch<T = any>({ entity, onSuccess, onError }: UseQuickSearchOptions<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  // Debounce the search term
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  
  // Use the search API hook
  const { quickSearch, searchLoading } = useSearchApi({
    entity,
    onSuccess: (response) => {
      setIsSearching(false);
      onSuccess?.(response);
    },
    onError: (error) => {
      setIsSearching(false);
      onError?.(error);
    }
  });

  // Effect to trigger search when debounced term changes
  useEffect(() => {
    const trimmedTerm = debouncedSearchTerm.trim();
    
    if (trimmedTerm.length >= 3) {
      setIsSearching(true);
      quickSearch(trimmedTerm);
    } else if (trimmedTerm.length === 0) {
      // Clear results when search is empty
      setIsSearching(false);
      onSuccess?.(null);
    }
  }, [debouncedSearchTerm, quickSearch, onSuccess]);

  return {
    searchTerm,
    setSearchTerm,
    isSearching: isSearching || searchLoading,
    hasMinimumChars: searchTerm.trim().length >= 3
  };
}