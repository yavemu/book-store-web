import { renderHook, act } from '@testing-library/react';
import { useEntityApi } from '../useEntityApi';

// Mock del hook useApiCall
jest.mock('../useApiCall', () => ({
  useApiCall: jest.fn(),
}));

import { useApiCall } from '../useApiCall';

const mockUseApiCall = useApiCall as jest.MockedFunction<typeof useApiCall>;

describe('useEntityApi', () => {
  // Mock API service
  const mockApiService = {
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  // Mock return values for useApiCall
  const createMockApiCallReturn = (overrides = {}) => ({
    state: {
      loading: false,
      error: '',
      success: false,
      ...overrides,
    },
    execute: jest.fn(),
    reset: jest.fn(),
  });

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Default mock implementation
    mockUseApiCall.mockImplementation(() => createMockApiCallReturn());
  });

  describe('Initialization', () => {
    it('should initialize with correct default options', () => {
      const { result } = renderHook(() => 
        useEntityApi(mockApiService, {})
      );

      expect(result.current).toHaveProperty('create');
      expect(result.current).toHaveProperty('update');
      expect(result.current).toHaveProperty('delete');
      expect(result.current).toHaveProperty('states');
      expect(result.current).toHaveProperty('reset');
    });

    it('should initialize with custom entity name', () => {
      const { result } = renderHook(() => 
        useEntityApi(mockApiService, { entityName: 'custom-entity' })
      );

      expect(mockUseApiCall).toHaveBeenCalledTimes(3); // create, update, delete
    });

    it('should setup callback options correctly', () => {
      const onCreateSuccess = jest.fn();
      const onUpdateSuccess = jest.fn();
      const onDeleteSuccess = jest.fn();

      renderHook(() => 
        useEntityApi(mockApiService, {
          onCreateSuccess,
          onUpdateSuccess, 
          onDeleteSuccess,
        })
      );

      // Verify useApiCall was called with correct callbacks
      expect(mockUseApiCall).toHaveBeenCalledWith({ onSuccess: onCreateSuccess });
      expect(mockUseApiCall).toHaveBeenCalledWith({ onSuccess: onUpdateSuccess });
      expect(mockUseApiCall).toHaveBeenCalledWith({ onSuccess: onDeleteSuccess });
    });
  });

  describe('Create operation', () => {
    it('should execute create API call', async () => {
      const mockExecute = jest.fn().mockResolvedValue({ id: 1, name: 'Test' });
      mockUseApiCall.mockImplementation(() => ({
        ...createMockApiCallReturn(),
        execute: mockExecute,
      }));

      const { result } = renderHook(() => 
        useEntityApi(mockApiService, { entityName: 'test-entity' })
      );

      const testData = { name: 'Test Entity' };
      let createResult: unknown;

      await act(async () => {
        createResult = await result.current.create(testData);
      });

      expect(mockExecute).toHaveBeenCalledTimes(1);
      expect(mockExecute).toHaveBeenCalledWith(expect.any(Function));
      expect(createResult).toEqual({ id: 1, name: 'Test' });
    });

    it('should handle create API call failure', async () => {
      const mockExecute = jest.fn().mockResolvedValue(undefined);
      mockUseApiCall.mockImplementation(() => ({
        ...createMockApiCallReturn(),
        execute: mockExecute,
      }));

      const { result } = renderHook(() => 
        useEntityApi(mockApiService)
      );

      const testData = { name: 'Test Entity' };
      let createResult: unknown;

      await act(async () => {
        createResult = await result.current.create(testData);
      });

      expect(createResult).toBeUndefined();
    });
  });

  describe('Update operation', () => {
    it('should execute update API call', async () => {
      const mockExecute = jest.fn().mockResolvedValue({ id: 1, name: 'Updated' });
      mockUseApiCall.mockImplementation(() => ({
        ...createMockApiCallReturn(),
        execute: mockExecute,
      }));

      const { result } = renderHook(() => 
        useEntityApi(mockApiService, { entityName: 'test-entity' })
      );

      const testData = { name: 'Updated Entity' };
      let updateResult: unknown;

      await act(async () => {
        updateResult = await result.current.update('123', testData);
      });

      expect(mockExecute).toHaveBeenCalledTimes(1);
      expect(mockExecute).toHaveBeenCalledWith(expect.any(Function));
      expect(updateResult).toEqual({ id: 1, name: 'Updated' });
    });

    it('should handle update with different data types', async () => {
      const mockExecute = jest.fn().mockResolvedValue({ success: true });
      mockUseApiCall.mockImplementation(() => ({
        ...createMockApiCallReturn(),
        execute: mockExecute,
      }));

      const { result } = renderHook(() => 
        useEntityApi(mockApiService)
      );

      const complexData = {
        name: 'Complex Entity',
        metadata: { tags: ['tag1', 'tag2'], priority: 1 },
        active: true,
      };

      await act(async () => {
        await result.current.update('456', complexData);
      });

      expect(mockExecute).toHaveBeenCalledWith(expect.any(Function));
    });
  });

  describe('Delete operation', () => {
    it('should execute delete API call when delete method exists', async () => {
      const mockExecute = jest.fn().mockResolvedValue({ message: 'Deleted' });
      mockUseApiCall.mockImplementation(() => ({
        ...createMockApiCallReturn(),
        execute: mockExecute,
      }));

      const { result } = renderHook(() => 
        useEntityApi(mockApiService, { entityName: 'test-entity' })
      );

      let deleteResult: unknown;

      await act(async () => {
        deleteResult = await result.current.delete('123');
      });

      expect(mockExecute).toHaveBeenCalledTimes(1);
      expect(mockExecute).toHaveBeenCalledWith(expect.any(Function));
      expect(deleteResult).toEqual({ message: 'Deleted' });
    });

    it('should throw error when delete method is not available', async () => {
      const apiServiceWithoutDelete = {
        create: jest.fn(),
        update: jest.fn(),
        // No delete method
      };

      const { result } = renderHook(() => 
        useEntityApi(apiServiceWithoutDelete, { entityName: 'test-entity' })
      );

      await act(async () => {
        try {
          await result.current.delete('123');
        } catch (error) {
          expect((error as Error).message).toBe('Delete operation not supported for test-entity');
        }
      });
    });

    it('should use default entity name in error message', async () => {
      const apiServiceWithoutDelete = {
        create: jest.fn(),
        update: jest.fn(),
      };

      const { result } = renderHook(() => 
        useEntityApi(apiServiceWithoutDelete) // No entityName provided
      );

      await act(async () => {
        try {
          await result.current.delete('123');
        } catch (error) {
          expect((error as Error).message).toBe('Delete operation not supported for elemento');
        }
      });
    });
  });

  describe('State management', () => {
    it('should provide access to all operation states', () => {
      const mockCreateCall = createMockApiCallReturn({ loading: true });
      const mockUpdateCall = createMockApiCallReturn({ error: 'Update failed' });
      const mockDeleteCall = createMockApiCallReturn({ success: true });

      let callIndex = 0;
      mockUseApiCall.mockImplementation(() => {
        const calls = [mockCreateCall, mockUpdateCall, mockDeleteCall];
        return calls[callIndex++] || createMockApiCallReturn();
      });

      const { result } = renderHook(() => 
        useEntityApi(mockApiService)
      );

      expect(result.current.states.create.loading).toBe(true);
      expect(result.current.states.update.error).toBe('Update failed');
      expect(result.current.states.delete.success).toBe(true);
    });

    it('should provide access to reset functions', () => {
      const mockResetCreate = jest.fn();
      const mockResetUpdate = jest.fn();
      const mockResetDelete = jest.fn();

      let callIndex = 0;
      mockUseApiCall.mockImplementation(() => {
        const resetFunctions = [mockResetCreate, mockResetUpdate, mockResetDelete];
        return {
          ...createMockApiCallReturn(),
          reset: resetFunctions[callIndex++] || jest.fn(),
        };
      });

      const { result } = renderHook(() => 
        useEntityApi(mockApiService)
      );

      act(() => {
        result.current.reset.create();
        result.current.reset.update();
        result.current.reset.delete();
      });

      expect(mockResetCreate).toHaveBeenCalledTimes(1);
      expect(mockResetUpdate).toHaveBeenCalledTimes(1);
      expect(mockResetDelete).toHaveBeenCalledTimes(1);
    });
  });

  describe('Callback execution', () => {
    it('should execute success callbacks', async () => {
      const onCreateSuccess = jest.fn();
      const onUpdateSuccess = jest.fn();
      const onDeleteSuccess = jest.fn();

      const mockExecute = jest.fn().mockResolvedValue({ success: true });
      mockUseApiCall.mockImplementation(({ onSuccess }) => ({
        ...createMockApiCallReturn(),
        execute: mockExecute,
      }));

      const { result } = renderHook(() => 
        useEntityApi(mockApiService, {
          onCreateSuccess,
          onUpdateSuccess,
          onDeleteSuccess,
        })
      );

      await act(async () => {
        await result.current.create({ name: 'test' });
      });

      // Verify callbacks were passed to useApiCall
      expect(mockUseApiCall).toHaveBeenCalledWith({ onSuccess: onCreateSuccess });
      expect(mockUseApiCall).toHaveBeenCalledWith({ onSuccess: onUpdateSuccess });
      expect(mockUseApiCall).toHaveBeenCalledWith({ onSuccess: onDeleteSuccess });
    });
  });

  describe('API service integration', () => {
    it('should call the correct API service methods', async () => {
      mockApiService.create.mockResolvedValue({ id: 1 });
      mockApiService.update.mockResolvedValue({ id: 1, updated: true });
      mockApiService.delete.mockResolvedValue({ message: 'deleted' });

      const mockExecute = jest.fn().mockImplementation((apiCall) => apiCall());
      mockUseApiCall.mockImplementation(() => ({
        ...createMockApiCallReturn(),
        execute: mockExecute,
      }));

      const { result } = renderHook(() => 
        useEntityApi(mockApiService)
      );

      await act(async () => {
        await result.current.create({ name: 'test' });
      });

      await act(async () => {
        await result.current.update('123', { name: 'updated' });
      });

      await act(async () => {
        await result.current.delete('123');
      });

      expect(mockApiService.create).toHaveBeenCalledWith({ name: 'test' });
      expect(mockApiService.update).toHaveBeenCalledWith('123', { name: 'updated' });
      expect(mockApiService.delete).toHaveBeenCalledWith('123');
    });
  });
});