import { apiClient } from '../client';

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

export interface InventoryMovement {
  id: string;
  bookId: string;
  movementType: 'IN' | 'OUT';
  quantity: number;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface InventoryMovementListResponse {
  data: InventoryMovement[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface InventoryMovementListParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  offset?: number;
}

export interface InventoryMovementSearchParams {
  term?: string;
  movementType?: 'IN' | 'OUT';
  bookId?: string;
  startDate?: string;
  endDate?: string;
}

export const inventoryMovementsApi = {
  // Obtener todos los movimientos de inventario (GET /api/inventory_movements)
  getAll: (params?: InventoryMovementListParams): Promise<InventoryMovementListResponse> => {
    const defaultParams = {
      page: 1,
      limit: 10,
      sortBy: 'createdAt',
      sortOrder: 'DESC' as const,
      offset: undefined,
      ...params,
    };
    const url = buildUrl('/inventory_movements', defaultParams);
    return apiClient.get(url);
  },

  // Obtener movimiento por ID (GET /api/inventory_movements/{id})
  getById: (id: string): Promise<InventoryMovement> => {
    return apiClient.get(`/inventory_movements/${id}`);
  },

  // Buscar movimientos de inventario (POST /api/inventory_movements/search)
  search: (searchParams: InventoryMovementSearchParams): Promise<InventoryMovementListResponse> => {
    return apiClient.post('/inventory_movements/search', searchParams);
  },

  // Exportar movimientos a CSV (POST /api/inventory_movements/export/csv)
  exportToCsv: (exportParams?: InventoryMovementSearchParams): Promise<string> => {
    return apiClient.post('/inventory_movements/export/csv', exportParams || {});
  },
};