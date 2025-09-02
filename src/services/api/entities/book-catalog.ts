import {
  BookCatalog,
  CreateBookCatalogDto,
  UpdateBookCatalogDto,
  BookFiltersDto,
  BookCatalogListParams,
  BookCatalogSearchParams,
  IsbnCheckResponse,
  Genre,
  PublishingHouse,
  Author,
} from "@/types/domain";
import { PaginatedResponse } from "@/types/api";
import { apiClient } from "../client";

// Utilidad para construir query strings
const buildQueryString = (params: Record<string, unknown>): string => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, String(value));
    }
  });

  return searchParams.toString();
};

// Utilidad para construir URLs con parámetros opcionales
const buildUrl = (basePath: string, queryParams?: Record<string, unknown>): string => {
  if (!queryParams) return basePath;

  const queryString = buildQueryString(queryParams);
  return queryString ? `${basePath}?${queryString}` : basePath;
};

export const bookCatalogApi = {
  // Listar libros con paginación y filtros
  list: (params?: BookCatalogListParams): Promise<PaginatedResponse<BookCatalog>> => {
    const defaultParams = {
      page: 1,
      limit: 10,
      sortBy: 'createdAt',
      sortOrder: 'DESC' as const,
      ...params,
    };

    const url = buildUrl("/book-catalog", defaultParams);

    console.log("bookCatalogApi.list: llamando URL:", url);
    console.log("bookCatalogApi.list: parámetros:", defaultParams);

    return apiClient.get(url);
  },

  // Obtener libro por ID
  getById: (id: string): Promise<BookCatalog> => apiClient.get(`/book-catalog/${id}`),

  // Crear nuevo libro
  create: (data: CreateBookCatalogDto): Promise<BookCatalog> => {
    // Convertir el precio a decimal con 2 posiciones decimales para la BD
    const dataWithDecimalPrice = {
      ...data,
      price: parseFloat(data.price.toFixed(2)),
    };

    console.log("📤 Enviando a API con precio decimal:", dataWithDecimalPrice);
    return apiClient.post("/book-catalog", dataWithDecimalPrice);
  },

  // Actualizar libro
  update: (id: string, data: UpdateBookCatalogDto): Promise<BookCatalog> => {
    // Si el precio está presente, convertirlo a decimal con 2 posiciones decimales
    const dataWithDecimalPrice = data.price
      ? {
          ...data,
          price: parseFloat(data.price.toFixed(2)),
        }
      : data;

    return apiClient.put(`/book-catalog/${id}`, dataWithDecimalPrice);
  },

  // Eliminar libro (soft delete)
  delete: (id: string): Promise<{ message: string }> => apiClient.delete(`/book-catalog/${id}`),

  // Verificar ISBN
  checkIsbn: (isbn: string): Promise<IsbnCheckResponse> => apiClient.get(`/book-catalog/check-isbn/${isbn}`),

  // Buscar libros
  search: (params: BookCatalogSearchParams): Promise<PaginatedResponse<BookCatalog>> => {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'DESC', ...searchData } = params;
    
    const queryParams = {
      page,
      limit,
      sortBy,
      sortOrder
    };

    const url = buildUrl("/book-catalog/search", queryParams);
    return apiClient.post(url, searchData);
  },

  // Filtrar libros en tiempo real
  filter: (params: { filter: string; pagination: { page: number; limit: number; sortBy?: string; sortOrder?: 'ASC' | 'DESC' } }): Promise<PaginatedResponse<BookCatalog>> => {
    return apiClient.post("/book-catalog/filter", params);
  },

  // Filtros avanzados
  advancedFilter: (filters: BookFiltersDto, params?: { page?: number; limit?: number; sortBy?: string; sortOrder?: 'ASC' | 'DESC' }): Promise<PaginatedResponse<BookCatalog>> => {
    const queryParams = {
      page: 1,
      limit: 10,
      sortBy: 'createdAt',
      sortOrder: 'DESC' as const,
      ...params,
    };
    const url = buildUrl("/book-catalog/advanced-filter", queryParams);
    return apiClient.post(url, filters);
  },

  // Exportar libros a CSV
  exportToCsv: (params?: { title?: string; isbn?: string; author?: string; genre?: string; publisher?: string; startDate?: string; endDate?: string }): Promise<string> => {
    const url = buildUrl('/book-catalog/export/csv', params);
    return apiClient.get(url);
  },

  // Subir portada del libro
  uploadCover: (id: string, coverFile: File): Promise<BookCatalog> => {
    const formData = new FormData();
    formData.append('cover', coverFile);
    return apiClient.post(`/book-catalog/${id}/upload-cover`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Eliminar portada del libro
  removeCover: (id: string): Promise<{ message: string }> => {
    return apiClient.delete(`/book-catalog/${id}/cover`);
  },

  // Libros disponibles
  available: (page?: number, limit?: number): Promise<PaginatedResponse<BookCatalog>> => {
    const queryParams: Record<string, unknown> = {};
    if (page) queryParams.page = page;
    if (limit) queryParams.limit = limit;

    const url = buildUrl("/book-catalog/available", queryParams);
    return apiClient.get(url);
  },

  // Libros por género
  byGenre: (genreId: string, page?: number, limit?: number): Promise<PaginatedResponse<BookCatalog>> => {
    const queryParams: Record<string, unknown> = {};
    if (page) queryParams.page = page;
    if (limit) queryParams.limit = limit;

    const url = buildUrl(`/book-catalog/by-genre/${genreId}`, queryParams);
    return apiClient.get(url);
  },

  // Libros por editorial
  byPublisher: (publisherId: string, page?: number, limit?: number): Promise<PaginatedResponse<BookCatalog>> => {
    const queryParams: Record<string, unknown> = {};
    if (page) queryParams.page = page;
    if (limit) queryParams.limit = limit;

    const url = buildUrl(`/book-catalog/by-publisher/${publisherId}`, queryParams);
    return apiClient.get(url);
  },
};

// Note: Auxiliary APIs moved to their respective entity files to avoid conflicts:
// - genresApi -> entities/genres.ts
// - publishingHousesApi -> entities/publishing-houses.ts  
// - authorsApi -> entities/authors.ts
