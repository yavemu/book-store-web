import { apiClient } from '../client';
import { CreateBookGenreDto, UpdateBookGenreDto, BookGenreResponseDto, BookGenreListResponseDto } from "@/types/api/entities";

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

export interface GenreAdvancedSearchParams extends GenreListParams {
  name?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
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

  // Obtener opciones para formularios select
  getSelectOptions: async (): Promise<Array<{ value: string; label: string }>> => {
    try {
      const response = await genresApi.list({ limit: 100, sortBy: 'name', sortOrder: 'ASC' });
      return response.data.map(genre => ({
        value: genre.id,
        label: genre.name
      }));
    } catch (error) {
      console.error('Error fetching genre options:', error);
      // Fallback con algunos géneros comunes
      return [
        { value: "c3acfc56-05c4-4ec4-8a8a-f42fdb76f0ab", label: "Realismo Mágico" },
        { value: "956c1e72-3765-426c-a96c-017bf8cd6a62", label: "Romance" },
        { value: "331403ac-b685-49e1-8780-243f84024147", label: "Aventura" },
        { value: "e2ff5335-9b04-42ed-be74-4e0893f11252", label: "Misterio" }
      ];
    }
  },
};