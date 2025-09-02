import { apiClient } from '../client';
import { 
  CreatePublishingHouseDto,
  UpdatePublishingHouseDto,
  PublishingHouseResponseDto,
  PublishingHouseListResponseDto,
  CreatePublishingHouseResponseDto,
  UpdatePublishingHouseResponseDto,
  DeletePublishingHouseResponseDto
} from '@/types/api/entities';

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

export interface PublishingHouseFiltersDto {
  name?: string;
  country?: string;
  city?: string;
  established?: number;
  isActive?: boolean;
  pagination?: {
    page: number;
    limit: number;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
  };
}

export interface PublishingHouseExportParams {
  name?: string;
  country?: string;
  city?: string;
  startDate?: string;
  endDate?: string;
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
      sortBy: 'createdAt',
      sortOrder: 'DESC' as const,
      offset: undefined,
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
    const defaultParams = {
      page: 1,
      limit: 10,
      sortBy: 'name',
      sortOrder: 'ASC' as const,
      ...params,
    };
    const url = buildUrl('/publishing-houses/search', defaultParams);
    return apiClient.get(url);
  },

  // Filtrar editoriales con criterios múltiples
  filter: (filterData: PublishingHouseFiltersDto): Promise<PublishingHouseListResponseDto> => {
    return apiClient.post('/publishing-houses/filter', filterData);
  },

  // Exportar editoriales a CSV (solo admin)
  exportToCsv: (params?: PublishingHouseExportParams): Promise<string> => {
    const url = buildUrl('/publishing-houses/export/csv', params);
    return apiClient.get(url);
  },

  // Obtener opciones para formularios select
  getSelectOptions: async (): Promise<Array<{ value: string; label: string }>> => {
    try {
      const response = await publishingHousesApi.list({ limit: 100, sortBy: 'name', sortOrder: 'ASC' });
      return response.data.map(publisher => ({
        value: publisher.id,
        label: publisher.name
      }));
    } catch (error) {
      console.error('Error fetching publisher options:', error);
      // Fallback con algunas editoriales comunes  
      return [
        { value: "d875c518-4db9-4dba-86f7-357b3b140fef", label: "Planeta" },
        { value: "c23f7c8f-bb03-401b-b92d-10161b0f9d0f", label: "Random House" },
        { value: "5de2b076-c26d-4af5-a2b7-5315d353aa62", label: "Norma" },
        { value: "aee0d473-b0fb-428b-a2fc-c9ba47f66cb5", label: "McGraw Hill" }
      ];
    }
  },
};