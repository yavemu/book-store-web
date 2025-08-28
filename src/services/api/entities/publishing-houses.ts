import { apiClient } from '../client';
import { 
  CreatePublishingHouseDto,
  UpdatePublishingHouseDto,
  PublishingHouseResponseDto,
  PublishingHouseListResponseDto,
  CreatePublishingHouseResponseDto,
  UpdatePublishingHouseResponseDto,
  DeletePublishingHouseResponseDto
} from '@/types/publishing-houses';

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

export interface PublishingHouseListParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface PublishingHouseSearchParams {
  term: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export const publishingHousesApi = {
  // Crear nueva editorial (solo admin)
  create: (data: CreatePublishingHouseDto): Promise<CreatePublishingHouseResponseDto> => {
    return apiClient.post('/publishing-houses', data);
  },

  // Obtener lista paginada de editoriales
  list: (params?: PublishingHouseListParams): Promise<PublishingHouseListResponseDto> => {
    const defaultParams = {
      page: 1,
      limit: 10,
      sortBy: 'name',
      sortOrder: 'ASC' as const,
      ...params,
    };

    const url = buildUrl('/publishing-houses', defaultParams);
    return apiClient.get(url);
  },

  // Obtener editorial por ID
  getById: (id: string): Promise<PublishingHouseResponseDto> => {
    return apiClient.get(`/publishing-houses/${id}`);
  },

  // Actualizar editorial (solo admin)
  update: (id: string, data: UpdatePublishingHouseDto): Promise<UpdatePublishingHouseResponseDto> => {
    return apiClient.put(`/publishing-houses/${id}`, data);
  },

  // Eliminar editorial (solo admin)
  delete: (id: string): Promise<DeletePublishingHouseResponseDto> => {
    return apiClient.delete(`/publishing-houses/${id}`);
  },

  // Buscar editoriales por término
  search: (params: PublishingHouseSearchParams): Promise<PublishingHouseListResponseDto> => {
    const url = buildUrl('/publishing-houses/search', params);
    return apiClient.get(url);
  },

  // Obtener editoriales por país
  byCountry: (country: string, params?: Pick<PublishingHouseListParams, 'page' | 'limit'>): Promise<PublishingHouseListResponseDto> => {
    const defaultParams = {
      page: 1,
      limit: 10,
      ...params,
    };

    const url = buildUrl(`/publishing-houses/by-country/${encodeURIComponent(country)}`, defaultParams);
    return apiClient.get(url);
  },
};