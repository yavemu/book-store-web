import { z } from 'zod';

export const createPublishingHouseSchema = z.object({
  name: z
    .string()
    .min(1, 'El nombre de la editorial es requerido')
    .max(100, 'El nombre no puede exceder 100 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s&.-]+$/, 'El nombre contiene caracteres no válidos'),
  country: z
    .string()
    .max(50, 'El país no puede exceder 50 caracteres')
    .optional()
    .or(z.literal('')),
  websiteUrl: z
    .string()
    .max(500, 'La URL del sitio web no puede exceder 500 caracteres')
    .url('El formato de la URL no es válido')
    .optional()
    .or(z.literal('')),
});

export const updatePublishingHouseSchema = z.object({
  name: z
    .string()
    .optional()
    .refine((val) => !val || (val.length >= 1 && val.length <= 100), 'El nombre debe tener entre 1 y 100 caracteres')
    .refine((val) => !val || /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s&.-]+$/.test(val), 'El nombre contiene caracteres no válidos'),
  country: z
    .string()
    .optional()
    .refine((val) => !val || (val.length >= 1 && val.length <= 50), 'El país debe tener entre 1 y 50 caracteres')
    .refine((val) => !val || /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(val), 'El país solo puede contener letras y espacios'),
  websiteUrl: z
    .string()
    .optional()
    .refine((val) => !val || z.string().url().safeParse(val).success, 'El formato de la URL no es válido'),
});

export const publishingHouseSearchSchema = z.object({
  term: z
    .string()
    .min(1, 'El término de búsqueda es requerido')
    .max(100, 'El término de búsqueda no puede exceder 100 caracteres'),
  page: z
    .number()
    .min(1, 'La página debe ser mayor a 0')
    .optional()
    .default(1),
  limit: z
    .number()
    .min(1, 'El límite debe ser mayor a 0')
    .max(100, 'El límite no puede exceder 100')
    .optional()
    .default(10),
  sortBy: z
    .string()
    .optional()
    .default('name'),
  sortOrder: z
    .enum(['ASC', 'DESC'])
    .optional()
    .default('ASC'),
});

// Schema para filtros de casas editoriales
export const publishingHouseFiltersSchema = z.object({
  name: z.string().optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  established: z.number().optional(),
  isActive: z.boolean().optional(),
  pagination: z.object({
    page: z.number().min(1),
    limit: z.number().min(1).max(100),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['ASC', 'DESC']).optional(),
  }).optional(),
});

// Schema para exportar casas editoriales a CSV
export const publishingHouseExportSchema = z.object({
  name: z.string().optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  startDate: z.string().datetime('Fecha de inicio inválida').optional(),
  endDate: z.string().datetime('Fecha de fin inválida').optional(),
});

export type CreatePublishingHouseFormData = z.infer<typeof createPublishingHouseSchema>;
export type UpdatePublishingHouseFormData = z.infer<typeof updatePublishingHouseSchema>;
export type PublishingHouseSearchFormData = z.infer<typeof publishingHouseSearchSchema>;
export type PublishingHouseFiltersFormData = z.infer<typeof publishingHouseFiltersSchema>;
export type PublishingHouseExportFormData = z.infer<typeof publishingHouseExportSchema>;