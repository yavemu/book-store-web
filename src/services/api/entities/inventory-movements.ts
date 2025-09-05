import { apiClient } from '../client';
import {
  CreateInventoryMovementDto,
  UpdateInventoryMovementDto,
  InventoryMovementResponseDto,
  InventoryMovementListResponseDto,
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

export interface InventoryMovementListParams extends CommonListParams {}

export interface InventoryMovementSearchParams extends CommonSearchParams {
  movementType?: 'PURCHASE' | 'SALE' | 'DISCOUNT' | 'INCREASE' | 'OUT_OF_STOCK' | 'ARCHIVED';
  status?: 'PENDING' | 'COMPLETED' | 'ERROR';
  entityType?: string;
  entityId?: string;
  userId?: string;
  startDate?: string;
  endDate?: string;
}

export interface InventoryMovementFilterParams {
  pagination: {
    page: number;
    limit: number;
    sortBy?: string;
    sortOrder?: "ASC" | "DESC";
  };
  filters?: {
    movementType?: 'PURCHASE' | 'SALE' | 'DISCOUNT' | 'INCREASE' | 'OUT_OF_STOCK' | 'ARCHIVED';
    status?: 'PENDING' | 'COMPLETED' | 'ERROR';
    entityType?: string;
    userId?: string;
  };
  search?: {
    term?: string;
    fields?: string[];
  };
}

export interface InventoryMovementAdvancedFilterDto {
  movementType?: 'PURCHASE' | 'SALE' | 'DISCOUNT' | 'INCREASE' | 'OUT_OF_STOCK' | 'ARCHIVED';
  status?: 'PENDING' | 'COMPLETED' | 'ERROR';
  entityType?: string;
  userId?: string;
  userRole?: string;
  dateFrom?: string;
  dateTo?: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface InventoryMovementExportParams {
  movementType?: 'PURCHASE' | 'SALE' | 'DISCOUNT' | 'INCREASE' | 'OUT_OF_STOCK' | 'ARCHIVED';
  status?: 'PENDING' | 'COMPLETED' | 'ERROR';
  entityType?: string;
  userId?: string;
  startDate?: string;
  endDate?: string;
}

export const inventoryMovementsApi = {
  // Crear nuevo movimiento de inventario
  create: (data: CreateInventoryMovementDto): Promise<InventoryMovementResponseDto> => {
    return apiClient.post('/inventory_movements', data);
  },

  // Obtener lista paginada de movimientos de inventario
  list: (params?: InventoryMovementListParams): Promise<InventoryMovementListResponseDto> => {
    const defaultParams = {
      page: 1,
      limit: 10,
      sortBy: 'createdAt',
      sortOrder: 'DESC' as const,
      ...params,
    };
    const url = buildUrl('/inventory_movements', defaultParams);
    return apiClient.get(url);
  },

  // Obtener movimiento por ID
  getById: (id: string): Promise<InventoryMovementResponseDto> => {
    return apiClient.get(`/inventory_movements/${id}`);
  },

  // Actualizar movimiento de inventario
  update: (id: string, data: UpdateInventoryMovementDto): Promise<InventoryMovementResponseDto> => {
    return apiClient.put(`/inventory_movements/${id}`, data);
  },

  // Eliminar movimiento de inventario (soft delete)
  delete: (id: string): Promise<{ message: string }> => {
    return apiClient.delete(`/inventory_movements/${id}`);
  },

  // Buscar movimientos por término
  search: (params: InventoryMovementSearchParams): Promise<InventoryMovementListResponseDto> => {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'DESC', ...searchData } = params;
    
    const queryParams = {
      page,
      limit,
      sortBy,
      sortOrder
    };

    const url = buildUrl('/inventory_movements/search', queryParams);
    return apiClient.post(url, searchData);
  },

  // Filtrar movimientos en tiempo real
  filter: (params: InventoryMovementFilterParams): Promise<InventoryMovementListResponseDto> => {
    return apiClient.post('/inventory_movements/filter', params);
  },

  // Búsqueda rápida para dashboards - usando filter endpoint GET con query params
  quickFilter: (term: string, params?: { page?: number; limit?: number }): Promise<InventoryMovementListResponseDto> => {
    const queryParams = {
      term,
      page: params?.page || 1,
      limit: params?.limit || 10,
      sortBy: 'createdAt',
      sortOrder: 'DESC' as const,
    };
    const url = buildUrl('/inventory_movements/filter', queryParams);
    return apiClient.get(url);
  },

  // Filtro avanzado de movimientos
  advancedFilter: (filterData: InventoryMovementAdvancedFilterDto, params?: InventoryMovementListParams): Promise<InventoryMovementListResponseDto> => {
    const queryParams = {
      page: 1,
      limit: 10,
      sortBy: "createdAt",
      sortOrder: "DESC" as const,
      ...params,
    };

    const url = buildUrl("/inventory_movements/advanced-filter", queryParams);
    return apiClient.post(url, filterData);
  },

  // Exportar movimientos a CSV
  exportToCsv: (params?: InventoryMovementExportParams): Promise<string> => {
    const url = buildUrl('/inventory_movements/export/csv', params);
    return apiClient.get(url);
  },

  // Obtener estadísticas de movimientos
  getStats: (params?: { startDate?: string; endDate?: string }): Promise<{
    totalMovements: number;
    movementsByType: Record<string, number>;
    movementsByStatus: Record<string, number>;
  }> => {
    const url = buildUrl('/inventory_movements/stats', params);
    return apiClient.get(url);
  },
};