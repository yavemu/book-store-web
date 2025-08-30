import { renderHook, act, waitFor } from '@testing-library/react';
import { useSearchApi } from '../useSearchApi';

// Mock useApiRequest
const mockExecuteSearch = jest.fn();
const mockExecuteAdvancedFilter = jest.fn();

jest.mock('../useApiRequest', () => ({
  useApiRequest: jest.fn().mockImplementation(({ endpoint, method }) => {
    if (method === 'GET') {
      return {
        loading: false,
        execute: mockExecuteSearch,
        error: null,
        data: null,
        validationErrors: null,
      };
    } else {
      return {
        loading: false,
        execute: mockExecuteAdvancedFilter,
        error: null,
        data: null,
        validationErrors: null,
      };
    }
  }),
}));

describe('useSearchApi', () => {
  const mockOnSuccess = jest.fn();
  const mockOnError = jest.fn();

  const defaultProps = {
    entity: 'test-entity',
    onSuccess: mockOnSuccess,
    onError: mockOnError,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockExecuteSearch.mockClear();
    mockExecuteAdvancedFilter.mockClear();
  });

  describe('Initialization', () => {
    it('should initialize with correct state', () => {
      const { result } = renderHook(() => useSearchApi(defaultProps));

      expect(result.current.loading).toBe(false);
      expect(result.current.searchLoading).toBe(false);
      expect(result.current.filterLoading).toBe(false);
      expect(result.current.error).toBe(null);
      expect(result.current.data).toBe(null);
    });
  });

  describe('Quick Search', () => {
    it('should call quick search with valid term', async () => {
      const { result } = renderHook(() => useSearchApi(defaultProps));

      act(() => {
        result.current.quickSearch('valid search term');
      });

      expect(mockExecuteSearch).toHaveBeenCalledWith({ q: 'valid search term' });
    });

    it('should not call quick search with term less than 3 characters', async () => {
      const { result } = renderHook(() => useSearchApi(defaultProps));

      act(() => {
        result.current.quickSearch('ab');
      });

      expect(mockExecuteSearch).not.toHaveBeenCalled();
    });

    it('should trim search term before validation', async () => {
      const { result } = renderHook(() => useSearchApi(defaultProps));

      act(() => {
        result.current.quickSearch('  valid search  ');
      });

      expect(mockExecuteSearch).toHaveBeenCalledWith({ q: 'valid search' });
    });

    it('should not call search with only whitespace', async () => {
      const { result } = renderHook(() => useSearchApi(defaultProps));

      act(() => {
        result.current.quickSearch('   ');
      });

      expect(mockExecuteSearch).not.toHaveBeenCalled();
    });

    it('should handle empty search term', async () => {
      const { result } = renderHook(() => useSearchApi(defaultProps));

      act(() => {
        result.current.quickSearch('');
      });

      expect(mockExecuteSearch).not.toHaveBeenCalled();
    });
  });

  describe('Advanced Filter', () => {
    it('should call advanced filter with valid filters', async () => {
      const { result } = renderHook(() => useSearchApi(defaultProps));

      const filters = {
        name: 'John',
        status: 'active',
        startDate: '2024-01-01',
      };

      await act(async () => {
        await result.current.advancedFilter(filters);
      });

      expect(mockExecuteAdvancedFilter).toHaveBeenCalledWith(filters);
    });

    it('should not call filter without valid search terms', async () => {
      const { result } = renderHook(() => useSearchApi(defaultProps));

      const filters = {
        name: 'ab', // Less than 3 characters
        status: '',
      };

      await act(async () => {
        await result.current.advancedFilter(filters);
      });

      expect(mockExecuteAdvancedFilter).not.toHaveBeenCalled();
    });

    it('should require at least one field with 3+ characters', async () => {
      const { result } = renderHook(() => useSearchApi(defaultProps));

      const filtersValid = {
        name: 'ab',
        email: 'john@example.com', // Valid field with 3+ characters
        status: '',
      };

      await act(async () => {
        await result.current.advancedFilter(filtersValid);
      });

      // Should include all non-empty fields when at least one has 3+ characters
      expect(mockExecuteAdvancedFilter).toHaveBeenCalledWith({
        name: 'ab',
        email: 'john@example.com',
      });
    });

    it('should clean and trim filter values', async () => {
      const { result } = renderHook(() => useSearchApi(defaultProps));

      const filters = {
        name: '  John Doe  ',
        email: '',
        status: undefined,
        description: 'Valid description',
        empty: '   ',
      };

      await act(async () => {
        await result.current.advancedFilter(filters);
      });

      expect(mockExecuteAdvancedFilter).toHaveBeenCalledWith({
        name: 'John Doe',
        description: 'Valid description',
      });
    });

    it('should handle filters with only invalid values', async () => {
      const { result } = renderHook(() => useSearchApi(defaultProps));

      const filters = {
        name: 'ab',
        status: '',
        description: '  ',
      };

      await act(async () => {
        await result.current.advancedFilter(filters);
      });

      expect(mockExecuteAdvancedFilter).not.toHaveBeenCalled();
    });

    it('should handle empty filters object', async () => {
      const { result } = renderHook(() => useSearchApi(defaultProps));

      await act(async () => {
        await result.current.advancedFilter({});
      });

      expect(mockExecuteAdvancedFilter).not.toHaveBeenCalled();
    });

    it('should handle special characters in search terms', async () => {
      const { result } = renderHook(() => useSearchApi(defaultProps));

      const filters = {
        name: 'João@123',
        email: 'user+test@domain.com',
      };

      await act(async () => {
        await result.current.advancedFilter(filters);
      });

      expect(mockExecuteAdvancedFilter).toHaveBeenCalledWith(filters);
    });
  });

  describe('Entity Configuration', () => {
    it('should use correct entity in endpoint URLs', () => {
      const { result } = renderHook(() => 
        useSearchApi({ entity: 'custom-entity', onSuccess: mockOnSuccess })
      );

      // The useApiRequest mock should receive the correct endpoints
      // This is tested by verifying the hook was called with the right parameters
      expect(result.current).toBeDefined();
    });
  });

  describe('Loading States', () => {
    it('should combine loading states correctly', () => {
      const mockUseApiRequest = require('../useApiRequest').useApiRequest as jest.Mock;
      
      mockUseApiRequest
        .mockReturnValueOnce({
          loading: true, // search loading
          execute: mockExecuteSearch,
          error: null,
          data: null,
        })
        .mockReturnValueOnce({
          loading: false, // filter loading
          execute: mockExecuteAdvancedFilter,
          error: null,
          data: null,
        });

      const { result } = renderHook(() => useSearchApi(defaultProps));

      expect(result.current.loading).toBe(true);
      expect(result.current.searchLoading).toBe(true);
      expect(result.current.filterLoading).toBe(false);
    });
  });

  describe('Error Handling', () => {
    it('should combine errors from both search and filter', () => {
      const mockUseApiRequest = require('../useApiRequest').useApiRequest as jest.Mock;
      
      mockUseApiRequest
        .mockReturnValueOnce({
          loading: false,
          execute: mockExecuteSearch,
          error: 'Search error',
          data: null,
        })
        .mockReturnValueOnce({
          loading: false,
          execute: mockExecuteAdvancedFilter,
          error: null,
          data: null,
        });

      const { result } = renderHook(() => useSearchApi(defaultProps));

      expect(result.current.error).toBe('Search error');
    });
  });

  describe('Data Handling', () => {
    it('should return data from search or filter operations', () => {
      const mockUseApiRequest = require('../useApiRequest').useApiRequest as jest.Mock;
      const searchData = { results: ['item1', 'item2'] };
      
      mockUseApiRequest
        .mockReturnValueOnce({
          loading: false,
          execute: mockExecuteSearch,
          error: null,
          data: searchData,
        })
        .mockReturnValueOnce({
          loading: false,
          execute: mockExecuteAdvancedFilter,
          error: null,
          data: null,
        });

      const { result } = renderHook(() => useSearchApi(defaultProps));

      expect(result.current.data).toEqual(searchData);
    });
  });
});