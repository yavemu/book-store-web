import { apiClient } from '../client';
import { 
  CreateBookGenreDto, 
  UpdateBookGenreDto, 
  BookGenreResponseDto, 
  BookGenreListResponseDto,
  CommonListParams,
  CommonSearchParams
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

export interface GenreListParams extends CommonListParams {}

export interface GenreSearchParams extends CommonSearchParams {}

export interface GenreFilterParams {
  filter: string;
  pagination: {
    page: number;
    limit: number;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
  };
}

export interface GenreAdvancedFilterDto {
  name?: string;
  description?: string;
  isActive?: boolean;
  createdAfter?: string;
  createdBefore?: string;
}

export interface GenreExportParams {
  name?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
}

export interface GenreAdvancedSearchParams extends GenreListParams {
  name?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
}

export const genresApi = {
  // Crear nuevo género (solo admin)
  create: (data: CreateBookGenreDto): Promise<BookGenreResponseDto> => {
    return apiClient.post('/genres', data);
  },

  // Obtener lista paginada de géneros
  list: (params?: GenreListParams): Promise<BookGenreListResponseDto> => {
    const defaultParams = {
      page: 1,
      limit: 10,
      sortBy: 'createdAt',
      sortOrder: 'DESC' as const,
      offset: undefined,
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

  // Eliminar género (soft delete - solo admin)
  delete: (id: string): Promise<{ message: string }> => {
    return apiClient.delete(`/genres/${id}`);
  },

  // Buscar géneros por nombre o descripción
  search: (params: GenreSearchParams): Promise<BookGenreListResponseDto> => {
    const defaultParams = {
      page: 1,
      limit: 10,
      sortBy: 'createdAt',
      sortOrder: 'DESC' as const,
      offset: undefined,
      ...params,
    };
    const url = buildUrl('/genres/search', defaultParams);
    return apiClient.get(url);
  },

  // Filtrar géneros en tiempo real
  filter: (params: GenreFilterParams): Promise<BookGenreListResponseDto> => {
    return apiClient.post('/genres/filter', params);
  },

  // Filtro avanzado de géneros
  advancedFilter: (filterData: GenreAdvancedFilterDto, params?: GenreListParams): Promise<BookGenreListResponseDto> => {
    const queryParams = {
      page: 1,
      limit: 10,
      sortBy: 'createdAt',
      sortOrder: 'DESC' as const,
      offset: undefined,
      ...params,
    };
    const url = buildUrl('/genres/advanced-filter', queryParams);
    return apiClient.post(url, filterData);
  },

  // Exportar géneros a CSV (solo admin)
  exportToCsv: (params?: GenreExportParams): Promise<string> => {
    const url = buildUrl('/genres/export/csv', params);
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