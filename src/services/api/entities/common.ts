// Common interfaces and types used across all entities

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface BaseListParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface BaseResponse<T> {
  data: T[];
  meta: PaginationMeta;
  message?: string;
}

export interface ApiError {
  message: string;
  error: string;
  statusCode: number;
}

// Status types used across different entities
export type EntityStatus = 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'SUSPENDED';

export type MovementType = 'IN' | 'OUT' | 'TRANSFER';
export type MovementStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED';

export type OrderType = 'SALE' | 'RETURN' | 'EXCHANGE';
export type OrderStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED';

// Date range filtering interface
export interface DateRangeFilter {
  startDate?: string;
  endDate?: string;
}