import { BaseEntity, BaseListParams, BaseResponse, MovementType, MovementStatus, DateRangeFilter } from './common';

export interface InventoryMovement extends BaseEntity {
  type: MovementType;
  status: MovementStatus;
  quantity?: number;
  bookId?: string;
  warehouseId?: string;
  notes?: string;
}

export interface InventoryMovementListParams extends BaseListParams, DateRangeFilter {
  type?: MovementType;
  status?: MovementStatus;
  bookId?: string;
  warehouseId?: string;
}

export interface InventoryMovementsResponse extends BaseResponse<InventoryMovement> {
  summary?: {
    totalIn: number;
    totalOut: number;
    totalTransfers: number;
    pendingMovements: number;
  };
}

// Search specific interfaces
export interface InventoryMovementSearchParams {
  q: string;
  type?: MovementType;
  status?: MovementStatus;
  page?: number;
  limit?: number;
}

export interface InventoryMovementAdvancedFilter extends DateRangeFilter {
  id?: string;
  type?: MovementType;
  status?: MovementStatus;
  bookId?: string;
  warehouseId?: string;
  minQuantity?: number;
  maxQuantity?: number;
}