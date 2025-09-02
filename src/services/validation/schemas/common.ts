import { z } from 'zod';

// Common pagination metadata schema
export const paginationMetaSchema = z.object({
  total: z.number().describe('Total number of records'),
  page: z.number().describe('Current page number'),
  limit: z.number().describe('Records per page'),
  totalPages: z.number().describe('Total number of pages'),
  hasNext: z.boolean().describe('Whether there is a next page'),
  hasPrev: z.boolean().describe('Whether there is a previous page'),
});

// Common API response wrapper
export const apiResponseSchema = z.object({
  statusCode: z.number().optional().describe('HTTP status code'),
  message: z.string().optional().describe('Response message'),
  data: z.any().describe('Response data payload'),
});

// Common list parameters for all entities
export const commonListParamsSchema = z.object({
  page: z.number().min(1).default(1).optional(),
  limit: z.number().min(1).max(100).default(10).optional(),
  sortBy: z.string().default('createdAt').optional(),
  sortOrder: z.enum(['ASC', 'DESC']).default('DESC').optional(),
  offset: z.number().min(0).optional(),
});

// Common search parameters
export const commonSearchParamsSchema = commonListParamsSchema.extend({
  term: z.string().min(1, 'El término de búsqueda es requerido'),
});

// Common filter parameters for simple filtering
export const commonFilterParamsSchema = z.object({
  filter: z
    .string()
    .min(3, 'El filtro debe tener al menos 3 caracteres')
    .max(100, 'El filtro no puede exceder 100 caracteres'),
  page: z.number().min(1).default(1).optional(),
  limit: z.number().min(1).max(50).default(20).optional(),
});

// Common date range filter
export const dateRangeFilterSchema = z.object({
  startDate: z.string().optional().describe('Fecha de inicio para el filtro'),
  endDate: z.string().optional().describe('Fecha de fin para el filtro'),
});

// Common export parameters
export const commonExportParamsSchema = dateRangeFilterSchema.extend({
  format: z.enum(['csv', 'excel', 'pdf']).default('csv').optional(),
});

// Error response schema
export const errorResponseSchema = z.object({
  statusCode: z.number(),
  message: z.union([z.string(), z.array(z.string())]),
  error: z.string().optional(),
  timestamp: z.string().optional(),
  path: z.string().optional(),
});

// Success response schema
export const successResponseSchema = z.object({
  success: z.boolean().default(true),
  message: z.string(),
  data: z.any(),
});

// Paginated response schema
export const paginatedResponseSchema = z.object({
  data: z.array(z.any()),
  meta: paginationMetaSchema,
});

export type PaginationMeta = z.infer<typeof paginationMetaSchema>;
export type ApiResponse = z.infer<typeof apiResponseSchema>;
export type CommonListParams = z.infer<typeof commonListParamsSchema>;
export type CommonSearchParams = z.infer<typeof commonSearchParamsSchema>;
export type CommonFilterParams = z.infer<typeof commonFilterParamsSchema>;
export type DateRangeFilter = z.infer<typeof dateRangeFilterSchema>;
export type CommonExportParams = z.infer<typeof commonExportParamsSchema>;
export type ErrorResponse = z.infer<typeof errorResponseSchema>;
export type SuccessResponse = z.infer<typeof successResponseSchema>;
export type PaginatedResponse = z.infer<typeof paginatedResponseSchema>;