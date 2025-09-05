import { apiClient } from '../client';
import {
  CreateBookAuthorAssignmentDto,
  UpdateBookAuthorAssignmentDto,
  BookAuthorAssignmentResponseDto,
  BookAuthorAssignmentListResponseDto,
  CommonListParams,
  CommonSearchParams,
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

export interface BookAuthorAssignmentListParams extends CommonListParams {}

export interface BookAuthorAssignmentSearchParams extends CommonSearchParams {
  term: string;
}

export interface AssignmentFiltersDto {
  bookId?: string;
  authorId?: string;
  assignmentDate?: string;
  pagination?: {
    page: number;
    limit: number;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
  };
}

export interface AssignmentAdvancedFiltersDto {
  bookId?: string;
  authorId?: string;
  bookTitle?: string;
  authorName?: string;
  createdAfter?: string;
  createdBefore?: string;
  pagination?: {
    page: number;
    limit: number;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
  };
}

export interface AssignmentExportParams {
  bookId?: string;
  authorId?: string;
  bookTitle?: string;
  authorName?: string;
  startDate?: string;
  endDate?: string;
}

export const bookAuthorAssignmentsApi = {
  // Crear nueva asignación autor-libro (solo admin)
  create: (data: CreateBookAuthorAssignmentDto): Promise<BookAuthorAssignmentResponseDto> => {
    return apiClient.post('/book-author-assignments', data);
  },

  // Obtener lista paginada de asignaciones
  list: (params?: BookAuthorAssignmentListParams): Promise<BookAuthorAssignmentListResponseDto> => {
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

  // Obtener asignación por ID
  getById: (id: string): Promise<BookAuthorAssignmentResponseDto> => {
    return apiClient.get(`/book-author-assignments/${id}`);
  },

  // Actualizar asignación (solo admin)
  update: (id: string, data: UpdateBookAuthorAssignmentDto): Promise<BookAuthorAssignmentResponseDto> => {
    return apiClient.put(`/book-author-assignments/${id}`, data);
  },

  // Eliminar asignación (solo admin)
  delete: (id: string): Promise<{ message: string }> => {
    return apiClient.delete(`/book-author-assignments/${id}`);
  },

  // Buscar asignaciones por término - POST /search
  search: (params: BookAuthorAssignmentSearchParams): Promise<BookAuthorAssignmentListResponseDto> => {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'DESC', ...searchData } = params;
    
    const queryParams = {
      page,
      limit,
      sortBy,
      sortOrder
    };

    const url = buildUrl('/book-author-assignments/search', queryParams);
    return apiClient.post(url, searchData);
  },

  // Filtro rápido para búsqueda en tiempo real - GET /filter
  quickFilter: (term: string, params?: { page?: number; limit?: number }): Promise<BookAuthorAssignmentListResponseDto> => {
    if (term.length < 3) {
      throw new Error('Filter term must be at least 3 characters long');
    }

    const queryParams = {
      term,
      page: params?.page || 1,
      limit: Math.min(params?.limit || 10, 50),
      sortBy: 'createdAt',
      sortOrder: 'DESC' as const,
    };

    const url = buildUrl('/book-author-assignments/filter', queryParams);
    return apiClient.get(url);
  },

  // Filtro avanzado con múltiples criterios - POST /advanced-filter
  advancedFilter: (params: AssignmentAdvancedFiltersDto): Promise<BookAuthorAssignmentListResponseDto> => {
    const { pagination, ...filterData } = params;
    
    const queryParams = {
      page: pagination?.page || 1,
      limit: pagination?.limit || 10,
      sortBy: pagination?.sortBy || 'createdAt',
      sortOrder: pagination?.sortOrder || 'DESC',
    };

    const url = buildUrl('/book-author-assignments/advanced-filter', queryParams);
    return apiClient.post(url, filterData);
  },

  // Exportar asignaciones a CSV (solo admin)
  exportToCsv: (params?: AssignmentExportParams): Promise<string> => {
    const url = buildUrl('/book-author-assignments/export/csv', params);
    return apiClient.get(url);
  },
};