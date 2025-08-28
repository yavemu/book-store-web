import { z } from 'zod';

export const createAuthorSchema = z.object({
  firstName: z
    .string()
    .min(1, 'El nombre es requerido')
    .max(50, 'El nombre no puede exceder 50 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El nombre solo puede contener letras y espacios'),
  lastName: z
    .string()
    .min(1, 'Los apellidos son requeridos')
    .max(50, 'Los apellidos no pueden exceder 50 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'Los apellidos solo pueden contener letras y espacios'),
  email: z
    .string()
    .optional()
    .refine((val) => !val || z.string().email().safeParse(val).success, 'El formato del email no es válido')
    .refine((val) => !val || val.length <= 100, 'El email no puede exceder 100 caracteres'),
  biography: z
    .string()
    .optional()
    .refine((val) => !val || val.length <= 1000, 'La biografía no puede exceder 1000 caracteres'),
  birthDate: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), 'La fecha de nacimiento no es válida')
    .refine((val) => !val || new Date(val) <= new Date(), 'La fecha de nacimiento no puede ser futura'),
  nationality: z
    .string()
    .optional()
    .refine((val) => !val || val.length <= 50, 'La nacionalidad no puede exceder 50 caracteres')
    .refine((val) => !val || /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(val), 'La nacionalidad solo puede contener letras y espacios'),
  website: z
    .string()
    .optional()
    .refine((val) => !val || z.string().url().safeParse(val).success, 'El formato de la URL no es válido'),
  socialMedia: z
    .record(z.string())
    .optional(),
  isActive: z
    .boolean()
    .optional()
    .default(true),
});

export const updateAuthorSchema = z.object({
  firstName: z
    .string()
    .optional()
    .refine((val) => !val || (val.length >= 1 && val.length <= 50), 'El nombre debe tener entre 1 y 50 caracteres')
    .refine((val) => !val || /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(val), 'El nombre solo puede contener letras y espacios'),
  lastName: z
    .string()
    .optional()
    .refine((val) => !val || (val.length >= 1 && val.length <= 50), 'Los apellidos deben tener entre 1 y 50 caracteres')
    .refine((val) => !val || /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(val), 'Los apellidos solo pueden contener letras y espacios'),
  email: z
    .string()
    .optional()
    .refine((val) => !val || z.string().email().safeParse(val).success, 'El formato del email no es válido')
    .refine((val) => !val || val.length <= 100, 'El email no puede exceder 100 caracteres'),
  biography: z
    .string()
    .optional()
    .refine((val) => !val || val.length <= 1000, 'La biografía no puede exceder 1000 caracteres'),
  birthDate: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), 'La fecha de nacimiento no es válida')
    .refine((val) => !val || new Date(val) <= new Date(), 'La fecha de nacimiento no puede ser futura'),
  nationality: z
    .string()
    .optional()
    .refine((val) => !val || val.length <= 50, 'La nacionalidad no puede exceder 50 caracteres')
    .refine((val) => !val || /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(val), 'La nacionalidad solo puede contener letras y espacios'),
  website: z
    .string()
    .optional()
    .refine((val) => !val || z.string().url().safeParse(val).success, 'El formato de la URL no es válido'),
  socialMedia: z
    .record(z.string())
    .optional(),
  isActive: z
    .boolean()
    .optional(),
});

export const authorSearchSchema = z.object({
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
    .default('lastName'),
  sortOrder: z
    .enum(['ASC', 'DESC'])
    .optional()
    .default('ASC'),
});

export const bookAuthorAssignmentSchema = z.object({
  bookId: z
    .string()
    .min(1, 'El ID del libro es requerido')
    .uuid('El ID del libro debe ser un UUID válido'),
  authorId: z
    .string()
    .min(1, 'El ID del autor es requerido')
    .uuid('El ID del autor debe ser un UUID válido'),
  role: z
    .string()
    .optional()
    .default('author')
    .refine((val) => ['author', 'co-author', 'editor', 'translator'].includes(val), 'Rol no válido'),
  order: z
    .number()
    .min(1, 'El orden debe ser mayor a 0')
    .optional()
    .default(1),
});

export type CreateAuthorFormData = z.infer<typeof createAuthorSchema>;
export type UpdateAuthorFormData = z.infer<typeof updateAuthorSchema>;
export type AuthorSearchFormData = z.infer<typeof authorSearchSchema>;
export type BookAuthorAssignmentFormData = z.infer<typeof bookAuthorAssignmentSchema>;