import { renderHook, act, waitFor } from '@testing-library/react';
import { useInventoryMovements } from '../useInventoryMovements';

// Mock useApiRequest
const mockExecute = jest.fn();
const mockUseApiRequest = {
  loading: false,
  error: null,
  data: null,
  execute: mockExecute,
};

jest.mock('../useApiRequest', () => ({
  useApiRequest: jest.fn(() => mockUseApiRequest),
}));

// Mock Redux hooks to simulate user authentication
const mockUser = {
  id: 'user-123',
  role: 'USER',
  username: 'testuser',
  email: 'test@example.com'
};

jest.mock('@/store/hooks', () => ({
  useAppSelector: jest.fn(() => ({ user: mockUser })),
}));

const mockUseApiRequestImport = require('../useApiRequest').useApiRequest as jest.Mock;
const mockUseAppSelector = require('@/store/hooks').useAppSelector as jest.Mock;

describe('useInventoryMovements', () => {
  const mockOnSuccess = jest.fn();
  const mockOnError = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseApiRequestImport.mockReturnValue(mockUseApiRequest);
    mockUseAppSelector.mockReturnValue({ user: mockUser });
  });

  describe('Initialization', () => {
    it('should initialize with correct default state', () => {
      const { result } = renderHook(() => useInventoryMovements());

      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(null);
      expect(result.current.movements).toBe(null);
      expect(typeof result.current.fetchMovementsByBookId).toBe('function');
      expect(typeof result.current.fetchMovementsByUserId).toBe('function');
      expect(typeof result.current.searchMovements).toBe('function');
    });

    it('should initialize useApiRequest with correct parameters', () => {
      renderHook(() => useInventoryMovements());

      expect(mockUseApiRequestImport).toHaveBeenCalledWith({
        endpoint: '',
        method: 'GET',
        onSuccess: undefined,
        onError: undefined,
      });
    });
  });

  describe('Role-based Access Control', () => {
    it('should automatically add userId for non-admin users', async () => {
      // Set user role to USER
      mockUseAppSelector.mockReturnValue({
        user: { ...mockUser, role: 'USER' }
      });

      const { result } = renderHook(() => useInventoryMovements());
      const bookId = 'book-123';

      await act(async () => {
        await result.current.fetchMovementsByBookId(bookId);
      });

      expect(mockExecute).toHaveBeenCalledWith({
        endpoint: `/inventory/book/${bookId}?userId=${mockUser.id}`,
      });
    });

    it('should not add userId for admin users', async () => {
      // Set user role to ADMIN
      mockUseAppSelector.mockReturnValue({
        user: { ...mockUser, role: 'ADMIN' }
      });

      const { result } = renderHook(() => useInventoryMovements());
      const bookId = 'book-123';

      await act(async () => {
        await result.current.fetchMovementsByBookId(bookId);
      });

      expect(mockExecute).toHaveBeenCalledWith({
        endpoint: `/inventory/book/${bookId}`,
      });
    });

    it('should handle case-insensitive admin role check', async () => {
      // Test with lowercase admin
      mockUseAppSelector.mockReturnValue({
        user: { ...mockUser, role: 'admin' }
      });

      const { result } = renderHook(() => useInventoryMovements());
      const bookId = 'book-123';

      await act(async () => {
        await result.current.fetchMovementsByBookId(bookId);
      });

      expect(mockExecute).toHaveBeenCalledWith({
        endpoint: `/inventory/book/${bookId}`,
      });
    });

    it('should add userId when user is not authenticated', async () => {
      mockUseAppSelector.mockReturnValue({ user: null });

      const { result } = renderHook(() => useInventoryMovements());
      const bookId = 'book-123';

      await act(async () => {
        await result.current.fetchMovementsByBookId(bookId);
      });

      // Should not make the request if user is not authenticated
      expect(mockExecute).not.toHaveBeenCalled();
    });
  });

  describe('fetchMovementsByBookId', () => {
    it('should fetch movements by book ID for regular user', async () => {
      const { result } = renderHook(() => useInventoryMovements());
      const bookId = 'book-123';

      await act(async () => {
        await result.current.fetchMovementsByBookId(bookId);
      });

      expect(mockExecute).toHaveBeenCalledWith({
        endpoint: `/inventory/book/${bookId}?userId=${mockUser.id}`,
      });
    });

    it('should handle successful response', async () => {
      const mockResponse = {
        data: [
          { id: 'mov-1', type: 'IN', bookId: 'book-123' },
          { id: 'mov-2', type: 'OUT', bookId: 'book-123' },
        ]
      };

      mockUseApiRequestImport.mockReturnValue({
        ...mockUseApiRequest,
        data: mockResponse,
      });

      const { result } = renderHook(() => useInventoryMovements());

      expect(result.current.movements).toEqual(mockResponse);
    });

    it('should handle error response', async () => {
      const mockError = 'Failed to fetch movements';
      
      mockUseApiRequestImport.mockReturnValue({
        ...mockUseApiRequest,
        error: mockError,
      });

      const { result } = renderHook(() => useInventoryMovements());

      expect(result.current.error).toBe(mockError);
    });

    it('should validate book ID parameter', async () => {
      const { result } = renderHook(() => useInventoryMovements());

      await act(async () => {
        await result.current.fetchMovementsByBookId('');
      });

      expect(mockExecute).not.toHaveBeenCalled();
    });

    it('should handle null or undefined book ID', async () => {
      const { result } = renderHook(() => useInventoryMovements());

      await act(async () => {
        await result.current.fetchMovementsByBookId(null as any);
      });

      expect(mockExecute).not.toHaveBeenCalled();

      await act(async () => {
        await result.current.fetchMovementsByBookId(undefined as any);
      });

      expect(mockExecute).not.toHaveBeenCalled();
    });
  });

  describe('fetchMovementsByUserId', () => {
    it('should fetch movements by user ID for admin', async () => {
      // Set admin user
      mockUseAppSelector.mockReturnValue({
        user: { ...mockUser, role: 'ADMIN' }
      });

      const { result } = renderHook(() => useInventoryMovements());
      const userId = 'user-456';

      await act(async () => {
        await result.current.fetchMovementsByUserId(userId);
      });

      expect(mockExecute).toHaveBeenCalledWith({
        endpoint: `/inventory-movements/search?userId=${userId}`,
      });
    });

    it('should only allow regular users to fetch their own movements', async () => {
      // Set regular user
      mockUseAppSelector.mockReturnValue({
        user: { ...mockUser, role: 'USER' }
      });

      const { result } = renderHook(() => useInventoryMovements());
      const otherUserId = 'user-456'; // Different from logged user

      await act(async () => {
        await result.current.fetchMovementsByUserId(otherUserId);
      });

      // Should use the logged user's ID instead
      expect(mockExecute).toHaveBeenCalledWith({
        endpoint: `/inventory-movements/search?userId=${mockUser.id}`,
      });
    });

    it('should fetch movements by user ID with role filter for admin', async () => {
      // Set admin user
      mockUseAppSelector.mockReturnValue({
        user: { ...mockUser, role: 'ADMIN' }
      });

      const { result } = renderHook(() => useInventoryMovements());
      const userId = 'user-456';
      const userRole = 'admin';

      await act(async () => {
        await result.current.fetchMovementsByUserId(userId, userRole);
      });

      expect(mockExecute).toHaveBeenCalledWith({
        endpoint: `/inventory-movements/search?userId=${userId}&userRole=${userRole}`,
      });
    });

    it('should validate user ID parameter', async () => {
      const { result } = renderHook(() => useInventoryMovements());

      await act(async () => {
        await result.current.fetchMovementsByUserId('');
      });

      expect(mockExecute).not.toHaveBeenCalled();
    });

    it('should handle special characters in user ID for admin', async () => {
      // Set admin user
      mockUseAppSelector.mockReturnValue({
        user: { ...mockUser, role: 'ADMIN' }
      });

      const { result } = renderHook(() => useInventoryMovements());
      const userId = 'user@123';

      await act(async () => {
        await result.current.fetchMovementsByUserId(userId);
      });

      expect(mockExecute).toHaveBeenCalledWith({
        endpoint: `/inventory-movements/search?userId=${encodeURIComponent(userId)}`,
      });
    });
  });

  describe('searchMovements', () => {
    it('should search movements with filters for admin', async () => {
      // Set admin user
      mockUseAppSelector.mockReturnValue({
        user: { ...mockUser, role: 'ADMIN' }
      });

      const { result } = renderHook(() => useInventoryMovements());
      const filters = {
        type: 'IN',
        status: 'COMPLETED',
        startDate: '2024-01-01',
        endDate: '2024-01-31',
      };

      await act(async () => {
        await result.current.searchMovements(filters);
      });

      const expectedQuery = new URLSearchParams(filters).toString();
      expect(mockExecute).toHaveBeenCalledWith({
        endpoint: `/inventory-movements/search?${expectedQuery}`,
      });
    });

    it('should search movements with filters for regular user (auto-add userId)', async () => {
      const { result } = renderHook(() => useInventoryMovements());
      const filters = {
        type: 'IN',
        status: 'COMPLETED',
        startDate: '2024-01-01',
        endDate: '2024-01-31',
      };

      await act(async () => {
        await result.current.searchMovements(filters);
      });

      const expectedQuery = new URLSearchParams(filters).toString();
      expect(mockExecute).toHaveBeenCalledWith({
        endpoint: `/inventory-movements/search?${expectedQuery}&userId=${mockUser.id}`,
      });
    });

    it('should handle empty filters object for admin', async () => {
      // Set admin user
      mockUseAppSelector.mockReturnValue({
        user: { ...mockUser, role: 'ADMIN' }
      });

      const { result } = renderHook(() => useInventoryMovements());

      await act(async () => {
        await result.current.searchMovements({});
      });

      expect(mockExecute).toHaveBeenCalledWith({
        endpoint: '/inventory-movements/search?',
      });
    });

    it('should handle empty filters object for regular user', async () => {
      const { result } = renderHook(() => useInventoryMovements());

      await act(async () => {
        await result.current.searchMovements({});
      });

      expect(mockExecute).toHaveBeenCalledWith({
        endpoint: '/inventory-movements/search?&userId=user-123',
      });
    });

    it('should filter out empty values from filters', async () => {
      // Set admin user
      mockUseAppSelector.mockReturnValue({
        user: { ...mockUser, role: 'ADMIN' }
      });

      const { result } = renderHook(() => useInventoryMovements());
      const filters = {
        type: 'IN',
        status: '',
        startDate: '2024-01-01',
        endDate: null,
        userId: undefined,
      };

      await act(async () => {
        await result.current.searchMovements(filters);
      });

      const expectedQuery = new URLSearchParams({
        type: 'IN',
        startDate: '2024-01-01',
      }).toString();
      
      expect(mockExecute).toHaveBeenCalledWith({
        endpoint: `/inventory-movements/search?${expectedQuery}`,
      });
    });
  });

  describe('Loading States', () => {
    it('should reflect loading state from useApiRequest', () => {
      mockUseApiRequestImport.mockReturnValue({
        ...mockUseApiRequest,
        loading: true,
      });

      const { result } = renderHook(() => useInventoryMovements());

      expect(result.current.loading).toBe(true);
    });
  });

  describe('Callback Handling', () => {
    it('should handle onSuccess callback', async () => {
      const { result } = renderHook(() => 
        useInventoryMovements({ onSuccess: mockOnSuccess, onError: mockOnError })
      );

      expect(mockUseApiRequestImport).toHaveBeenCalledWith({
        endpoint: '',
        method: 'GET',
        onSuccess: mockOnSuccess,
        onError: mockOnError,
      });
    });

    it('should work without callbacks', () => {
      const { result } = renderHook(() => useInventoryMovements());

      expect(result.current).toBeDefined();
      expect(typeof result.current.fetchMovementsByBookId).toBe('function');
    });
  });

  describe('Edge Cases', () => {
    it('should handle concurrent requests', async () => {
      const { result } = renderHook(() => useInventoryMovements());

      await act(async () => {
        const promises = [
          result.current.fetchMovementsByBookId('book-1'),
          result.current.fetchMovementsByBookId('book-2'),
          result.current.fetchMovementsByUserId('user-1'),
        ];
        
        await Promise.all(promises);
      });

      expect(mockExecute).toHaveBeenCalledTimes(3);
    });

    it('should handle network errors gracefully', async () => {
      mockExecute.mockRejectedValueOnce(new Error('Network error'));
      
      const { result } = renderHook(() => useInventoryMovements());

      await act(async () => {
        try {
          await result.current.fetchMovementsByBookId('book-123');
        } catch (error) {
          // Expected to throw
        }
      });

      expect(mockExecute).toHaveBeenCalledWith({
        endpoint: '/inventory/book/book-123?userId=user-123',
      });
    });
  });
});