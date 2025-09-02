import { z } from 'zod';

// Schema para movimientos de inventario basado en la API
export const inventoryMovementSchema = z.object({
  id: z.string().uuid().optional(),
  movementType: z.enum(['PURCHASE', 'SALE', 'DISCOUNT', 'INCREASE', 'OUT_OF_STOCK', 'ARCHIVED']),
  status: z.enum(['PENDING', 'COMPLETED', 'ERROR']),
  entityType: z.string().describe('Tipo de entidad afectada'),
  entityId: z.string().uuid().describe('ID de la entidad afectada'),
  userId: z.string().uuid().describe('ID del usuario que realizó el movimiento'),
  userRole: z.string().describe('Rol del usuario'),
  priceBefore: z.number().min(0).describe('Precio antes del movimiento'),
  priceAfter: z.number().min(0).describe('Precio después del movimiento'),
  quantityBefore: z.number().min(0).describe('Cantidad antes del movimiento'),
  quantityAfter: z.number().min(0).describe('Cantidad después del movimiento'),
  notes: z.string().optional().describe('Notas del movimiento'),
  isActive: z.boolean().describe('Si el movimiento está activo'),
  createdAt: z.string().describe('Fecha de creación del movimiento'),
});

// Schema para crear movimiento de inventario
export const createInventoryMovementSchema = z.object({
  movementType: z.enum(['PURCHASE', 'SALE', 'DISCOUNT', 'INCREASE', 'OUT_OF_STOCK', 'ARCHIVED']),
  entityType: z.string().min(1, 'El tipo de entidad es requerido'),
  entityId: z.string().uuid('ID de entidad inválido'),
  priceBefore: z.number().min(0, 'El precio antes debe ser mayor o igual a 0'),
  priceAfter: z.number().min(0, 'El precio después debe ser mayor o igual a 0'),
  quantityBefore: z.number().min(0, 'La cantidad antes debe ser mayor o igual a 0'),
  quantityAfter: z.number().min(0, 'La cantidad después debe ser mayor o igual a 0'),
  notes: z.string().optional(),
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
  movementType: z.enum(['PURCHASE', 'SALE', 'DISCOUNT', 'INCREASE', 'OUT_OF_STOCK', 'ARCHIVED']).optional(),
  status: z.enum(['PENDING', 'COMPLETED', 'ERROR']).optional(),
  entityType: z.string().optional(),
  entityId: z.string().uuid('ID de entidad inválido').optional(),
  userId: z.string().uuid('ID de usuario inválido').optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

// Schema para filtros avanzados de inventario
export const inventoryMovementAdvancedFilterSchema = z.object({
  movementType: z.enum(['PURCHASE', 'SALE', 'DISCOUNT', 'INCREASE', 'OUT_OF_STOCK', 'ARCHIVED']).optional(),
  status: z.enum(['PENDING', 'COMPLETED', 'ERROR']).optional(),
  entityType: z.string().optional(),
  userId: z.string().uuid('ID de usuario inválido').optional(),
  userRole: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),
  pagination: z.object({
    page: z.number().min(1),
    limit: z.number().min(1).max(100),
    sortBy: z.string().default('createdAt').optional(),
    sortOrder: z.enum(['ASC', 'DESC']).default('DESC').optional(),
  }).optional(),
});

// Schema para respuesta individual de movimiento
export const inventoryMovementResponseSchema = z.object({
  id: z.string().uuid(),
  movementType: z.enum(['PURCHASE', 'SALE', 'DISCOUNT', 'INCREASE', 'OUT_OF_STOCK', 'ARCHIVED']),
  status: z.enum(['PENDING', 'COMPLETED', 'ERROR']),
  entityType: z.string(),
  entityId: z.string().uuid(),
  userId: z.string().uuid(),
  userRole: z.string(),
  priceBefore: z.number(),
  priceAfter: z.number(),
  quantityBefore: z.number(),
  quantityAfter: z.number(),
  notes: z.string().optional(),
  isActive: z.boolean(),
  createdAt: z.string(),
});

// Schema para la respuesta paginada de movimientos
export const inventoryMovementListResponseSchema = z.object({
  data: z.array(inventoryMovementResponseSchema),
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
export type CreateInventoryMovementFormData = z.infer<typeof createInventoryMovementSchema>;
export type InventoryMovementListParams = z.infer<typeof inventoryMovementListParamsSchema>;
export type InventoryMovementSearchParams = z.infer<typeof inventoryMovementSearchSchema>;
export type InventoryMovementAdvancedFilterParams = z.infer<typeof inventoryMovementAdvancedFilterSchema>;
export type InventoryMovementResponse = z.infer<typeof inventoryMovementResponseSchema>;
export type InventoryMovementListResponse = z.infer<typeof inventoryMovementListResponseSchema>;