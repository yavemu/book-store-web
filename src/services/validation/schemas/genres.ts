import { z } from 'zod';

export const createGenreSchema = z.object({
  name: z
    .string()
    .min(1, 'El nombre del género es requerido')
    .max(50, 'El nombre no puede exceder 50 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s&.-]+$/, 'El nombre contiene caracteres no válidos'),
  description: z
    .string()
    .optional()
    .or(z.literal('')),
});

export const updateGenreSchema = z.object({
  name: z
    .string()
    .optional()
    .refine((val) => !val || (val.length >= 1 && val.length <= 100), 'El nombre debe tener entre 1 y 100 caracteres')
    .refine((val) => !val || /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(val), 'El nombre solo puede contener letras y espacios'),
  description: z
    .string()
    .optional()
    .refine((val) => !val || val.length <= 500, 'La descripción no puede exceder 500 caracteres'),
});

export const genreSearchSchema = z.object({
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

export const genreAdvancedSearchSchema = z.object({
  page: z.number().min(1).default(1).optional(),
  limit: z.number().min(1).max(100).default(10).optional(),
  name: z.string().optional(),
  description: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

export type CreateGenreFormData = z.infer<typeof createGenreSchema>;
export type UpdateGenreFormData = z.infer<typeof updateGenreSchema>;
export type GenreSearchFormData = z.infer<typeof genreSearchSchema>;
export type GenreAdvancedSearchParams = z.infer<typeof genreAdvancedSearchSchema>;