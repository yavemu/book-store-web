import { z } from 'zod';
import { paginationMetaSchema, successResponseSchema } from './common';

// User entity response schemas
export const userResponseSchema = z.object({
  id: z.string().uuid(),
  username: z.string(),
  email: z.string().email(),
  role: z.object({
    name: z.string(),
  }),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const userListResponseSchema = z.object({
  data: z.array(userResponseSchema),
  meta: paginationMetaSchema,
});

// Genre entity response schemas
export const genreResponseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const genreListResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object({
    data: z.array(genreResponseSchema),
    meta: paginationMetaSchema,
  }),
});

// Publisher entity response schemas
export const publisherResponseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  country: z.string().optional(),
  foundedYear: z.number().optional(),
  websiteUrl: z.string().optional(),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const publisherListResponseSchema = z.object({
  data: z.object({
    data: z.array(publisherResponseSchema),
    meta: paginationMetaSchema,
  }),
  message: z.string(),
});

// Author entity response schemas
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

export const authorListResponseSchema = z.object({
  data: z.array(authorResponseSchema),
  meta: paginationMetaSchema,
});

// Book entity response schemas
export const bookResponseSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  isbnCode: z.string(),
  price: z.number(),
  stockQuantity: z.number(),
  isAvailable: z.boolean(),
  publicationDate: z.string().optional(),
  pageCount: z.number().optional(),
  summary: z.string().optional(),
  coverImageUrl: z.string().optional(),
  genre: genreResponseSchema.optional(),
  publisher: publisherResponseSchema.optional(),
  authors: z.array(authorResponseSchema).optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const bookListResponseSchema = z.object({
  data: z.array(bookResponseSchema),
  meta: paginationMetaSchema,
});

// Audit log entity response schemas
export const auditLogResponseSchema = z.object({
  id: z.string().uuid(),
  performedBy: z.string().uuid(),
  entityId: z.string().uuid(),
  action: z.enum(['CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'REGISTER']),
  details: z.string(),
  entityType: z.string(),
  createdAt: z.string(),
});

export const auditLogListResponseSchema = z.object({
  data: z.array(auditLogResponseSchema),
  meta: paginationMetaSchema,
});

// Inventory movement entity response schemas
export const inventoryMovementResponseSchema = z.object({
  id: z.string().uuid(),
  movementType: z.enum(['PURCHASE', 'SALE', 'DISCOUNT', 'INCREASE', 'OUT_OF_STOCK', 'ARCHIVED']),
  status: z.enum(['PENDING', 'COMPLETED', 'ERROR']),
  entityType: z.string(),
  entityId: z.string().uuid(),
  userId: z.string().uuid(),
  userRole: z.string(),
  priceBefore: z.number(),
  priceAfter: z.number(),
  quantityBefore: z.number(),
  quantityAfter: z.number(),
  notes: z.string().optional(),
  isActive: z.boolean(),
  createdAt: z.string(),
});

export const inventoryMovementListResponseSchema = z.object({
  data: z.array(inventoryMovementResponseSchema),
  meta: paginationMetaSchema,
});

// Authentication response schemas
export const loginResponseSchema = z.object({
  access_token: z.string(),
  user: userResponseSchema,
});

export const registerResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: userResponseSchema,
});

// Book-Author assignment response schemas
export const bookAuthorAssignmentResponseSchema = z.object({
  id: z.string().uuid(),
  bookId: z.string().uuid(),
  authorId: z.string().uuid(),
  authorRole: z.string().optional(),
  createdAt: z.string(),
});

export const bookAuthorAssignmentListResponseSchema = z.object({
  data: z.array(bookAuthorAssignmentResponseSchema),
  meta: paginationMetaSchema,
});

// Type exports
export type UserResponse = z.infer<typeof userResponseSchema>;
export type UserListResponse = z.infer<typeof userListResponseSchema>;
export type GenreResponse = z.infer<typeof genreResponseSchema>;
export type GenreListResponse = z.infer<typeof genreListResponseSchema>;
export type PublisherResponse = z.infer<typeof publisherResponseSchema>;
export type PublisherListResponse = z.infer<typeof publisherListResponseSchema>;
export type AuthorResponse = z.infer<typeof authorResponseSchema>;
export type AuthorListResponse = z.infer<typeof authorListResponseSchema>;
export type BookResponse = z.infer<typeof bookResponseSchema>;
export type BookListResponse = z.infer<typeof bookListResponseSchema>;
export type AuditLogResponse = z.infer<typeof auditLogResponseSchema>;
export type AuditLogListResponse = z.infer<typeof auditLogListResponseSchema>;
export type InventoryMovementResponse = z.infer<typeof inventoryMovementResponseSchema>;
export type InventoryMovementListResponse = z.infer<typeof inventoryMovementListResponseSchema>;
export type LoginResponse = z.infer<typeof loginResponseSchema>;
export type RegisterResponse = z.infer<typeof registerResponseSchema>;
export type BookAuthorAssignmentResponse = z.infer<typeof bookAuthorAssignmentResponseSchema>;
export type BookAuthorAssignmentListResponse = z.infer<typeof bookAuthorAssignmentListResponseSchema>;