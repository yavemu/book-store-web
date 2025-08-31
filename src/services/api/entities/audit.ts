import { apiClient } from '../client';

export interface AuditLog {
  id: string;
  performedBy: string; // Updated to match API response
  entityId: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'REGISTER';
  details: string;
  entityType: string;
  createdAt: string;
}

export interface AuditLogListResponse {
  data: AuditLog[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

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

export interface AuditListParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface AuditSearchParams {
  term: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface AuditAdvancedSearchParams extends AuditListParams {
  action?: string;
  entityType?: string;
  entityId?: string;
  userId?: string;
  startDate?: string;
  endDate?: string;
}

export type AuditAction = 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'REGISTER';

export interface AuditFilterParams {
  filter: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  offset?: number;
}

export interface AuditAdvancedFilterDto {
  userId?: string;
  entityType?: string;
  action?: string;
  startDate?: string;
  endDate?: string;
  pagination?: {
    page: number;
    limit: number;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
  };
}

export interface AuditExportParams {
  performedBy?: string;
  entityId?: string;
  entityType?: string;
  action?: 'CREATE' | 'UPDATE' | 'DELETE';
  details?: string;
  startDate?: string;
  endDate?: string;
}

export const auditApi = {
  // Obtener lista paginada de todos los registros de auditoría (solo admin)
  list: (params?: AuditListParams): Promise<AuditLogListResponse> => {
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
  getById: (id: string): Promise<AuditLog> => {
    return apiClient.get(`/audit/${id}`);
  },

  // Buscar registros de auditoría por término en detalles (solo admin)
  search: (params: AuditSearchParams): Promise<AuditLogListResponse> => {
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
  filter: (params: AuditFilterParams): Promise<AuditLogListResponse> => {
    const defaultParams = {
      page: 1,
      limit: 10,
      sortBy: 'createdAt',
      sortOrder: 'DESC' as const,
      offset: undefined,
      ...params,
    };

    const url = buildUrl('/audit/filter', defaultParams);
    return apiClient.get(url);
  },

  // Filtro avanzado de registros de auditoría (solo admin)
  advancedFilter: (filterData: AuditAdvancedFilterDto, params?: AuditListParams): Promise<AuditLogListResponse> => {
    const queryParams = {
      page: 1,
      limit: 10,
      sortBy: 'createdAt',
      sortOrder: 'DESC' as const,
      offset: undefined,
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