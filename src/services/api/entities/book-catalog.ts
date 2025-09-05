import { apiClient } from '../client';
import {
  CreateBookCatalogDto,
  UpdateBookCatalogDto,
  BookCatalogResponseDto,
  BookCatalogListResponseDto,
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

export interface BookCatalogListParams extends CommonListParams {}

export interface BookCatalogSearchParams extends CommonSearchParams {
  term: string;
}

export interface BookCatalogAdvancedFiltersDto {
  title?: string;
  isbnCode?: string;
  genreId?: string;
  publisherId?: string;
  authorId?: string;
  priceMin?: number;
  priceMax?: number;
  isAvailable?: boolean;
  stockMin?: number;
  stockMax?: number;
  publicationDateFrom?: string;
  publicationDateTo?: string;
  pageCountMin?: number;
  pageCountMax?: number;
  createdAfter?: string;
  createdBefore?: string;
  pagination?: {
    page: number;
    limit: number;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
  };
}

export interface BookCatalogExportParams {
  title?: string;
  isbnCode?: string;
  genreId?: string;
  publisherId?: string;
  authorId?: string;
  priceMin?: number;
  priceMax?: number;
  isAvailable?: boolean;
  stockMin?: number;
  stockMax?: number;
  startDate?: string;
  endDate?: string;
}

export interface UploadBookCoverDto {
  cover: File;
}

export const bookCatalogApi = {
  // Crear nuevo libro (solo admin)
  create: (data: CreateBookCatalogDto): Promise<BookCatalogResponseDto> => {
    const transformedData = { ...data };
    
    // Asegurar que el precio sea un número con formato decimal
    if (typeof transformedData.price === 'string') {
      transformedData.price = parseFloat(transformedData.price);
    }
    
    // Redondear el precio a 2 decimales
    transformedData.price = Math.round(transformedData.price * 100) / 100;
    
    return apiClient.post('/book-catalog', transformedData);
  },

  // Obtener lista paginada de libros
  list: (params?: BookCatalogListParams): Promise<BookCatalogListResponseDto> => {
    const defaultParams = {
      page: 1,
      limit: 10,
      sortBy: 'createdAt',
      sortOrder: 'DESC' as const,
      ...params,
    };

    const url = buildUrl('/book-catalog', defaultParams);
    return apiClient.get(url);
  },

  // Obtener libro por ID
  getById: (id: string): Promise<BookCatalogResponseDto> => {
    return apiClient.get(`/book-catalog/${id}`);
  },

  // Actualizar libro (solo admin)
  update: (id: string, data: UpdateBookCatalogDto): Promise<BookCatalogResponseDto> => {
    const transformedData = { ...data };
    
    // Transformar precio si está presente
    if (transformedData.price !== undefined) {
      if (typeof transformedData.price === 'string') {
        transformedData.price = parseFloat(transformedData.price);
      }
      transformedData.price = Math.round(transformedData.price * 100) / 100;
    }
    
    return apiClient.put(`/book-catalog/${id}`, transformedData);
  },

  // Eliminar libro (solo admin)
  delete: (id: string): Promise<{ message: string }> => {
    return apiClient.delete(`/book-catalog/${id}`);
  },

  // Buscar libros por término - POST /search
  search: (params: BookCatalogSearchParams): Promise<BookCatalogListResponseDto> => {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'DESC', ...searchData } = params;
    
    const queryParams = {
      page,
      limit,
      sortBy,
      sortOrder
    };

    const url = buildUrl('/book-catalog/search', queryParams);
    return apiClient.post(url, searchData);
  },

  // Filtro rápido para búsqueda en tiempo real - GET /filter
  quickFilter: (term: string, params?: { page?: number; limit?: number }): Promise<BookCatalogListResponseDto> => {
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

    const url = buildUrl('/book-catalog/filter', queryParams);
    return apiClient.get(url);
  },

  // Filtro avanzado con múltiples criterios - POST /advanced-filter
  advancedFilter: (params: BookCatalogAdvancedFiltersDto): Promise<BookCatalogListResponseDto> => {
    const { pagination, ...filterData } = params;
    
    const queryParams = {
      page: pagination?.page || 1,
      limit: pagination?.limit || 10,
      sortBy: pagination?.sortBy || 'createdAt',
      sortOrder: pagination?.sortOrder || 'DESC',
    };

    const url = buildUrl('/book-catalog/advanced-filter', queryParams);
    return apiClient.post(url, filterData);
  },

  // Exportar libros a CSV (solo admin)
  exportToCsv: (params?: BookCatalogExportParams): Promise<string> => {
    const url = buildUrl('/book-catalog/export/csv', params);
    return apiClient.get(url);
  },

  // Subir portada del libro (solo admin)
  uploadCover: (id: string, coverData: UploadBookCoverDto): Promise<BookCatalogResponseDto> => {
    const formData = new FormData();
    formData.append('cover', coverData.cover);
    
    return apiClient.post(`/book-catalog/${id}/upload-cover`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Obtener portada del libro
  getCover: (id: string): Promise<Blob> => {
    return apiClient.get(`/book-catalog/${id}/cover`, {
      responseType: 'blob',
    });
  },
};