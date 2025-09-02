import { apiClient } from '../client';
import {
  AuditLogResponseDto,
  AuditLogListResponseDto,
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

export interface AuditListParams extends CommonListParams {}

export interface AuditSearchParams extends CommonSearchParams {}

export interface AuditAdvancedSearchParams extends AuditListParams {
  action?: 'CREATE' | 'UPDATE' | 'DELETE' | 'READ' | 'LOGIN' | 'REGISTER';
  entityType?: string;
  entityId?: string;
  performedBy?: string;
  startDate?: string;
  endDate?: string;
}

export type AuditAction = 'CREATE' | 'UPDATE' | 'DELETE' | 'read' | 'LOGIN' | 'REGISTER';

export interface AuditFilterParams {
  filter: string;
  pagination: {
    page: number;
    limit: number;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
  };
}

export interface AuditAdvancedFilterDto {
  performedBy?: string;
  entityType?: string;
  action?: 'CREATE' | 'UPDATE' | 'DELETE' | 'read' | 'LOGIN' | 'REGISTER';
  entityId?: string;
  startDate?: string;
  endDate?: string;
}

export interface AuditExportParams {
  performedBy?: string;
  entityId?: string;
  entityType?: string;
  action?: 'CREATE' | 'UPDATE' | 'DELETE' | 'read' | 'LOGIN' | 'REGISTER';
  details?: string;
  startDate?: string;
  endDate?: string;
}

export const auditApi = {
  // Obtener lista paginada de todos los registros de auditoría (solo admin)
  list: (params?: AuditListParams): Promise<AuditLogListResponseDto> => {
    const defaultParams = {
      page: 1,
      limit: 10,
      sortBy: 'createdAt',
      sortOrder: 'DESC' as const,
      offset: undefined,
      ...params,
    };

    const url = buildUrl('/audit', defaultParams);
    return apiClient.get(url);
  },

  // Obtener registro de auditoría por ID (solo admin)
  getById: (id: string): Promise<AuditLogResponseDto> => {
    return apiClient.get(`/audit/${id}`);
  },

  // Buscar registros de auditoría por término en detalles (solo admin)
  search: (params: AuditSearchParams): Promise<AuditLogListResponseDto> => {
    const defaultParams = {
      page: 1,
      limit: 10,
      sortBy: 'createdAt',
      sortOrder: 'DESC' as const,
      offset: undefined,
      ...params,
    };

    const url = buildUrl('/audit/search', defaultParams);
    return apiClient.get(url);
  },

  // Filtrar registros de auditoría en tiempo real (solo admin)
  filter: (params: AuditFilterParams): Promise<AuditLogListResponseDto> => {
    return apiClient.post('/audit/filter', params);
  },

  // Filtro avanzado de registros de auditoría (solo admin)
  advancedFilter: (filterData: AuditAdvancedFilterDto, params?: AuditListParams): Promise<AuditLogListResponseDto> => {
    const queryParams = {
      page: 1,
      limit: 10,
      sortBy: 'createdAt',
      sortOrder: 'DESC' as const,
      ...params,
    };

    const url = buildUrl('/audit/advanced-filter', queryParams);
    return apiClient.post(url, filterData);
  },

  // Exportar registros de auditoría a CSV (solo admin)
  exportToCsv: (params?: AuditExportParams): Promise<string> => {
    const url = buildUrl('/audit/export/csv', params);
    return apiClient.get(url);
  },
};