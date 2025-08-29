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
  q: z
    .string()
    .min(1, 'El término de búsqueda es requerido')
    .max(100, 'El término de búsqueda no puede exceder 100 caracteres')
});

export const bookFilterSchema = z.object({
  genreId: z
    .string()
    .uuid('El ID del género debe ser un UUID válido')
    .optional(),
  publisherId: z
    .string()
    .uuid('El ID de la editorial debe ser un UUID válido')
    .optional(),
  authorId: z
    .string()
    .uuid('El ID del autor debe ser un UUID válido')
    .optional(),
  minPrice: z
    .number()
    .min(0, 'El precio mínimo debe ser mayor o igual a 0')
    .optional(),
  maxPrice: z
    .number()
    .min(0, 'El precio máximo debe ser mayor o igual a 0')
    .optional(),
  isAvailable: z
    .boolean()
    .optional(),
  language: z
    .string()
    .max(50, 'El idioma no puede exceder 50 caracteres')
    .optional()
});

export type CreateBookFormData = z.infer<typeof createBookSchema>;
export type UpdateBookFormData = z.infer<typeof updateBookSchema>;
export type BookSearchFormData = z.infer<typeof bookSearchSchema>;
export type BookFilterFormData = z.infer<typeof bookFilterSchema>;