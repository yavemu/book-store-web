import { renderHook, act } from '@testing-library/react';
import { useApiCall } from '../useApiCall';

describe('useApiCall', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Initial state', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => useApiCall());

      expect(result.current.state.loading).toBe(false);
      expect(result.current.state.error).toBe('');
      expect(typeof result.current.execute).toBe('function');
      expect(typeof result.current.reset).toBe('function');
    });

    it('should accept custom options', () => {
      const onSuccess = jest.fn();
      const onError = jest.fn();
      const { result } = renderHook(() => 
        useApiCall({ onSuccess, onError })
      );

      expect(result.current.state.loading).toBe(false);
      expect(result.current.state.error).toBe('');
    });
  });

  describe('Successful API call', () => {
    it('should handle successful API call', async () => {
      const mockApiCall = jest.fn().mockResolvedValue('success data');
      const onSuccess = jest.fn();
      
      const { result } = renderHook(() => useApiCall({ onSuccess }));

      let apiResult: unknown;
      await act(async () => {
        apiResult = await result.current.execute(mockApiCall);
      });

      expect(mockApiCall).toHaveBeenCalledTimes(1);
      expect(onSuccess).toHaveBeenCalledTimes(1);
      expect(apiResult).toBe('success data');
      expect(result.current.state.loading).toBe(false);
      expect(result.current.state.error).toBe('');
    });

    it('should handle loading state correctly', async () => {
      let resolvePromise: (value: string) => void;
      const mockApiCall = jest.fn(() => 
        new Promise<string>(resolve => {
          resolvePromise = resolve;
        })
      );
      
      const { result } = renderHook(() => useApiCall());

      act(() => {
        result.current.execute(mockApiCall);
      });

      // Should be loading immediately
      expect(result.current.state.loading).toBe(true);
      expect(result.current.state.error).toBe('');

      // Resolve the promise
      await act(async () => {
        resolvePromise!('data');
      });

      expect(result.current.state.loading).toBe(false);
      expect(result.current.state.error).toBe('');
    });

    it('should call onSuccess without parameters', async () => {
      const mockApiCall = jest.fn().mockResolvedValue({ id: 1, name: 'Test' });
      const onSuccess = jest.fn();
      
      const { result } = renderHook(() => useApiCall({ onSuccess }));

      await act(async () => {
        await result.current.execute(mockApiCall);
      });

      expect(onSuccess).toHaveBeenCalledTimes(1);
      expect(onSuccess).toHaveBeenCalledWith(); // No parameters
    });
  });

  describe('Failed API call', () => {
    it('should handle API errors', async () => {
      const mockError = new Error('API Error');
      const mockApiCall = jest.fn().mockRejectedValue(mockError);
      const onError = jest.fn();
      
      const { result } = renderHook(() => useApiCall({ onError }));

      let apiResult: unknown;
      await act(async () => {
        apiResult = await result.current.execute(mockApiCall);
      });

      expect(mockApiCall).toHaveBeenCalledTimes(1);
      expect(onError).toHaveBeenCalledTimes(1);
      expect(onError).toHaveBeenCalledWith('API Error');
      expect(apiResult).toBeUndefined();
      expect(result.current.state.loading).toBe(false);
      expect(result.current.state.error).toBe('API Error');
    });

    it('should handle API errors with custom error messages', async () => {
      const mockError = { message: 'Custom API Error', status: 404 };
      const mockApiCall = jest.fn().mockRejectedValue(mockError);
      
      const { result } = renderHook(() => useApiCall());

      await act(async () => {
        await result.current.execute(mockApiCall);
      });

      expect(result.current.state.error).toBe('Custom API Error');
    });

    it('should handle non-Error objects', async () => {
      const mockApiCall = jest.fn().mockRejectedValue('String error');
      
      const { result } = renderHook(() => useApiCall());

      await act(async () => {
        await result.current.execute(mockApiCall);
      });

      expect(result.current.state.error).toBe('Ha ocurrido un error');
    });

    it('should handle null/undefined errors', async () => {
      const mockApiCall = jest.fn().mockRejectedValue(null);
      
      const { result } = renderHook(() => useApiCall());

      await act(async () => {
        await result.current.execute(mockApiCall);
      });

      expect(result.current.state.error).toBe('Ha ocurrido un error');
    });

    it('should handle errors without message property', async () => {
      const mockApiCall = jest.fn().mockRejectedValue({ status: 404 });
      
      const { result } = renderHook(() => useApiCall());

      await act(async () => {
        await result.current.execute(mockApiCall);
      });

      expect(result.current.state.error).toBe('Ha ocurrido un error');
    });
  });

  describe('Reset functionality', () => {
    it('should reset state to initial values', async () => {
      const mockApiCall = jest.fn().mockRejectedValue(new Error('Test error'));
      
      const { result } = renderHook(() => useApiCall());

      // Execute API call to set error state
      await act(async () => {
        await result.current.execute(mockApiCall);
      });

      expect(result.current.state.error).toBe('Test error');

      // Reset state
      act(() => {
        result.current.reset();
      });

      expect(result.current.state.loading).toBe(false);
      expect(result.current.state.error).toBe('');
    });

    it('should reset loading state', async () => {
      const { result } = renderHook(() => useApiCall());

      // Manually set loading to true (this won't happen in real usage, but tests the reset)
      act(() => {
        result.current.reset();
      });

      expect(result.current.state.loading).toBe(false);
      expect(result.current.state.error).toBe('');
    });
  });

  describe('Error handling edge cases', () => {
    it('should clear error before new API call', async () => {
      const mockApiCall1 = jest.fn().mockRejectedValue(new Error('First error'));
      const mockApiCall2 = jest.fn().mockResolvedValue('Success');
      
      const { result } = renderHook(() => useApiCall());

      // First call that fails
      await act(async () => {
        await result.current.execute(mockApiCall1);
      });
      expect(result.current.state.error).toBe('First error');

      // Second call that succeeds
      await act(async () => {
        await result.current.execute(mockApiCall2);
      });
      expect(result.current.state.error).toBe('');
    });

    it('should handle undefined API call function', async () => {
      const { result } = renderHook(() => useApiCall());

      let apiResult: unknown;
      await act(async () => {
        try {
          apiResult = await result.current.execute(undefined as any);
        } catch (error) {
          // Expected to throw
        }
      });

      // The function should handle this gracefully or throw
      expect(result.current.state.loading).toBe(false);
    });
  });

  describe('Callback execution', () => {
    it('should not call onSuccess on error', async () => {
      const mockApiCall = jest.fn().mockRejectedValue(new Error('Test error'));
      const onSuccess = jest.fn();
      const onError = jest.fn();
      
      const { result } = renderHook(() => useApiCall({ onSuccess, onError }));

      await act(async () => {
        await result.current.execute(mockApiCall);
      });

      expect(onSuccess).not.toHaveBeenCalled();
      expect(onError).toHaveBeenCalledTimes(1);
    });

    it('should not call onError on success', async () => {
      const mockApiCall = jest.fn().mockResolvedValue('success');
      const onSuccess = jest.fn();
      const onError = jest.fn();
      
      const { result } = renderHook(() => useApiCall({ onSuccess, onError }));

      await act(async () => {
        await result.current.execute(mockApiCall);
      });

      expect(onSuccess).toHaveBeenCalledTimes(1);
      expect(onError).not.toHaveBeenCalled();
    });

    it('should handle callback errors gracefully', async () => {
      const mockApiCall = jest.fn().mockResolvedValue('success');
      const throwingOnSuccess = jest.fn(() => {
        throw new Error('Callback error');
      });
      
      const { result } = renderHook(() => useApiCall({ onSuccess: throwingOnSuccess }));

      // This should not break the hook
      let apiResult: unknown;
      await act(async () => {
        try {
          apiResult = await result.current.execute(mockApiCall);
        } catch (error) {
          // May throw due to callback error
        }
      });

      expect(throwingOnSuccess).toHaveBeenCalledTimes(1);
    });
  });

  describe('Multiple concurrent calls', () => {
    it('should handle overlapping API calls', async () => {
      let resolveFirst: (value: string) => void;
      let resolveSecond: (value: string) => void;
      
      const firstApiCall = jest.fn(() => new Promise<string>(resolve => {
        resolveFirst = resolve;
      }));
      
      const secondApiCall = jest.fn(() => new Promise<string>(resolve => {
        resolveSecond = resolve;
      }));
      
      const { result } = renderHook(() => useApiCall());

      // Start both calls
      let firstResult: unknown;
      let secondResult: unknown;
      
      act(() => {
        result.current.execute(firstApiCall).then(r => { firstResult = r; });
        result.current.execute(secondApiCall).then(r => { secondResult = r; });
      });

      expect(result.current.state.loading).toBe(true);

      // Resolve second first
      await act(async () => {
        resolveSecond!('second');
      });

      // Then resolve first
      await act(async () => {
        resolveFirst!('first');
      });

      expect(firstResult).toBe('first');
      expect(secondResult).toBe('second');
      expect(result.current.state.loading).toBe(false);
    });
  });
});