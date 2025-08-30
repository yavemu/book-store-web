import { renderHook, act, waitFor } from '@testing-library/react';
import { useQuickSearch } from '../useQuickSearch';

// Mock useDebounce
const mockUseDebounce = jest.fn();
jest.mock('../useDebounce', () => ({
  useDebounce: jest.fn(),
}));

// Set up the mock implementation before each test
const mockUseDebounceRef = require('../useDebounce').useDebounce as jest.Mock;

// Mock useSearchApi
const mockQuickSearch = jest.fn();
const mockUseSearchApi = {
  quickSearch: mockQuickSearch,
  searchLoading: false,
};

jest.mock('../useSearchApi', () => ({
  useSearchApi: jest.fn(() => mockUseSearchApi),
}));

describe('useQuickSearch', () => {
  const mockOnSuccess = jest.fn();
  const mockOnError = jest.fn();
  
  const defaultOptions = {
    entity: 'test-entity',
    onSuccess: mockOnSuccess,
    onError: mockOnError,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseDebounceRef.mockImplementation((value) => value || '');
    
    const mockUseSearchApiImport = require('../useSearchApi').useSearchApi as jest.Mock;
    mockUseSearchApiImport.mockReturnValue(mockUseSearchApi);
  });

  describe('Initial State', () => {
    it('should initialize with correct default values', () => {
      const { result } = renderHook(() => useQuickSearch(defaultOptions));

      expect(result.current.searchTerm).toBe('');
      expect(result.current.isSearching).toBe(false);
      expect(result.current.hasMinimumChars).toBe(false);
      expect(typeof result.current.setSearchTerm).toBe('function');
    });

    it('should initialize useSearchApi with correct parameters', () => {
      renderHook(() => useQuickSearch(defaultOptions));
      
      const mockUseSearchApiImport = require('../useSearchApi').useSearchApi as jest.Mock;
      expect(mockUseSearchApiImport).toHaveBeenCalledWith({
        entity: 'test-entity',
        onSuccess: expect.any(Function),
        onError: expect.any(Function),
      });
    });
  });

  describe('Search Term Management', () => {
    it('should update search term when setSearchTerm is called', () => {
      const { result } = renderHook(() => useQuickSearch(defaultOptions));

      act(() => {
        result.current.setSearchTerm('test query');
      });

      expect(result.current.searchTerm).toBe('test query');
    });

    it('should update hasMinimumChars based on search term length', () => {
      const { result } = renderHook(() => useQuickSearch(defaultOptions));

      // Less than 3 characters
      act(() => {
        result.current.setSearchTerm('te');
      });
      expect(result.current.hasMinimumChars).toBe(false);

      // Exactly 3 characters
      act(() => {
        result.current.setSearchTerm('tes');
      });
      expect(result.current.hasMinimumChars).toBe(true);

      // More than 3 characters
      act(() => {
        result.current.setSearchTerm('test');
      });
      expect(result.current.hasMinimumChars).toBe(true);
    });

    it('should handle whitespace in minimum character calculation', () => {
      const { result } = renderHook(() => useQuickSearch(defaultOptions));

      act(() => {
        result.current.setSearchTerm('  te  ');
      });
      expect(result.current.hasMinimumChars).toBe(false);

      act(() => {
        result.current.setSearchTerm('  test  ');
      });
      expect(result.current.hasMinimumChars).toBe(true);
    });
  });

  describe('Debounce Integration', () => {
    it('should debounce search term with 500ms delay', () => {
      renderHook(() => useQuickSearch(defaultOptions));

      expect(mockUseDebounceRef).toHaveBeenCalledWith('', 500);
    });

    it('should use debounced value for search triggering', () => {
      mockUseDebounceRef.mockReturnValue('debounced-value');
      
      const { result } = renderHook(() => useQuickSearch(defaultOptions));

      act(() => {
        result.current.setSearchTerm('original-value');
      });

      // The effect should use the debounced value, not the original
      // This is tested indirectly through the search behavior
      expect(mockUseDebounceRef).toHaveBeenCalledWith('original-value', 500);
    });
  });

  describe('Search Triggering', () => {
    it('should trigger search when debounced term has 3+ characters', async () => {
      mockUseDebounceRef.mockReturnValue('test search');
      
      const { result } = renderHook(() => useQuickSearch(defaultOptions));

      act(() => {
        result.current.setSearchTerm('test search');
      });

      await waitFor(() => {
        expect(mockQuickSearch).toHaveBeenCalledWith('test search');
        expect(result.current.isSearching).toBe(true);
      });
    });

    it('should not trigger search when term has less than 3 characters', async () => {
      mockUseDebounceRef.mockReturnValue('te');
      
      const { result } = renderHook(() => useQuickSearch(defaultOptions));

      act(() => {
        result.current.setSearchTerm('te');
      });

      await waitFor(() => {
        expect(mockQuickSearch).not.toHaveBeenCalled();
        expect(result.current.isSearching).toBe(false);
      });
    });

    it('should trim search term before checking minimum length', async () => {
      mockUseDebounceRef.mockReturnValue('  test  ');
      
      const { result } = renderHook(() => useQuickSearch(defaultOptions));

      act(() => {
        result.current.setSearchTerm('  test  ');
      });

      await waitFor(() => {
        expect(mockQuickSearch).toHaveBeenCalledWith('test');
      });
    });

    it('should clear results when search term is empty', async () => {
      mockUseDebounceRef.mockReturnValue('');
      
      const { result } = renderHook(() => useQuickSearch(defaultOptions));

      act(() => {
        result.current.setSearchTerm('');
      });

      await waitFor(() => {
        expect(mockOnSuccess).toHaveBeenCalledWith(null);
        expect(result.current.isSearching).toBe(false);
      });
    });

    it('should not trigger search for whitespace-only terms', async () => {
      mockUseDebounceRef.mockReturnValue('   ');
      
      const { result } = renderHook(() => useQuickSearch(defaultOptions));

      act(() => {
        result.current.setSearchTerm('   ');
      });

      await waitFor(() => {
        expect(mockQuickSearch).not.toHaveBeenCalled();
        expect(mockOnSuccess).toHaveBeenCalledWith(null);
      });
    });
  });

  describe('Loading States', () => {
    it('should combine internal searching state with searchLoading', () => {
      const mockUseSearchApiImport = require('../useSearchApi').useSearchApi as jest.Mock;
      mockUseSearchApiImport.mockReturnValue({
        ...mockUseSearchApi,
        searchLoading: true,
      });

      const { result } = renderHook(() => useQuickSearch(defaultOptions));

      expect(result.current.isSearching).toBe(true);
    });

    it('should show searching state when internal search is active', async () => {
      mockUseDebounceRef.mockReturnValue('test');
      
      const { result } = renderHook(() => useQuickSearch(defaultOptions));

      act(() => {
        result.current.setSearchTerm('test');
      });

      // Should be searching after triggering search
      await waitFor(() => {
        expect(result.current.isSearching).toBe(true);
      });
    });
  });

  describe('Success Callback Handling', () => {
    it('should call onSuccess callback and stop searching on successful search', async () => {
      const mockResponse = { data: ['item1', 'item2'] };
      
      const { result } = renderHook(() => useQuickSearch(defaultOptions));
      
      // Simulate successful search response
      const mockUseSearchApiImport = require('../useSearchApi').useSearchApi as jest.Mock;
      const onSuccessCallback = mockUseSearchApiImport.mock.calls[0][0].onSuccess;
      
      act(() => {
        onSuccessCallback(mockResponse);
      });

      expect(mockOnSuccess).toHaveBeenCalledWith(mockResponse);
      expect(result.current.isSearching).toBe(false);
    });

    it('should work without onSuccess callback', () => {
      const { result } = renderHook(() => 
        useQuickSearch({ entity: 'test' })
      );

      expect(result.current).toBeDefined();
      expect(typeof result.current.setSearchTerm).toBe('function');
    });
  });

  describe('Error Callback Handling', () => {
    it('should call onError callback and stop searching on search error', async () => {
      const mockError = { message: 'Search failed' };
      
      const { result } = renderHook(() => useQuickSearch(defaultOptions));
      
      // Simulate error response
      const mockUseSearchApiImport = require('../useSearchApi').useSearchApi as jest.Mock;
      const onErrorCallback = mockUseSearchApiImport.mock.calls[0][0].onError;
      
      act(() => {
        onErrorCallback(mockError);
      });

      expect(mockOnError).toHaveBeenCalledWith(mockError);
      expect(result.current.isSearching).toBe(false);
    });

    it('should work without onError callback', () => {
      const { result } = renderHook(() => 
        useQuickSearch({ entity: 'test' })
      );

      expect(result.current).toBeDefined();
      expect(typeof result.current.setSearchTerm).toBe('function');
    });
  });

  describe('Effect Dependencies', () => {
    it('should trigger search when debounced term changes', async () => {
      let debouncedValue = 'initial';
      mockUseDebounceRef.mockImplementation(() => debouncedValue);
      
      const { rerender } = renderHook(() => useQuickSearch(defaultOptions));

      // Change debounced value
      debouncedValue = 'new search term';
      rerender();

      await waitFor(() => {
        expect(mockQuickSearch).toHaveBeenCalledWith('new search term');
      });
    });

    it('should handle multiple rapid changes', async () => {
      mockUseDebounceRef.mockReturnValueOnce('test1').mockReturnValueOnce('test2');
      
      const { rerender } = renderHook(() => useQuickSearch(defaultOptions));
      
      // First render should trigger with 'test1'
      await waitFor(() => {
        expect(mockQuickSearch).toHaveBeenCalledWith('test1');
      });

      // Rerender to trigger effect again with 'test2'
      rerender();
      await waitFor(() => {
        expect(mockQuickSearch).toHaveBeenCalledWith('test2');
      });

      expect(mockQuickSearch).toHaveBeenCalledTimes(2);
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined entity gracefully', () => {
      const { result } = renderHook(() => 
        useQuickSearch({ entity: undefined as any })
      );

      expect(result.current.searchTerm).toBe('');
      expect(result.current.isSearching).toBe(false);
    });

    it('should handle numeric search terms', async () => {
      mockUseDebounceRef.mockReturnValue('123');
      
      const { result } = renderHook(() => useQuickSearch(defaultOptions));

      act(() => {
        result.current.setSearchTerm('123');
      });

      await waitFor(() => {
        expect(mockQuickSearch).toHaveBeenCalledWith('123');
        expect(result.current.hasMinimumChars).toBe(true);
      });
    });

    it('should handle special characters in search terms', async () => {
      mockUseDebounceRef.mockReturnValue('test@123');
      
      const { result } = renderHook(() => useQuickSearch(defaultOptions));

      act(() => {
        result.current.setSearchTerm('test@123');
      });

      await waitFor(() => {
        expect(mockQuickSearch).toHaveBeenCalledWith('test@123');
      });
    });
  });
});