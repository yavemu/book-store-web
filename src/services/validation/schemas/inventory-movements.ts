import { z } from 'zod';

// Schema para movimientos de inventario
export const inventoryMovementSchema = z.object({
  id: z.string().uuid(),
  bookId: z.string().uuid(),
  movementType: z.enum(['IN', 'OUT']),
  quantity: z.number().positive(),
  notes: z.string().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime().optional(),
});

// Schema para listado de movimientos de inventario
export const inventoryMovementListParamsSchema = z.object({
  page: z.number().min(1).default(1).optional(),
  limit: z.number().min(1).max(100).default(10).optional(),
  sortBy: z.string().default('createdAt').optional(),
  sortOrder: z.enum(['ASC', 'DESC']).default('DESC').optional(),
  offset: z.number().optional(),
});

// Schema para búsqueda de movimientos de inventario
export const inventoryMovementSearchSchema = z.object({
  term: z.string().optional(),
  movementType: z.enum(['IN', 'OUT']).optional(),
  bookId: z.string().uuid('ID de libro inválido').optional(),
  startDate: z.string().datetime('Fecha de inicio inválida').optional(),
  endDate: z.string().datetime('Fecha de fin inválida').optional(),
});

// Schema para la respuesta paginada de movimientos
export const inventoryMovementListResponseSchema = z.object({
  data: z.array(inventoryMovementSchema),
  meta: z.object({
    total: z.number(),
    page: z.number(),
    limit: z.number(),
    totalPages: z.number(),
    hasNext: z.boolean(),
    hasPrev: z.boolean(),
  }),
});

export type InventoryMovement = z.infer<typeof inventoryMovementSchema>;
export type InventoryMovementListParams = z.infer<typeof inventoryMovementListParamsSchema>;
export type InventoryMovementSearchParams = z.infer<typeof inventoryMovementSearchSchema>;
export type InventoryMovementListResponse = z.infer<typeof inventoryMovementListResponseSchema>;