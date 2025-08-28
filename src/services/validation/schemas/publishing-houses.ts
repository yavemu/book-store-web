import { z } from 'zod';

export const createPublishingHouseSchema = z.object({
  name: z
    .string()
    .min(1, 'El nombre de la editorial es requerido')
    .max(100, 'El nombre no puede exceder 100 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s&.-]+$/, 'El nombre contiene caracteres no válidos'),
  description: z
    .string()
    .optional()
    .refine((val) => !val || val.length <= 1000, 'La descripción no puede exceder 1000 caracteres'),
  country: z
    .string()
    .min(1, 'El país es requerido')
    .max(50, 'El país no puede exceder 50 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El país solo puede contener letras y espacios'),
  foundedYear: z
    .number()
    .min(1400, 'El año de fundación debe ser posterior a 1400')
    .max(new Date().getFullYear(), 'El año de fundación no puede ser futuro')
    .optional(),
  website: z
    .string()
    .optional()
    .refine((val) => !val || z.string().url().safeParse(val).success, 'El formato de la URL no es válido'),
  email: z
    .string()
    .optional()
    .refine((val) => !val || z.string().email().safeParse(val).success, 'El formato del email no es válido')
    .refine((val) => !val || val.length <= 100, 'El email no puede exceder 100 caracteres'),
  phone: z
    .string()
    .optional()
    .refine((val) => !val || /^\+?[\d\s-()]+$/.test(val), 'El formato del teléfono no es válido'),
  address: z
    .string()
    .optional()
    .refine((val) => !val || val.length <= 255, 'La dirección no puede exceder 255 caracteres'),
  logoUrl: z
    .string()
    .optional()
    .refine((val) => !val || z.string().url().safeParse(val).success, 'El formato de la URL del logo no es válido'),
  isActive: z
    .boolean()
    .optional()
    .default(true),
});

export const updatePublishingHouseSchema = z.object({
  name: z
    .string()
    .optional()
    .refine((val) => !val || (val.length >= 1 && val.length <= 100), 'El nombre debe tener entre 1 y 100 caracteres')
    .refine((val) => !val || /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s&.-]+$/.test(val), 'El nombre contiene caracteres no válidos'),
  description: z
    .string()
    .optional()
    .refine((val) => !val || val.length <= 1000, 'La descripción no puede exceder 1000 caracteres'),
  country: z
    .string()
    .optional()
    .refine((val) => !val || (val.length >= 1 && val.length <= 50), 'El país debe tener entre 1 y 50 caracteres')
    .refine((val) => !val || /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(val), 'El país solo puede contener letras y espacios'),
  foundedYear: z
    .number()
    .optional()
    .refine((val) => !val || (val >= 1400 && val <= new Date().getFullYear()), 'Año de fundación no válido'),
  website: z
    .string()
    .optional()
    .refine((val) => !val || z.string().url().safeParse(val).success, 'El formato de la URL no es válido'),
  email: z
    .string()
    .optional()
    .refine((val) => !val || z.string().email().safeParse(val).success, 'El formato del email no es válido')
    .refine((val) => !val || val.length <= 100, 'El email no puede exceder 100 caracteres'),
  phone: z
    .string()
    .optional()
    .refine((val) => !val || /^\+?[\d\s-()]+$/.test(val), 'El formato del teléfono no es válido'),
  address: z
    .string()
    .optional()
    .refine((val) => !val || val.length <= 255, 'La dirección no puede exceder 255 caracteres'),
  logoUrl: z
    .string()
    .optional()
    .refine((val) => !val || z.string().url().safeParse(val).success, 'El formato de la URL del logo no es válido'),
  isActive: z
    .boolean()
    .optional(),
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

export type CreatePublishingHouseFormData = z.infer<typeof createPublishingHouseSchema>;
export type UpdatePublishingHouseFormData = z.infer<typeof updatePublishingHouseSchema>;
export type PublishingHouseSearchFormData = z.infer<typeof publishingHouseSearchSchema>;