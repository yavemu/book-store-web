import { renderHook, act } from '@testing-library/react';
import { useEntityApi } from '@/hooks/useEntityApi';
import { generateValidBookData, generateValidUserData } from '@/utils/testDataGenerator';

// Mock de las APIs
const mockBookApi = {
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  getById: jest.fn(),
};

const mockUserApi = {
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  getById: jest.fn(),
};

describe('useEntityApi Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Book Creation Flow', () => {
    it('should handle successful book creation', async () => {
      const mockBookResult = { id: '123', title: 'Test Book' };
      mockBookApi.create.mockResolvedValue(mockBookResult);

      const onCreateSuccess = jest.fn();
      const { result } = renderHook(() => 
        useEntityApi(mockBookApi, {
          onCreateSuccess,
          entityName: 'libro'
        })
      );

      const validBookData = generateValidBookData();

      await act(async () => {
        const response = await result.current.create(validBookData);
        expect(response).toEqual(mockBookResult);
      });

      expect(mockBookApi.create).toHaveBeenCalledWith(validBookData);
      expect(onCreateSuccess).toHaveBeenCalled();
      expect(result.current.states.create.loading).toBe(false);
      expect(result.current.states.create.error).toBe('');
    });

    it('should handle book creation error', async () => {
      const mockError = new Error('API Error');
      mockBookApi.create.mockRejectedValue(mockError);

      const { result } = renderHook(() => 
        useEntityApi(mockBookApi, {
          entityName: 'libro'
        })
      );

      const validBookData = generateValidBookData();

      await act(async () => {
        try {
          await result.current.create(validBookData);
        } catch (error) {
          expect(error).toBe(mockError);
        }
      });

      expect(result.current.states.create.loading).toBe(false);
      expect(result.current.states.create.error).toBe('API Error');
    });
  });

  describe('User Creation Flow', () => {
    it('should handle successful user creation', async () => {
      const mockUserResult = { id: '456', username: 'testuser' };
      mockUserApi.create.mockResolvedValue(mockUserResult);

      const onCreateSuccess = jest.fn();
      const { result } = renderHook(() => 
        useEntityApi(mockUserApi, {
          onCreateSuccess,
          entityName: 'usuario'
        })
      );

      const validUserData = generateValidUserData();

      await act(async () => {
        const response = await result.current.create(validUserData);
        expect(response).toEqual(mockUserResult);
      });

      expect(mockUserApi.create).toHaveBeenCalledWith(validUserData);
      expect(onCreateSuccess).toHaveBeenCalled();
    });

    it('should validate user data before API call', () => {
      const validUserData = generateValidUserData();
      
      // Verificar que los datos generados tienen el formato correcto
      expect(validUserData.username).toMatch(/^usuario_test_\d+$/);
      expect(validUserData.email).toMatch(/^test_\d+@ejemplo\.com$/);
      expect(validUserData.password).toBe('Password123');
      expect(validUserData.roleId).toMatch(/^[a-f0-9-]{36}$/); // UUID format
    });
  });

  describe('Data Type Conversion', () => {
    it('should handle numeric fields correctly', () => {
      const bookData = generateValidBookData();
      
      expect(typeof bookData.price).toBe('number');
      expect(typeof bookData.stockQuantity).toBe('number');
      expect(typeof bookData.pageCount).toBe('number');
      expect(bookData.price).toBeGreaterThan(0);
      expect(bookData.stockQuantity).toBeGreaterThanOrEqual(0);
      expect(bookData.pageCount).toBeGreaterThan(0);
    });

    it('should handle date fields correctly', () => {
      const bookData = generateValidBookData();
      
      expect(typeof bookData.publicationDate).toBe('string');
      expect(bookData.publicationDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      
      // Verificar que es una fecha válida
      const date = new Date(bookData.publicationDate);
      expect(date).toBeInstanceOf(Date);
      expect(isNaN(date.getTime())).toBe(false);
    });

    it('should handle UUID fields correctly', () => {
      const bookData = generateValidBookData();
      const userData = generateValidUserData();
      
      // UUIDs deben ser strings de 36 caracteres con formato específico
      expect(bookData.genreId).toMatch(/^[a-f0-9-]{36}$/);
      expect(bookData.publisherId).toMatch(/^[a-f0-9-]{36}$/);
      expect(userData.roleId).toMatch(/^[a-f0-9-]{36}$/);
    });
  });
});