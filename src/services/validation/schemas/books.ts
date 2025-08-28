import { z } from 'zod';

export const createBookSchema = z.object({
  title: z
    .string()
    .min(1, 'El título es requerido')
    .max(200, 'El título no puede exceder 200 caracteres'),
  subtitle: z
    .string()
    .optional()
    .refine((val) => !val || val.length <= 200, 'El subtítulo no puede exceder 200 caracteres'),
  isbn: z
    .string()
    .min(1, 'El ISBN es requerido')
    .regex(/^(?:ISBN(?:-1[03])?:? )?(?=[0-9X]{10}$|(?=(?:[0-9]+[- ]){3})[- 0-9X]{13}$|97[89][0-9]{10}$|(?=(?:[0-9]+[- ]){4})[- 0-9]{17}$)(?:97[89][- ]?)?[0-9]{1,5}[- ]?[0-9]+[- ]?[0-9]+[- ]?[0-9X]$/, 'El formato del ISBN no es válido'),
  description: z
    .string()
    .optional()
    .refine((val) => !val || val.length <= 2000, 'La descripción no puede exceder 2000 caracteres'),
  language: z
    .string()
    .min(1, 'El idioma es requerido')
    .max(50, 'El idioma no puede exceder 50 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El idioma solo puede contener letras y espacios'),
  publishedDate: z
    .string()
    .min(1, 'La fecha de publicación es requerida')
    .refine((val) => !isNaN(Date.parse(val)), 'La fecha de publicación no es válida')
    .refine((val) => new Date(val) <= new Date(), 'La fecha de publicación no puede ser futura'),
  pages: z
    .number()
    .min(1, 'El número de páginas debe ser mayor a 0')
    .max(10000, 'El número de páginas no puede exceder 10000'),
  price: z
    .number()
    .min(0, 'El precio no puede ser negativo')
    .max(999999.99, 'El precio no puede exceder 999999.99'),
  stock: z
    .number()
    .min(0, 'El stock no puede ser negativo')
    .max(999999, 'El stock no puede exceder 999999'),
  format: z
    .enum(['paperback', 'hardcover', 'ebook', 'audiobook'])
    .default('paperback'),
  coverImageUrl: z
    .string()
    .optional()
    .refine((val) => !val || z.string().url().safeParse(val).success, 'El formato de la URL de portada no es válido'),
  publishingHouseId: z
    .string()
    .min(1, 'La editorial es requerida')
    .uuid('El ID de la editorial debe ser un UUID válido'),
  genreId: z
    .string()
    .min(1, 'El género es requerido')
    .uuid('El ID del género debe ser un UUID válido'),
  isAvailable: z
    .boolean()
    .optional()
    .default(true),
  isActive: z
    .boolean()
    .optional()
    .default(true),
  metadata: z
    .record(z.any())
    .optional(),
});

export const updateBookSchema = z.object({
  title: z
    .string()
    .optional()
    .refine((val) => !val || (val.length >= 1 && val.length <= 200), 'El título debe tener entre 1 y 200 caracteres'),
  subtitle: z
    .string()
    .optional()
    .refine((val) => !val || val.length <= 200, 'El subtítulo no puede exceder 200 caracteres'),
  isbn: z
    .string()
    .optional()
    .refine((val) => !val || /^(?:ISBN(?:-1[03])?:? )?(?=[0-9X]{10}$|(?=(?:[0-9]+[- ]){3})[- 0-9X]{13}$|97[89][0-9]{10}$|(?=(?:[0-9]+[- ]){4})[- 0-9]{17}$)(?:97[89][- ]?)?[0-9]{1,5}[- ]?[0-9]+[- ]?[0-9]+[- ]?[0-9X]$/.test(val), 'El formato del ISBN no es válido'),
  description: z
    .string()
    .optional()
    .refine((val) => !val || val.length <= 2000, 'La descripción no puede exceder 2000 caracteres'),
  language: z
    .string()
    .optional()
    .refine((val) => !val || (val.length >= 1 && val.length <= 50), 'El idioma debe tener entre 1 y 50 caracteres')
    .refine((val) => !val || /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(val), 'El idioma solo puede contener letras y espacios'),
  publishedDate: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), 'La fecha de publicación no es válida')
    .refine((val) => !val || new Date(val) <= new Date(), 'La fecha de publicación no puede ser futura'),
  pages: z
    .number()
    .optional()
    .refine((val) => !val || (val >= 1 && val <= 10000), 'El número de páginas debe estar entre 1 y 10000'),
  price: z
    .number()
    .optional()
    .refine((val) => !val || (val >= 0 && val <= 999999.99), 'El precio debe estar entre 0 y 999999.99'),
  stock: z
    .number()
    .optional()
    .refine((val) => !val || (val >= 0 && val <= 999999), 'El stock debe estar entre 0 y 999999'),
  format: z
    .enum(['paperback', 'hardcover', 'ebook', 'audiobook'])
    .optional(),
  coverImageUrl: z
    .string()
    .optional()
    .refine((val) => !val || z.string().url().safeParse(val).success, 'El formato de la URL de portada no es válido'),
  publishingHouseId: z
    .string()
    .optional()
    .refine((val) => !val || z.string().uuid().safeParse(val).success, 'El ID de la editorial debe ser un UUID válido'),
  genreId: z
    .string()
    .optional()
    .refine((val) => !val || z.string().uuid().safeParse(val).success, 'El ID del género debe ser un UUID válido'),
  isAvailable: z
    .boolean()
    .optional(),
  isActive: z
    .boolean()
    .optional(),
  metadata: z
    .record(z.any())
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
  publishingHouseId: z
    .string()
    .uuid('El ID de la editorial debe ser un UUID válido')
    .optional(),
  authorId: z
    .string()
    .uuid('El ID del autor debe ser un UUID válido')
    .optional(),
  language: z
    .string()
    .max(50, 'El idioma no puede exceder 50 caracteres')
    .optional(),
  format: z
    .enum(['paperback', 'hardcover', 'ebook', 'audiobook'])
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
  publishedAfter: z
    .string()
    .refine((val) => !val || !isNaN(Date.parse(val)), 'La fecha no es válida')
    .optional(),
  publishedBefore: z
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
.refine((data) => !data.publishedAfter || !data.publishedBefore || new Date(data.publishedAfter) <= new Date(data.publishedBefore), 'La fecha inicial no puede ser posterior a la final');

export type CreateBookFormData = z.infer<typeof createBookSchema>;
export type UpdateBookFormData = z.infer<typeof updateBookSchema>;
export type BookSearchFormData = z.infer<typeof bookSearchSchema>;
export type BookFilterFormData = z.infer<typeof bookFilterSchema>;