import { z } from 'zod';

export const createAuthorSchema = z.object({
  // CAMPOS OBLIGATORIOS según API
  firstName: z
    .string()
    .min(1, "El nombre es requerido")
    .max(50, "El nombre no puede exceder 50 caracteres")
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "El nombre solo puede contener letras y espacios"),
  lastName: z
    .string()
    .min(1, "Los apellidos son requeridos")
    .max(50, "Los apellidos no pueden exceder 50 caracteres")
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "Los apellidos solo pueden contener letras y espacios"),
  
  // CAMPOS OPCIONALES según API
  nationality: z
    .string()
    .max(50, "La nacionalidad no puede exceder 50 caracteres")
    .optional()
    .or(z.literal('')),
  birthDate: z
    .string()
    .refine((val) => !val || val === "" || /^\d{4}-\d{2}-\d{2}$/.test(val), "La fecha debe tener formato YYYY-MM-DD")
    .refine((val) => !val || val === "" || !isNaN(Date.parse(val)), "La fecha de nacimiento no es válida")
    .refine((val) => !val || val === "" || new Date(val) <= new Date(), "La fecha de nacimiento no puede ser futura")
    .optional()
    .or(z.literal('')),
  biography: z
    .string()
    .max(1000, "La biografía no puede exceder 1000 caracteres")
    .optional()
    .or(z.literal('')),
});

export const updateAuthorSchema = z.object({
  firstName: z
    .string()
    .optional()
    .refine((val) => !val || (val.length >= 1 && val.length <= 50), "El nombre debe tener entre 1 y 50 caracteres")
    .refine((val) => !val || /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(val), "El nombre solo puede contener letras y espacios"),
  lastName: z
    .string()
    .optional()
    .refine((val) => !val || (val.length >= 1 && val.length <= 50), "Los apellidos deben tener entre 1 y 50 caracteres")
    .refine((val) => !val || /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(val), "Los apellidos solo pueden contener letras y espacios"),
  biography: z
    .string()
    .optional()
    .refine((val) => !val || val.length <= 1000, "La biografía no puede exceder 1000 caracteres"),
  birthDate: z
    .string()
    .optional()
    .refine((val) => !val || val === "" || /^\d{4}-\d{2}-\d{2}$/.test(val), "La fecha debe tener formato YYYY-MM-DD")
    .refine((val) => !val || val === "" || !isNaN(Date.parse(val)), "La fecha de nacimiento no es válida")
    .refine((val) => !val || val === "" || new Date(val) <= new Date(), "La fecha de nacimiento no puede ser futura"),
  nationality: z
    .string()
    .optional()
    .refine((val) => !val || val.length <= 50, "La nacionalidad no puede exceder 50 caracteres")
    .refine((val) => !val || /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(val), "La nacionalidad solo puede contener letras y espacios"),
});

// Schema para búsqueda exacta POST /search - NO incluye 'term'
export const authorExactSearchSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  nationality: z.string().optional(),
  birthYear: z.number().optional(),
});

// Schema para filtro rápido GET /filter?term - SÍ incluye 'term'
export const authorQuickFilterSchema = z.object({
  term: z
    .string()
    .min(3, 'El término de búsqueda debe tener al menos 3 caracteres')
    .max(100, 'El término de búsqueda no puede exceder 100 caracteres'),
});

// Schema para filtros de autores
export const bookAuthorFiltersSchema = z.object({
  name: z.string().optional(),
  nationality: z.string().optional(),
  birthYear: z.number().optional(),
  isActive: z.boolean().optional(),
  pagination: z.object({
    page: z.number().min(1),
    limit: z.number().min(1).max(100),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['ASC', 'DESC']).optional(),
  }).optional(),
});

// Schema para exportar autores a CSV
export const bookAuthorExportSchema = z.object({
  name: z.string().optional(),
  nationality: z.string().optional(),
  startDate: z.string().datetime('Fecha de inicio inválida').optional(),
  endDate: z.string().datetime('Fecha de fin inválida').optional(),
});

// Schemas para asignaciones autor-libro
export const createBookAuthorAssignmentSchema = z.object({
  bookId: z.string().uuid('ID de libro inválido'),
  authorId: z.string().uuid('ID de autor inválido'),
  assignmentDate: z.string().datetime().optional(),
});

export const updateBookAuthorAssignmentSchema = z.object({
  bookId: z.string().uuid('ID de libro inválido').optional(),
  authorId: z.string().uuid('ID de autor inválido').optional(),
  assignmentDate: z.string().datetime().optional(),
});

// Schema para filtros de asignaciones
export const assignmentFiltersSchema = z.object({
  bookId: z.string().uuid('ID de libro inválido').optional(),
  authorId: z.string().uuid('ID de autor inválido').optional(),
  assignmentDate: z.string().optional(),
  pagination: z.object({
    page: z.number().min(1),
    limit: z.number().min(1).max(100),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['ASC', 'DESC']).optional(),
  }).optional(),
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
  authorRole: z
    .string()
    .optional()
    .refine((val) => !val || val.length <= 100, 'El rol no puede exceder 100 caracteres'),
});

// Schema para respuesta de autor
export const authorResponseSchema = z.object({
  id: z.string().uuid(),
  firstName: z.string(),
  lastName: z.string(),
  nationality: z.string().optional(),
  birthDate: z.string().optional(),
  biography: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const authorAdvancedSearchSchema = z.object({
  page: z.number().min(1).default(1).optional(),
  limit: z.number().min(1).max(100).default(10).optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  nationality: z.string().optional(),
  birthDate: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

export type CreateAuthorFormData = z.infer<typeof createAuthorSchema>;
export type UpdateAuthorFormData = z.infer<typeof updateAuthorSchema>;
export type AuthorExactSearchFormData = z.infer<typeof authorExactSearchSchema>;
export type AuthorQuickFilterFormData = z.infer<typeof authorQuickFilterSchema>;
export type BookAuthorFiltersFormData = z.infer<typeof bookAuthorFiltersSchema>;
export type BookAuthorExportFormData = z.infer<typeof bookAuthorExportSchema>;
export type CreateBookAuthorAssignmentFormData = z.infer<typeof createBookAuthorAssignmentSchema>;
export type UpdateBookAuthorAssignmentFormData = z.infer<typeof updateBookAuthorAssignmentSchema>;
export type AssignmentFiltersFormData = z.infer<typeof assignmentFiltersSchema>;
export type BookAuthorAssignmentFormData = z.infer<typeof bookAuthorAssignmentSchema>;
export type AuthorAdvancedSearchParams = z.infer<typeof authorAdvancedSearchSchema>;
export type AuthorResponse = z.infer<typeof authorResponseSchema>;