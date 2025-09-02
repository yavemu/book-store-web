import { apiClient } from '../client';
import {
  CreateBookAuthorDto,
  UpdateBookAuthorDto,
  BookAuthorResponseDto,
  BookAuthorListResponseDto,
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

export interface AuthorListParams extends CommonListParams {}

export interface AuthorSearchParams extends CommonSearchParams {}

export interface AuthorAdvancedSearchParams extends AuthorListParams {
  firstName?: string;
  lastName?: string;
  nationality?: string;
  birthDate?: string;
  startDate?: string;
  endDate?: string;
}

export interface AuthorFilterParams {
  filter: string;
  pagination: {
    page: number;
    limit: number;
    sortBy?: string;
    sortOrder?: "ASC" | "DESC";
  };
}

export interface BookAuthorFiltersDto {
  name?: string;
  nationality?: string;
  birthYear?: number;
  isActive?: boolean;
  pagination?: {
    page: number;
    limit: number;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
  };
}

export interface BookAuthorExportParams {
  name?: string;
  nationality?: string;
  startDate?: string;
  endDate?: string;
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

export const authorsApi = {
  // Crear nuevo autor (solo admin)
  create: (data: CreateBookAuthorDto): Promise<BookAuthorResponseDto> => {
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
      sortBy: 'createdAt',
      sortOrder: 'DESC' as const,
      offset: undefined,
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
  update: (id: string, data: UpdateBookAuthorDto): Promise<BookAuthorResponseDto> => {
    return apiClient.put(`/book-authors/${id}`, data);
  },

  // Eliminar autor (solo admin)
  delete: (id: string): Promise<{ message: string }> => {
    return apiClient.delete(`/book-authors/${id}`);
  },

  // Buscar autores por término - POST /search
  search: (params: AuthorSearchParams): Promise<BookAuthorListResponseDto> => {
    const searchData = {
      ...params,
      page: params.page || 1,
      limit: params.limit || 10,
      sortBy: params.sortBy || 'createdAt',
      sortOrder: params.sortOrder || 'DESC' as const
    };
    return apiClient.post('/book-authors/search', searchData);
  },

  // Filtrar autores con criterios múltiples
  filter: (filterData: BookAuthorFiltersDto): Promise<BookAuthorListResponseDto> => {
    return apiClient.post('/book-authors/filter', filterData);
  },

  // Filtro avanzado con criterios múltiples (coincidencias)
  advancedFilter: (filterData: BookAuthorFiltersDto): Promise<BookAuthorListResponseDto> => {
    return apiClient.post('/book-authors/advanced-filter', filterData);
  },

  // Búsqueda rápida para dashboards - usando filter endpoint GET con query params
  quickFilter: (term: string, params?: { page?: number; limit?: number }): Promise<BookAuthorListResponseDto> => {
    const queryParams = {
      term,
      page: params?.page || 1,
      limit: params?.limit || 10,
      sortBy: 'createdAt',
      sortOrder: 'ASC' as const,
      offset: ((params?.page || 1) - 1) * (params?.limit || 10)
    };
    const url = buildUrl('/book-authors/filter', queryParams);
    return apiClient.get(url);
  },

  // Exportar autores a CSV (solo admin)
  exportToCsv: (params?: BookAuthorExportParams): Promise<string> => {
    const url = buildUrl('/book-authors/export/csv', params);
    return apiClient.get(url);
  },
};

export interface BookAuthorAssignmentListParams extends CommonListParams {}

// API para gestión de asignaciones autor-libro
export const bookAuthorAssignmentsApi = {
  // Crear asignación autor-libro
  create: (data: CreateBookAuthorAssignmentDto): Promise<BookAuthorAssignmentResponseDto> => {
    return apiClient.post('/book-author-assignments', data);
  },

  // Listar todas las asignaciones
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

  // Buscar asignaciones por término
  search: (params: { term: string; page?: number; limit?: number }): Promise<BookAuthorAssignmentListResponseDto> => {
    const defaultParams = {
      page: 1,
      limit: 10,
      sortBy: 'createdAt',
      sortOrder: 'DESC' as const,
      ...params,
    };
    const url = buildUrl('/book-author-assignments/search', defaultParams);
    return apiClient.get(url);
  },

  // Filtrar asignaciones con criterios múltiples
  filter: (filterData: AssignmentFiltersDto): Promise<BookAuthorAssignmentListResponseDto> => {
    return apiClient.post('/book-author-assignments/filter', filterData);
  },

  // Exportar asignaciones a CSV (solo admin)
  exportToCsv: (): Promise<string> => {
    return apiClient.get('/book-author-assignments/export/csv');
  },

  // Verificar si existe asignación específica
  checkAssignment: (bookId: string, authorId: string): Promise<{ exists: boolean }> => {
    return apiClient.get(`/book-author-assignments/check/${bookId}/${authorId}`);
  },

  // Obtener asignación por ID
  getById: (assignmentId: string): Promise<BookAuthorAssignmentResponseDto> => {
    return apiClient.get(`/book-author-assignments/${assignmentId}`);
  },

  // Actualizar asignación autor-libro
  update: (assignmentId: string, data: UpdateBookAuthorAssignmentDto): Promise<BookAuthorAssignmentResponseDto> => {
    return apiClient.put(`/book-author-assignments/${assignmentId}`, data);
  },

  // Eliminar asignación autor-libro
  delete: (assignmentId: string): Promise<{ message: string }> => {
    return apiClient.delete(`/book-author-assignments/${assignmentId}`);
  },

  // Alias para compatibilidad
  assign: (data: CreateBookAuthorAssignmentDto): Promise<BookAuthorAssignmentResponseDto> => {
    return apiClient.post('/book-author-assignments', data);
  },

  remove: (assignmentId: string): Promise<{ message: string }> => {
    return apiClient.delete(`/book-author-assignments/${assignmentId}`);
  },
};