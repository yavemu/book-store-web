import { apiClient } from '../client';
import { AuditLogResponseDto, AuditLogListResponseDto } from "@/types/api/entities";

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

export type AuditAction = 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'REGISTER';

export const auditApi = {
  // Obtener lista paginada de todos los registros de auditoría (solo admin)
  list: (params?: AuditListParams): Promise<AuditLogListResponseDto> => {
    const defaultParams = {
      page: 1,
      limit: 20,
      sortBy: 'createdAt',
      sortOrder: 'DESC' as const,
      ...params,
    };

    const url = buildUrl('/audit', defaultParams);
    return apiClient.get(url);
  },

  // Obtener registros de auditoría por usuario específico (solo admin)
  getUserAuditHistory: (userId: string, params?: Pick<AuditListParams, 'page' | 'limit'>): Promise<AuditLogListResponseDto> => {
    const defaultParams = {
      page: 1,
      limit: 20,
      ...params,
    };

    const url = buildUrl(`/audit/user/${userId}`, defaultParams);
    return apiClient.get(url);
  },

  // Obtener registros de auditoría por entidad específica (solo admin)
  getEntityAuditHistory: (entityId: string, params?: Pick<AuditListParams, 'page' | 'limit'>): Promise<AuditLogListResponseDto> => {
    const defaultParams = {
      page: 1,
      limit: 20,
      ...params,
    };

    const url = buildUrl(`/audit/entity/${entityId}`, defaultParams);
    return apiClient.get(url);
  },

  // Obtener registros de auditoría por tipo de acción (solo admin)
  getAuditsByAction: (action: AuditAction, params?: AuditListParams): Promise<AuditLogListResponseDto> => {
    const defaultParams = {
      page: 1,
      limit: 20,
      sortBy: 'createdAt',
      sortOrder: 'DESC' as const,
      ...params,
    };

    const url = buildUrl(`/audit/action/${action}`, defaultParams);
    return apiClient.get(url);
  },

  // Obtener registros de auditoría por tipo de entidad (solo admin)
  getAuditsByEntityType: (entityType: string, params?: AuditListParams): Promise<AuditLogListResponseDto> => {
    const defaultParams = {
      page: 1,
      limit: 20,
      sortBy: 'createdAt',
      sortOrder: 'DESC' as const,
      ...params,
    };

    const url = buildUrl(`/audit/type/${entityType}`, defaultParams);
    return apiClient.get(url);
  },

  // Buscar registros de auditoría por término en detalles (solo admin)
  search: (params: AuditSearchParams): Promise<AuditLogListResponseDto> => {
    const defaultParams = {
      sortBy: 'createdAt',
      sortOrder: 'DESC' as const,
      ...params,
    };

    const url = buildUrl('/audit/search', defaultParams);
    return apiClient.get(url);
  },
};