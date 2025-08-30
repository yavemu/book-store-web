import { apiClient } from '../client';
import {
  CreateBookAuthorDto,
  UpdateBookAuthorDto,
  BookAuthorResponseDto,
  BookAuthorListResponseDto,
  CreateBookAuthorResponseDto,
  UpdateBookAuthorResponseDto,
  DeleteBookAuthorResponseDto,
  CreateBookAuthorAssignmentDto,
  UpdateBookAuthorAssignmentDto,
} from "@/types/api/entities";

const buildQueryString = (params: Record<string, unknown>): string => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, String(value));
    }
  });

  return searchParams.toString();
};

const buildUrl = (basePath: string, queryParams?: Record<string, unknown>): string => {
  if (!queryParams) return basePath;

  const queryString = buildQueryString(queryParams);
  return queryString ? `${basePath}?${queryString}` : basePath;
};

export interface AuthorListParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface AuthorSearchParams {
  term: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface AuthorAdvancedSearchParams extends AuthorListParams {
  firstName?: string;
  lastName?: string;
  nationality?: string;
  birthDate?: string;
  startDate?: string;
  endDate?: string;
}

export const authorsApi = {
  // Crear nuevo autor (solo admin)
  create: (data: CreateBookAuthorDto): Promise<CreateBookAuthorResponseDto> => {
    // Transformar fecha al formato ISO requerido por la API
    const transformedData = { ...data };
    
    if (transformedData.birthDate && transformedData.birthDate.trim() !== '') {
      // Si la fecha no está ya en formato YYYY-MM-DD, convertirla
      const dateValue = transformedData.birthDate;
      
      // Verificar si ya está en formato ISO (YYYY-MM-DD)
      if (!/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
        // Intentar parsear y convertir a formato ISO
        try {
          const parsedDate = new Date(dateValue);
          if (!isNaN(parsedDate.getTime())) {
            // Convertir a formato YYYY-MM-DD
            transformedData.birthDate = parsedDate.toISOString().split('T')[0];
          }
        } catch (error) {
          // Error silencioso al transformar fecha
        }
      }
    }
    return apiClient.post('/book-authors', transformedData);
  },

  // Obtener lista paginada de autores
  list: (params?: AuthorListParams): Promise<BookAuthorListResponseDto> => {
    const defaultParams = {
      page: 1,
      limit: 10,
      sortBy: 'lastName',
      sortOrder: 'ASC' as const,
      ...params,
    };

    const url = buildUrl('/book-authors', defaultParams);
    return apiClient.get(url);
  },

  // Obtener autor por ID
  getById: (id: string): Promise<BookAuthorResponseDto> => {
    return apiClient.get(`/book-authors/${id}`);
  },

  // Actualizar autor (solo admin)
  update: (id: string, data: UpdateBookAuthorDto): Promise<UpdateBookAuthorResponseDto> => {
    return apiClient.put(`/book-authors/${id}`, data);
  },

  // Eliminar autor (solo admin)
  delete: (id: string): Promise<DeleteBookAuthorResponseDto> => {
    return apiClient.delete(`/book-authors/${id}`);
  },

  // Buscar autores por término
  search: (params: AuthorSearchParams): Promise<BookAuthorListResponseDto> => {
    const url = buildUrl('/book-authors/search', params);
    return apiClient.get(url);
  },

  // Obtener autor por nombre completo
  getByName: (firstName: string, lastName: string): Promise<BookAuthorResponseDto> => {
    const encodedFirstName = encodeURIComponent(firstName);
    const encodedLastName = encodeURIComponent(lastName);
    return apiClient.get(`/book-authors/by-name/${encodedFirstName}/${encodedLastName}`);
  },

  // Obtener autores por nacionalidad
  byNationality: (nationality: string, params?: Pick<AuthorListParams, 'page' | 'limit'>): Promise<BookAuthorListResponseDto> => {
    const defaultParams = {
      page: 1,
      limit: 10,
      ...params,
    };

    const url = buildUrl(`/book-authors/by-nationality/${encodeURIComponent(nationality)}`, defaultParams);
    return apiClient.get(url);
  },

  // Obtener libros de un autor específico
  getBooks: (authorId: string, params?: Pick<AuthorListParams, 'page' | 'limit'>): Promise<{ data: unknown[]; meta: unknown }> => {
    const defaultParams = {
      page: 1,
      limit: 10,
      ...params,
    };

    const url = buildUrl(`/book-authors/${authorId}/books`, defaultParams);
    return apiClient.get(url);
  },
};

export interface BookAuthorAssignmentListParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

// API para gestión de asignaciones autor-libro
export const bookAuthorAssignmentsApi = {
  // Crear asignación autor-libro
  create: (data: CreateBookAuthorAssignmentDto): Promise<unknown> => {
    return apiClient.post('/book-author-assignments', data);
  },

  // Listar todas las asignaciones
  list: (params?: BookAuthorAssignmentListParams): Promise<{ data: unknown[]; meta: unknown }> => {
    const defaultParams = {
      page: 1,
      limit: 10,
      sortBy: 'createdAt',
      sortOrder: 'DESC' as const,
      ...params,
    };

    const url = buildUrl('/book-author-assignments', defaultParams);
    return apiClient.get(url);
  },

  // Obtener asignaciones por libro
  getByBook: (bookId: string, params?: Pick<BookAuthorAssignmentListParams, 'page' | 'limit'>): Promise<{ data: unknown[]; meta: unknown }> => {
    const defaultParams = {
      page: 1,
      limit: 10,
      ...params,
    };

    const url = buildUrl(`/book-author-assignments/by-book/${bookId}`, defaultParams);
    return apiClient.get(url);
  },

  // Obtener asignaciones por autor
  getByAuthor: (authorId: string, params?: Pick<BookAuthorAssignmentListParams, 'page' | 'limit'>): Promise<{ data: unknown[]; meta: unknown }> => {
    const defaultParams = {
      page: 1,
      limit: 10,
      ...params,
    };

    const url = buildUrl(`/book-author-assignments/by-author/${authorId}`, defaultParams);
    return apiClient.get(url);
  },

  // Verificar si existe asignación específica
  checkAssignment: (bookId: string, authorId: string): Promise<{ exists: boolean }> => {
    return apiClient.get(`/book-author-assignments/check/${bookId}/${authorId}`);
  },

  // Obtener asignación por ID
  getById: (assignmentId: string): Promise<unknown> => {
    return apiClient.get(`/book-author-assignments/${assignmentId}`);
  },

  // Actualizar asignación autor-libro
  update: (assignmentId: string, data: UpdateBookAuthorAssignmentDto): Promise<unknown> => {
    return apiClient.patch(`/book-author-assignments/${assignmentId}`, data);
  },

  // Eliminar asignación autor-libro
  delete: (assignmentId: string): Promise<{ message: string }> => {
    return apiClient.delete(`/book-author-assignments/${assignmentId}`);
  },

  // Alias para compatibilidad
  assign: (data: CreateBookAuthorAssignmentDto): Promise<unknown> => {
    return apiClient.post('/book-author-assignments', data);
  },

  remove: (assignmentId: string): Promise<{ message: string }> => {
    return apiClient.delete(`/book-author-assignments/${assignmentId}`);
  },
};