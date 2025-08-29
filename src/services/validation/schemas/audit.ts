import { z } from 'zod';

export const auditActionSchema = z.enum([
  'CREATE',
  'UPDATE', 
  'DELETE',
  'LOGIN',
  'REGISTER'
]);

export const auditLogSchema = z.object({
  id: z.string(),
  performedBy: z.string().describe('ID del usuario que realizó la acción'),
  entityId: z.string().describe('ID de la entidad afectada por la acción'),
  action: auditActionSchema,
  details: z.string().describe('Descripción detallada de la acción realizada'),
  entityType: z.string().describe('Tipo de entidad afectada'),
  createdAt: z.string().datetime().describe('Fecha y hora cuando se registró la auditoría'),
});

export const auditPaginationMetaSchema = z.object({
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
  hasNext: z.boolean(),
  hasPrev: z.boolean(),
});

export const auditLogListResponseSchema = z.object({
  data: z.array(auditLogSchema),
  meta: auditPaginationMetaSchema,
});

export const auditListParamsSchema = z.object({
  page: z.number().min(1).default(1).optional(),
  limit: z.number().min(1).max(100).default(10).optional(),
  sortBy: z.string().default('createdAt').optional(),
  sortOrder: z.enum(['ASC', 'DESC']).default('DESC').optional(),
  offset: z.number().min(0).optional(),
});

export const auditSearchParamsSchema = auditListParamsSchema.extend({
  term: z.string().min(1, 'El término de búsqueda es requerido'),
});

export type AuditAction = z.infer<typeof auditActionSchema>;
export type AuditLog = z.infer<typeof auditLogSchema>;
export type AuditLogListResponse = z.infer<typeof auditLogListResponseSchema>;
export type AuditListParams = z.infer<typeof auditListParamsSchema>;
export type AuditSearchParams = z.infer<typeof auditSearchParamsSchema>;