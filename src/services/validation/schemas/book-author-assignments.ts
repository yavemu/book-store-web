import { z } from 'zod';

export const createBookAuthorAssignmentSchema = z.object({
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
    .max(100, 'El rol del autor no puede exceder 100 caracteres')
    .optional(),
});

export const updateBookAuthorAssignmentSchema = z.object({
  bookId: z
    .string()
    .uuid('El ID del libro debe ser un UUID válido')
    .optional(),
  authorId: z
    .string()
    .uuid('El ID del autor debe ser un UUID válido')
    .optional(),
  authorRole: z
    .string()
    .max(100, 'El rol del autor no puede exceder 100 caracteres')
    .optional(),
});

export type CreateBookAuthorAssignmentFormData = z.infer<typeof createBookAuthorAssignmentSchema>;
export type UpdateBookAuthorAssignmentFormData = z.infer<typeof updateBookAuthorAssignmentSchema>;