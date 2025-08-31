import { z } from 'zod';

export const createBookSchema = z.object({
  title: z
    .string()
    .min(1, 'El título es requerido')
    .max(255, 'El título no puede exceder 255 caracteres'),
  isbn: z
    .string()
    .min(1, 'El ISBN es requerido')
    .regex(/^(?:\d{9}[\dX]|\d{13})$/, 'El ISBN debe tener formato válido (10 o 13 dígitos)'),
  summary: z
    .string()
    .max(1000, 'El resumen no puede exceder 1000 caracteres')
    .optional(),
  price: z
    .number()
    .min(0, 'El precio debe ser mayor o igual a 0')
    .max(999999.99, 'El precio no puede exceder 999,999.99'),
  stock: z
    .number()
    .int('El stock debe ser un número entero')
    .min(0, 'El stock debe ser mayor o igual a 0'),
  isAvailable: z
    .boolean()
    .default(true),
  publishedDate: z
    .string()
    .datetime('La fecha debe tener formato válido')
    .optional(),
  pages: z
    .number()
    .int('El número de páginas debe ser un entero')
    .min(1, 'El libro debe tener al menos 1 página')
    .optional(),
  language: z
    .string()
    .max(50, 'El idioma no puede exceder 50 caracteres')
    .optional(),
  genreId: z
    .string()
    .uuid('El ID del género debe ser un UUID válido'),
  publisherId: z
    .string()
    .uuid('El ID de la editorial debe ser un UUID válido'),
  authorIds: z
    .array(z.string().uuid('Cada ID de autor debe ser un UUID válido'))
    .min(1, 'Debe seleccionar al menos un autor')
});

export const updateBookSchema = createBookSchema.partial();

export const bookSearchSchema = z.object({
  term: z
    .string()
    .min(1, 'El término de búsqueda es requerido')
    .max(100, 'El término de búsqueda no puede exceder 100 caracteres'),
  page: z.number().min(1).default(1).optional(),
  limit: z.number().min(1).max(100).default(10).optional(),
  sortBy: z.string().default('createdAt').optional(),
  sortOrder: z.enum(['ASC', 'DESC']).default('DESC').optional(),
  offset: z.number().optional(),
});

// Schema para filtro rápido de libros
export const bookQuickFilterSchema = z.object({
  filter: z
    .string()
    .min(1, 'El filtro es requerido')
    .max(100, 'El filtro no puede exceder 100 caracteres'),
  page: z.number().min(1).default(1).optional(),
  limit: z.number().min(1).max(100).default(10).optional(),
  sortBy: z.string().default('createdAt').optional(),
  sortOrder: z.enum(['ASC', 'DESC']).default('DESC').optional(),
  offset: z.number().optional(),
});

// Schema para verificación de ISBN
export const isbnCheckSchema = z.object({
  isbn: z
    .string()
    .min(1, 'El ISBN es requerido')
    .regex(/^(?:\d{9}[\dX]|\d{13})$/, 'El ISBN debe tener formato válido (10 o 13 dígitos)'),
});

// Schema para exportar libros a CSV
export const bookExportSchema = z.object({
  title: z.string().optional(),
  isbn: z.string().optional(),
  author: z.string().optional(),
  genre: z.string().optional(),
  publisher: z.string().optional(),
  startDate: z.string().datetime('Fecha de inicio inválida').optional(),
  endDate: z.string().datetime('Fecha de fin inválida').optional(),
});

// Schema para subir portada de libro
export const bookCoverUploadSchema = z.object({
  cover: z.any().refine(
    (file) => file instanceof File && file.type.startsWith('image/'),
    'Debe ser un archivo de imagen válido'
  ),
});

// Schema para filtros avanzados de libros
export const bookFilterSchema = z.object({
  title: z.string().optional(),
  isbn: z.string().optional(),
  author: z.string().optional(),
  genre: z.string().optional(),
  publisher: z.string().optional(),
  minPrice: z.number().min(0, 'El precio mínimo debe ser mayor o igual a 0').optional(),
  maxPrice: z.number().min(0, 'El precio máximo debe ser mayor o igual a 0').optional(),
  isAvailable: z.boolean().optional(),
  language: z.string().max(50, 'El idioma no puede exceder 50 caracteres').optional(),
  publishedAfter: z.string().datetime().optional(),
  publishedBefore: z.string().datetime().optional(),
  minPages: z.number().min(1).optional(),
  maxPages: z.number().min(1).optional(),
  pagination: z.object({
    page: z.number().min(1),
    limit: z.number().min(1).max(100),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['ASC', 'DESC']).optional(),
  }).optional(),
});

export const bookAdvancedSearchSchema = z.object({
  page: z.number().min(1).default(1).optional(),
  limit: z.number().min(1).max(100).default(10).optional(),
  title: z.string().optional(),
  isbn: z.string().optional(),
  price: z.number().min(0).optional(),
  stock: z.number().min(0).optional(),
  isAvailable: z.boolean().optional(),
  genre: z.string().optional(),
  publisher: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

export type CreateBookFormData = z.infer<typeof createBookSchema>;
export type UpdateBookFormData = z.infer<typeof updateBookSchema>;
export type BookSearchFormData = z.infer<typeof bookSearchSchema>;
export type BookQuickFilterFormData = z.infer<typeof bookQuickFilterSchema>;
export type BookFilterFormData = z.infer<typeof bookFilterSchema>;
export type IsbnCheckFormData = z.infer<typeof isbnCheckSchema>;
export type BookExportFormData = z.infer<typeof bookExportSchema>;
export type BookCoverUploadFormData = z.infer<typeof bookCoverUploadSchema>;
export type BookAdvancedSearchParams = z.infer<typeof bookAdvancedSearchSchema>;