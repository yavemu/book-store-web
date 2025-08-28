import { BaseEntity, PaginationMeta } from './domain';

export type AuditAction = 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'REGISTER';

export interface AuditLog extends BaseEntity {
  action: AuditAction;
  entityType: string;
  entityId: string;
  userId?: string;
  userEmail?: string;
  details: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  timestamp: string;
}

export interface AuditLogResponseDto {
  success: boolean;
  message: string;
  data: AuditLog;
}

export interface AuditLogListResponseDto {
  success: boolean;
  message: string;
  data: AuditLog[];
  meta: PaginationMeta;
}

export interface AuditListParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface AuditSearchParams extends AuditListParams {
  term: string;
}

export interface AuditFiltersDto {
  action?: AuditAction;
  entityType?: string;
  userId?: string;
  userEmail?: string;
  dateFrom?: string;
  dateTo?: string;
}