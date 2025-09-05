import { z } from 'zod';

export const auditActionSchema = z.enum([
  'CREATE',
  'UPDATE', 
  'DELETE',
  'READ',
  'LOGIN',
  'REGISTER'
]);

export const auditLogSchema = z.object({
  id: z.string().uuid().describe('ID único del log de auditoría'),
  performedBy: z.string().uuid().describe('ID del usuario que realizó la acción'),
  entityId: z.string().uuid().describe('ID de la entidad afectada por la acción'),
  action: auditActionSchema,
  details: z.string().describe('Descripción detallada de la acción realizada'),
  entityType: z.string().describe('Tipo de entidad afectada (User, Book, etc.)'),
  createdAt: z.string().describe('Fecha y hora cuando se registró la auditoría'),
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
});

export const auditSearchParamsSchema = auditListParamsSchema.extend({
  term: z.string().min(1, 'El término de búsqueda es requerido'),
});

// Schema para filtro rápido de auditoría
export const auditFilterSchema = z.object({
  filter: z
    .string()
    .min(3, 'El filtro debe tener al menos 3 caracteres')
    .max(100, 'El filtro no puede exceder 100 caracteres'),
  pagination: z.object({
    page: z.number().min(1).default(1),
    limit: z.number().min(1).max(50).default(10),
    sortBy: z.string().default('createdAt').optional(),
    sortOrder: z.enum(['ASC', 'DESC']).default('DESC').optional(),
  }),
});

// Schema para filtro avanzado de auditoría
export const auditAdvancedFilterSchema = z.object({
  userId: z.string().uuid('ID de usuario inválido').optional(),
  entityType: z.string().optional(),
  action: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  pagination: z.object({
    page: z.number().min(1),
    limit: z.number().min(1).max(100),
    sortBy: z.string().default('timestamp').optional(),
    sortOrder: z.enum(['ASC', 'DESC']).default('DESC').optional(),
  }).optional(),
});

// Schema para exportar auditoría a CSV
export const auditExportSchema = z.object({
  performedBy: z.string().optional(),
  entityId: z.string().uuid('ID de entidad inválido').optional(),
  entityType: z.string().optional(),
  action: z.enum(['CREATE', 'UPDATE', 'DELETE']).optional(),
  details: z.string().optional(),
  startDate: z.string().datetime('Fecha de inicio inválida').optional(),
  endDate: z.string().datetime('Fecha de fin inválida').optional(),
});

export const auditAdvancedSearchSchema = auditListParamsSchema.extend({
  action: z.string().optional(),
  entityType: z.string().optional(),
  userId: z.string().uuid().optional(),
  startDate: z.string().optional(), // Cambiar a date string simple
  endDate: z.string().optional(),   // Cambiar a date string simple
});

// Schema específico para búsqueda exacta de auditoría (POST /search)
export const auditExactSearchSchema = z.object({
  action: z.string().optional(),
  entityType: z.string().optional(),
  userId: z.string().uuid().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export type AuditAction = z.infer<typeof auditActionSchema>;
export type AuditLog = z.infer<typeof auditLogSchema>;
export type AuditLogListResponse = z.infer<typeof auditLogListResponseSchema>;
export type AuditListParams = z.infer<typeof auditListParamsSchema>;
export type AuditSearchParams = z.infer<typeof auditSearchParamsSchema>;
export type AuditFilterParams = z.infer<typeof auditFilterSchema>;
export type AuditAdvancedFilterParams = z.infer<typeof auditAdvancedFilterSchema>;
export type AuditExportParams = z.infer<typeof auditExportSchema>;
export type AuditAdvancedSearchParams = z.infer<typeof auditAdvancedSearchSchema>;
export type AuditExactSearchParams = z.infer<typeof auditExactSearchSchema>;