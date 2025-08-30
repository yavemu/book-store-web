import { renderHook, act, waitFor } from '@testing-library/react';
import { z } from 'zod';
import { useApiRequest } from '../useApiRequest';
import { mockFetchResponse } from '../../__mocks__/apiClient';

// Mock the Redux hooks
jest.mock('@/store/hooks', () => ({
  useAppDispatch: jest.fn(() => jest.fn()),
}));

// Mock the API client
jest.mock('@/services/api', () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

import { apiClient } from '@/services/api';

const mockApiClient = apiClient as jest.Mocked<typeof apiClient>;

describe('useApiRequest', () => {
  const mockOnSuccess = jest.fn();
  const mockOnError = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockApiClient.get.mockClear();
    mockApiClient.post.mockClear();
    mockApiClient.put.mockClear();
    mockApiClient.delete.mockClear();
  });

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => 
        useApiRequest({
          endpoint: '/test',
          method: 'GET',
        })
      );

      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(null);
      expect(result.current.data).toBe(null);
      expect(result.current.validationErrors).toBe(null);
      expect(result.current.isSuccess).toBe(false);
    });
  });

  describe('GET Requests', () => {
    it('should handle successful GET request', async () => {
      const mockData = { id: 1, name: 'Test' };
      mockApiClient.get.mockResolvedValueOnce(mockData);

      const { result } = renderHook(() => 
        useApiRequest({
          endpoint: '/test',
          method: 'GET',
          onSuccess: mockOnSuccess,
        })
      );

      act(() => {
        result.current.execute();
      });

      // Should be loading
      expect(result.current.loading).toBe(true);
      expect(result.current.error).toBe(null);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toEqual(mockData);
      expect(result.current.error).toBe(null);
      expect(result.current.isSuccess).toBe(true);
      expect(mockOnSuccess).toHaveBeenCalledWith(mockData);
      expect(mockApiClient.get).toHaveBeenCalledWith('/test');
    });

    it('should handle GET request errors', async () => {
      const mockError = { message: 'Not found', statusCode: 404 };
      mockApiClient.get.mockRejectedValueOnce(mockError);

      const { result } = renderHook(() => 
        useApiRequest({
          endpoint: '/test',
          method: 'GET',
          onError: mockOnError,
        })
      );

      act(() => {
        result.current.execute();
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBe('Not found');
      expect(result.current.data).toBe(null);
      expect(result.current.isSuccess).toBe(false);
      expect(mockOnError).toHaveBeenCalledWith(mockError);
    });
  });

  describe('POST Requests', () => {
    it('should handle successful POST request with data', async () => {
      const requestData = { name: 'New Item' };
      const responseData = { id: 1, ...requestData };
      mockApiClient.post.mockResolvedValueOnce(responseData);

      const { result } = renderHook(() => 
        useApiRequest({
          endpoint: '/test',
          method: 'POST',
          onSuccess: mockOnSuccess,
        })
      );

      act(() => {
        result.current.execute(requestData);
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toEqual(responseData);
      expect(mockOnSuccess).toHaveBeenCalledWith(responseData);
      expect(mockApiClient.post).toHaveBeenCalledWith('/test', requestData);
    });
  });

  describe('PUT and DELETE Requests', () => {
    it('should handle PUT requests', async () => {
      const requestData = { id: 1, name: 'Updated Item' };
      const responseData = { success: true };
      mockApiClient.put.mockResolvedValueOnce(responseData);

      const { result } = renderHook(() => 
        useApiRequest({
          endpoint: '/test',
          method: 'PUT',
        })
      );

      act(() => {
        result.current.execute(requestData);
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(mockApiClient.put).toHaveBeenCalledWith('/test', requestData);
      expect(result.current.data).toEqual(responseData);
    });

    it('should handle DELETE requests', async () => {
      const responseData = { success: true };
      mockApiClient.delete.mockResolvedValueOnce(responseData);

      const { result } = renderHook(() => 
        useApiRequest({
          endpoint: '/test',
          method: 'DELETE',
        })
      );

      act(() => {
        result.current.execute();
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(mockApiClient.delete).toHaveBeenCalledWith('/test');
      expect(result.current.data).toEqual(responseData);
    });
  });

  describe('Zod Validation', () => {
    const testSchema = z.object({
      name: z.string().min(1, 'Name is required'),
      email: z.string().email('Invalid email'),
    });

    it('should validate data with schema before making request', async () => {
      const validData = { name: 'John', email: 'john@example.com' };
      const responseData = { success: true };
      mockApiClient.post.mockResolvedValueOnce(responseData);

      const { result } = renderHook(() => 
        useApiRequest({
          endpoint: '/test',
          method: 'POST',
          schema: testSchema,
        })
      );

      act(() => {
        result.current.execute(validData);
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(mockApiClient.post).toHaveBeenCalledWith('/test', validData);
      expect(result.current.data).toEqual(responseData);
    });

    it('should return validation errors for invalid data', async () => {
      const invalidData = { name: '', email: 'invalid-email' };

      const { result } = renderHook(() => 
        useApiRequest({
          endpoint: '/test',
          method: 'POST',
          schema: testSchema,
        })
      );

      let executeResult;
      act(() => {
        executeResult = result.current.execute(invalidData);
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.validationErrors).toEqual({
        'name': ['Name is required'],
        'email': ['Invalid email'],
      });
      expect(mockApiClient.post).not.toHaveBeenCalled();
    });
  });

  describe('Reset Function', () => {
    it('should reset state when reset is called', async () => {
      const mockData = { id: 1, name: 'Test' };
      mockApiClient.get.mockResolvedValueOnce(mockData);

      const { result } = renderHook(() => 
        useApiRequest({
          endpoint: '/test',
          method: 'GET',
        })
      );

      // Make request
      act(() => {
        result.current.execute();
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toEqual(mockData);

      // Reset
      act(() => {
        result.current.reset();
      });

      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(null);
      expect(result.current.data).toBe(null);
      expect(result.current.validationErrors).toBe(null);
    });
  });

  describe('Loading States', () => {
    it('should handle loading state correctly', async () => {
      let resolvePromise: (value: any) => void;
      const promise = new Promise((resolve) => {
        resolvePromise = resolve;
      });
      mockApiClient.get.mockReturnValueOnce(promise);

      const { result } = renderHook(() => 
        useApiRequest({
          endpoint: '/test',
          method: 'GET',
        })
      );

      // Start request
      act(() => {
        result.current.execute();
      });

      expect(result.current.loading).toBe(true);

      // Resolve request
      act(() => {
        resolvePromise({ success: true });
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });
  });

  describe('Error Handling Edge Cases', () => {
    it('should handle string errors', async () => {
      mockApiClient.get.mockRejectedValueOnce('String error');

      const { result } = renderHook(() => 
        useApiRequest({
          endpoint: '/test',
          method: 'GET',
        })
      );

      act(() => {
        result.current.execute();
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBe('String error');
    });

    it('should handle undefined errors', async () => {
      mockApiClient.get.mockRejectedValueOnce(undefined);

      const { result } = renderHook(() => 
        useApiRequest({
          endpoint: '/test',
          method: 'GET',
        })
      );

      act(() => {
        result.current.execute();
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBe('Error de conexión en /test');
    });
  });
});