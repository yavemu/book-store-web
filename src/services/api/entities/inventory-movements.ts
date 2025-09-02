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
  filter: string;
  pagination: {
    page: number;
    limit: number;
    sortBy?: string;
    sortOrder?: "ASC" | "DESC";
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
    return apiClient.post('/inventory-movements', data);
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
    const url = buildUrl('/inventory-movements', defaultParams);
    return apiClient.get(url);
  },

  // Obtener movimiento por ID
  getById: (id: string): Promise<InventoryMovementResponseDto> => {
    return apiClient.get(`/inventory-movements/${id}`);
  },

  // Actualizar movimiento de inventario
  update: (id: string, data: UpdateInventoryMovementDto): Promise<InventoryMovementResponseDto> => {
    return apiClient.put(`/inventory-movements/${id}`, data);
  },

  // Eliminar movimiento de inventario (soft delete)
  delete: (id: string): Promise<{ message: string }> => {
    return apiClient.delete(`/inventory-movements/${id}`);
  },

  // Buscar movimientos por término
  search: (params: InventoryMovementSearchParams): Promise<InventoryMovementListResponseDto> => {
    const defaultParams = {
      page: 1,
      limit: 10,
      sortBy: 'createdAt',
      sortOrder: 'DESC' as const,
      ...params,
    };
    const url = buildUrl('/inventory-movements/search', defaultParams);
    return apiClient.get(url);
  },

  // Filtrar movimientos en tiempo real
  filter: (params: InventoryMovementFilterParams): Promise<InventoryMovementListResponseDto> => {
    return apiClient.post('/inventory-movements/filter', params);
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

    const url = buildUrl("/inventory-movements/advanced-filter", queryParams);
    return apiClient.post(url, filterData);
  },

  // Exportar movimientos a CSV
  exportToCsv: (params?: InventoryMovementExportParams): Promise<string> => {
    const url = buildUrl('/inventory-movements/export/csv', params);
    return apiClient.get(url);
  },

  // Obtener estadísticas de movimientos
  getStats: (params?: { startDate?: string; endDate?: string }): Promise<{
    totalMovements: number;
    movementsByType: Record<string, number>;
    movementsByStatus: Record<string, number>;
  }> => {
    const url = buildUrl('/inventory-movements/stats', params);
    return apiClient.get(url);
  },
};