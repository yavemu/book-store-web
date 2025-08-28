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
  UpdateBookAuthorAssignmentDto
} from '@/types/authors';

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

export const authorsApi = {
  // Crear nuevo autor (solo admin)
  create: (data: CreateBookAuthorDto): Promise<CreateBookAuthorResponseDto> => {
    return apiClient.post('/book-authors', data);
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
  getBooks: (authorId: string, params?: Pick<AuthorListParams, 'page' | 'limit'>): Promise<any> => {
    const defaultParams = {
      page: 1,
      limit: 10,
      ...params,
    };

    const url = buildUrl(`/book-authors/${authorId}/books`, defaultParams);
    return apiClient.get(url);
  },
};

// API para gestión de asignaciones autor-libro
export const bookAuthorAssignmentsApi = {
  // Asignar autor a un libro
  assign: (data: CreateBookAuthorAssignmentDto): Promise<any> => {
    return apiClient.post('/book-author-assignments', data);
  },

  // Actualizar asignación autor-libro
  update: (assignmentId: string, data: UpdateBookAuthorAssignmentDto): Promise<any> => {
    return apiClient.put(`/book-author-assignments/${assignmentId}`, data);
  },

  // Remover asignación autor-libro
  remove: (assignmentId: string): Promise<{ message: string }> => {
    return apiClient.delete(`/book-author-assignments/${assignmentId}`);
  },
};