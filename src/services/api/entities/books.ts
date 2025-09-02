import { apiClient } from "../client";
import {
  CreateBookDto,
  UpdateBookDto,
  BookResponseDto,
  BookListResponseDto,
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

export interface BookListParams extends CommonListParams {
  title?: string;
  isbnCode?: string;
  price?: number;
  stockQuantity?: number;
  isAvailable?: boolean;
  genre?: string;
  publisher?: string;
  startDate?: string;
  endDate?: string;
}

export interface BookSearchParams extends CommonSearchParams {}

export interface BookFilterParams {
  filter: string;
  pagination: {
    page: number;
    limit: number;
    sortBy?: string;
    sortOrder?: "ASC" | "DESC";
  };
}

export interface BookAdvancedFilterDto {
  title?: string;
  isbnCode?: string;
  authorName?: string;
  genreId?: string;
  publisherId?: string;
  minPrice?: number;
  maxPrice?: number;
  isAvailable?: boolean;
  publicationDateFrom?: string;
  publicationDateTo?: string;
  createdAfter?: string;
  createdBefore?: string;
}

export interface BookExportParams {
  title?: string;
  isbnCode?: string;
  author?: string;
  genre?: string;
  publisher?: string;
  startDate?: string;
  endDate?: string;
  priceMin?: number;
  priceMax?: number;
  isAvailable?: boolean;
}

export const booksApi = {
  // Crear libro
  create: (data: CreateBookDto): Promise<BookResponseDto> => {
    return apiClient.post("/book-catalog", data);
  },

  // Obtener lista paginada de libros
  list: (params?: BookListParams): Promise<BookListResponseDto> => {
    const defaultParams = {
      page: 1,
      limit: 10,
      sortBy: "createdAt",
      sortOrder: "DESC" as const,
      ...params,
    };

    const url = buildUrl("/book-catalog", defaultParams);
    return apiClient.get(url);
  },

  // Obtener libro por ID
  getById: (id: string): Promise<BookResponseDto> => {
    return apiClient.get(`/book-catalog/${id}`);
  },

  // Actualizar libro
  update: (id: string, data: UpdateBookDto): Promise<BookResponseDto> => {
    return apiClient.put(`/book-catalog/${id}`, data);
  },

  // Eliminar libro (soft delete)
  delete: (id: string): Promise<{ message: string }> => {
    return apiClient.delete(`/book-catalog/${id}`);
  },

  // Buscar libros por término
  search: (params: BookSearchParams): Promise<BookListResponseDto> => {
    const defaultParams = {
      page: 1,
      limit: 10,
      sortBy: "createdAt",
      sortOrder: "DESC" as const,
      ...params,
    };

    const url = buildUrl("/book-catalog/search", defaultParams);
    return apiClient.get(url);
  },

  // Filtrar libros en tiempo real
  filter: (params: BookFilterParams): Promise<BookListResponseDto> => {
    return apiClient.post("/book-catalog/filter", params);
  },

  // Filtro avanzado de libros
  advancedFilter: (filterData: BookAdvancedFilterDto, params?: BookListParams): Promise<BookListResponseDto> => {
    const queryParams = {
      page: 1,
      limit: 10,
      sortBy: "createdAt",
      sortOrder: "DESC" as const,
      ...params,
    };

    const url = buildUrl("/book-catalog/advanced-filter", queryParams);
    return apiClient.post(url, filterData);
  },

  // Obtener libros disponibles
  available: (params?: BookListParams): Promise<BookListResponseDto> => {
    const url = buildUrl("/book-catalog/available", params);
    return apiClient.get(url);
  },

  // Obtener libros por género
  byGenre: (genreId: string, params?: BookListParams): Promise<BookListResponseDto> => {
    const url = buildUrl(`/book-catalog/by-genre/${genreId}`, params);
    return apiClient.get(url);
  },

  // Obtener libros por editorial
  byPublisher: (publisherId: string, params?: BookListParams): Promise<BookListResponseDto> => {
    const url = buildUrl(`/book-catalog/by-publisher/${publisherId}`, params);
    return apiClient.get(url);
  },

  // Verificar disponibilidad de ISBN
  checkIsbn: (isbn: string): Promise<{ isAvailable: boolean; message: string }> => {
    return apiClient.get(`/book-catalog/isbn/${isbn}/availability`);
  },

  // Exportar libros a CSV
  exportToCsv: (params?: BookExportParams): Promise<string> => {
    const url = buildUrl("/book-catalog/export/csv", params);
    return apiClient.get(url);
  },

  // Subir imagen de portada
  uploadCover: (bookId: string, file: File): Promise<{ coverImageUrl: string }> => {
    const formData = new FormData();
    formData.append("cover", file);
    return apiClient.post(`/book-catalog/${bookId}/cover`, formData);
  },
};