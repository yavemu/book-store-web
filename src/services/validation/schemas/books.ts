import { z } from 'zod';

export const createBookSchema = z.object({
  title: z
    .string()
    .min(1, 'El título es requerido')
    .max(255, 'El título no puede exceder 255 caracteres'),
  isbnCode: z
    .string()
    .min(1, 'El código ISBN es requerido')
    .max(13, 'El código ISBN no puede exceder 13 caracteres')
    .regex(/^[0-9-X]+$/, 'El ISBN debe contener solo números, guiones y X'),
  price: z
    .number()
    .min(0, 'El precio no puede ser negativo')
    .max(99999999.99, 'El precio es demasiado alto'),
  isAvailable: z
    .boolean()
    .default(true),
  stockQuantity: z
    .number()
    .int('La cantidad de stock debe ser un número entero')
    .min(0, 'El stock no puede ser negativo')
    .default(0),
  coverImageUrl: z
    .string()
    .max(500, 'La URL de portada no puede exceder 500 caracteres')
    .refine((val) => !val || val === '' || z.string().url().safeParse(val).success, 'El formato de la URL de portada no es válido')
    .optional()
    .nullable(),
  publicationDate: z
    .string()
    .refine((val) => !val || val === '' || !isNaN(Date.parse(val)), 'La fecha de publicación no es válida')
    .optional()
    .nullable(),
  pageCount: z
    .number()
    .int('El número de páginas debe ser un número entero')
    .min(1, 'El número de páginas debe ser mayor a 0')
    .optional()
    .nullable(),
  summary: z
    .string()
    .optional()
    .nullable(),
  genreId: z
    .string()
    .min(1, 'Debe seleccionar un género')
    .uuid('El ID del género debe ser un UUID válido'),
  publisherId: z
    .string()
    .min(1, 'Debe seleccionar una editorial')
    .uuid('El ID de la editorial debe ser un UUID válido'),
});

export const updateBookSchema = z.object({
  title: z
    .string()
    .min(1, 'El título es requerido')
    .max(255, 'El título no puede exceder 255 caracteres')
    .optional(),
  isbnCode: z
    .string()
    .min(10, 'El ISBN debe tener al menos 10 caracteres')
    .max(13, 'El ISBN no puede exceder 13 caracteres')
    .regex(/^[0-9]{9,13}$/, 'El ISBN debe contener solo números y tener entre 9 y 13 dígitos')
    .optional(),
  price: z
    .number()
    .min(0, 'El precio no puede ser negativo')
    .optional(),
  isAvailable: z
    .boolean()
    .optional(),
  stockQuantity: z
    .number()
    .min(0, 'El stock no puede ser negativo')
    .optional(),
  coverImageUrl: z
    .string()
    .url('El formato de la URL de portada no es válido')
    .optional(),
  publicationDate: z
    .string()
    .refine((val) => !val || !isNaN(Date.parse(val)), 'La fecha de publicación no es válida')
    .optional(),
  pageCount: z
    .number()
    .min(1, 'El número de páginas debe ser mayor a 0')
    .optional(),
  summary: z
    .string()
    .optional(),
  genreId: z
    .string()
    .uuid('El ID del género debe ser un UUID válido')
    .optional(),
  publisherId: z
    .string()
    .uuid('El ID de la editorial debe ser un UUID válido')
    .optional(),
});

export const bookSearchSchema = z.object({
  term: z
    .string()
    .min(1, 'El término de búsqueda es requerido')
    .max(200, 'El término de búsqueda no puede exceder 200 caracteres'),
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
    .default('title'),
  sortOrder: z
    .enum(['ASC', 'DESC'])
    .optional()
    .default('ASC'),
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
  minPrice: z
    .number()
    .min(0, 'El precio mínimo no puede ser negativo')
    .optional(),
  maxPrice: z
    .number()
    .min(0, 'El precio máximo no puede ser negativo')
    .optional(),
  isAvailable: z
    .boolean()
    .optional(),
  publicationDateAfter: z
    .string()
    .refine((val) => !val || !isNaN(Date.parse(val)), 'La fecha no es válida')
    .optional(),
  publicationDateBefore: z
    .string()
    .refine((val) => !val || !isNaN(Date.parse(val)), 'La fecha no es válida')
    .optional(),
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
    .default('title'),
  sortOrder: z
    .enum(['ASC', 'DESC'])
    .optional()
    .default('ASC'),
})
.refine((data) => !data.minPrice || !data.maxPrice || data.minPrice <= data.maxPrice, 'El precio mínimo no puede ser mayor al máximo')
.refine((data) => !data.publicationDateAfter || !data.publicationDateBefore || new Date(data.publicationDateAfter) <= new Date(data.publicationDateBefore), 'La fecha inicial no puede ser posterior a la final');

export type CreateBookFormData = z.infer<typeof createBookSchema>;
export type UpdateBookFormData = z.infer<typeof updateBookSchema>;
export type BookSearchFormData = z.infer<typeof bookSearchSchema>;
export type BookFilterFormData = z.infer<typeof bookFilterSchema>;