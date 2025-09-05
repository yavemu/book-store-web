import { apiClient } from '../client';
import {
  CreateBookAuthorDto,
  UpdateBookAuthorDto,
  BookAuthorResponseDto,
  BookAuthorListResponseDto,
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

export interface AuthorSearchParams extends CommonSearchParams {
  term: string;
}

export interface AuthorAdvancedFiltersDto {
  firstName?: string;
  lastName?: string;
  nationality?: string;
  birthYear?: number;
  isActive?: boolean;
  createdAfter?: string;
  createdBefore?: string;
  pagination?: {
    page: number;
    limit: number;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
  };
}

export interface AuthorExportParams {
  firstName?: string;
  lastName?: string;
  nationality?: string;
  birthYear?: number;
  startDate?: string;
  endDate?: string;
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
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'DESC', ...searchData } = params;
    
    const queryParams = {
      page,
      limit,
      sortBy,
      sortOrder
    };

    const url = buildUrl('/book-authors/search', queryParams);
    return apiClient.post(url, searchData);
  },

  // Filtro rápido para búsqueda en tiempo real - GET /filter
  quickFilter: (term: string, params?: { page?: number; limit?: number }): Promise<BookAuthorListResponseDto> => {
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

    const url = buildUrl('/book-authors/filter', queryParams);
    return apiClient.get(url);
  },

  // Filtro avanzado con múltiples criterios - POST /advanced-filter
  advancedFilter: (params: AuthorAdvancedFiltersDto): Promise<BookAuthorListResponseDto> => {
    const { pagination, ...filterData } = params;
    
    const queryParams = {
      page: pagination?.page || 1,
      limit: pagination?.limit || 10,
      sortBy: pagination?.sortBy || 'createdAt',
      sortOrder: pagination?.sortOrder || 'DESC',
    };

    const url = buildUrl('/book-authors/advanced-filter', queryParams);
    return apiClient.post(url, filterData);
  },

  // Exportar autores a CSV (solo admin)
  exportToCsv: (params?: AuthorExportParams): Promise<string> => {
    const url = buildUrl('/book-authors/export/csv', params);
    return apiClient.get(url);
  },
};