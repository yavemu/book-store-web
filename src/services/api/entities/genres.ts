import { apiClient } from '../client';
import { 
  CreateBookGenreDto,
  UpdateBookGenreDto,
  BookGenreResponseDto,
  BookGenreListResponseDto
} from '@/types/genres';

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

export interface GenreListParams {
  page?: number;
  limit?: number;
}

export interface GenreSearchParams {
  q: string;
  page?: number;
  limit?: number;
}

export const genresApi = {
  // Crear nuevo género (solo admin)
  create: (data: CreateBookGenreDto): Promise<{ message: string; genre: BookGenreResponseDto }> => {
    return apiClient.post('/genres', data);
  },

  // Obtener lista paginada de géneros
  list: (params?: GenreListParams): Promise<BookGenreListResponseDto> => {
    const defaultParams = {
      page: 1,
      limit: 10,
      ...params,
    };

    const url = buildUrl('/genres', defaultParams);
    return apiClient.get(url);
  },

  // Obtener género por ID
  getById: (id: string): Promise<BookGenreResponseDto> => {
    return apiClient.get(`/genres/${id}`);
  },

  // Actualizar género (solo admin)
  update: (id: string, data: UpdateBookGenreDto): Promise<BookGenreResponseDto> => {
    return apiClient.put(`/genres/${id}`, data);
  },

  // Eliminar género (solo admin)
  delete: (id: string): Promise<{ message: string }> => {
    return apiClient.delete(`/genres/${id}`);
  },

  // Buscar géneros por nombre o descripción
  search: (params: GenreSearchParams): Promise<BookGenreListResponseDto> => {
    const url = buildUrl('/genres/search', params);
    return apiClient.get(url);
  },
};