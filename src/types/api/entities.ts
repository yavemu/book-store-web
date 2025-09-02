// API Response Types for all entities based on the actual API documentation

// Common pagination meta structure that all endpoints return
export interface ApiPaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Common API response wrapper
export interface ApiResponse<T = any> {
  statusCode?: number;
  message?: string;
  data: T;
}

// Generic list response structure
export interface ApiListResponse<T> {
  data: T[];
  meta: ApiPaginationMeta;
  message?: string;
}

// Success response structure used by some endpoints
export interface ApiSuccessResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Error response interface
export interface ApiError {
  statusCode: number;
  message: string | string[];
  error?: string;
  timestamp?: string;
  path?: string;
}

// ========================================
// AUDIT LOG TYPES
// ========================================

export interface AuditLogResponseDto {
  id: string;
  performedBy: string;
  entityId: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'READ' | 'LOGIN' | 'REGISTER';
  details: string;
  entityType: string;
  createdAt: string;
}

export interface AuditLogListResponseDto extends ApiListResponse<AuditLogResponseDto> {}

// ========================================
// USER TYPES
// ========================================

export interface UserResponseDto {
  id: string;
  username: string;
  email: string;
  role: {
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserDto {
  username: string;
  email: string;
  password: string;
  roleId: string;
}

export interface UpdateUserDto {
  username?: string;
  email?: string;
  password?: string;
  roleId?: string;
}

export interface UserListResponseDto extends ApiListResponse<UserResponseDto> {}

export interface LoginResponseDto {
  access_token: string;
  user: UserResponseDto;
}

export interface RegisterResponseDto {
  success: boolean;
  message: string;
  data: UserResponseDto;
}

// ========================================
// GENRE TYPES
// ========================================

export interface BookGenreResponseDto {
  id: string;
  name: string;
  description?: string;
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookGenreDto {
  name: string;
  description?: string;
}

export interface UpdateBookGenreDto {
  name?: string;
  description?: string;
}

export interface BookGenreListResponseDto {
  success: boolean;
  message: string;
  data: {
    data: BookGenreResponseDto[];
    meta: ApiPaginationMeta;
  };
}

// ========================================
// PUBLISHING HOUSE TYPES
// ========================================

export interface PublishingHouseResponseDto {
  id: string;
  name: string;
  country?: string;
  foundedYear?: number;
  websiteUrl?: string;
  description?: string;
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePublishingHouseDto {
  name: string;
  country?: string;
  websiteUrl?: string;
  description?: string;
}

export interface UpdatePublishingHouseDto {
  name?: string;
  country?: string;
  websiteUrl?: string;
  description?: string;
}

export interface PublishingHouseListResponseDto {
  data: {
    data: PublishingHouseResponseDto[];
    meta: ApiPaginationMeta;
  };
  message: string;
}

// ========================================
// BOOK AUTHOR TYPES
// ========================================

export interface BookAuthorResponseDto {
  id: string;
  firstName: string;
  lastName: string;
  nationality?: string;
  birthDate?: string;
  biography?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookAuthorDto {
  firstName: string;
  lastName: string;
  nationality?: string;
  birthDate?: string;
  biography?: string;
}

export interface UpdateBookAuthorDto {
  firstName?: string;
  lastName?: string;
  nationality?: string;
  birthDate?: string;
  biography?: string;
}

export interface BookAuthorListResponseDto extends ApiListResponse<BookAuthorResponseDto> {}

// ========================================
// BOOK TYPES
// ========================================

export interface BookResponseDto {
  id: string;
  title: string;
  isbnCode: string;
  price: number;
  stockQuantity: number;
  isAvailable: boolean;
  publicationDate?: string;
  pageCount?: number;
  summary?: string;
  coverImageUrl?: string;
  createdAt: string;
  updatedAt: string;
  // Relations
  genre?: BookGenreResponseDto;
  publisher?: PublishingHouseResponseDto;
  authors?: BookAuthorResponseDto[];
}

export interface CreateBookDto {
  title: string;
  isbnCode: string;
  price: number;
  stockQuantity?: number;
  isAvailable?: boolean;
  publicationDate?: string;
  pageCount?: number;
  summary?: string;
  coverImageUrl?: string;
  genreId: string;
  publisherId: string;
}

export interface UpdateBookDto {
  title?: string;
  isbnCode?: string;
  price?: number;
  stockQuantity?: number;
  isAvailable?: boolean;
  publicationDate?: string;
  pageCount?: number;
  summary?: string;
  coverImageUrl?: string;
  genreId?: string;
  publisherId?: string;
}

export interface BookListResponseDto extends ApiListResponse<BookResponseDto> {}

// ========================================
// BOOK-AUTHOR ASSIGNMENT TYPES
// ========================================

export interface BookAuthorAssignmentResponseDto {
  id: string;
  bookId: string;
  authorId: string;
  authorRole?: string;
  createdAt: string;
}

export interface CreateBookAuthorAssignmentDto {
  bookId: string;
  authorId: string;
  authorRole?: string;
}

export interface UpdateBookAuthorAssignmentDto {
  bookId?: string;
  authorId?: string;
  authorRole?: string;
}

export interface BookAuthorAssignmentListResponseDto extends ApiListResponse<BookAuthorAssignmentResponseDto> {}

// ========================================
// INVENTORY MOVEMENT TYPES
// ========================================

export interface InventoryMovementResponseDto {
  id: string;
  movementType: 'PURCHASE' | 'SALE' | 'DISCOUNT' | 'INCREASE' | 'OUT_OF_STOCK' | 'ARCHIVED';
  status: 'PENDING' | 'COMPLETED' | 'ERROR';
  entityType: string;
  entityId: string;
  userId: string;
  userRole: string;
  priceBefore: number;
  priceAfter: number;
  quantityBefore: number;
  quantityAfter: number;
  notes?: string;
  isActive: boolean;
  createdAt: string;
}

export interface CreateInventoryMovementDto {
  movementType: 'PURCHASE' | 'SALE' | 'DISCOUNT' | 'INCREASE' | 'OUT_OF_STOCK' | 'ARCHIVED';
  entityType: string;
  entityId: string;
  priceBefore: number;
  priceAfter: number;
  quantityBefore: number;
  quantityAfter: number;
  notes?: string;
}

export interface UpdateInventoryMovementDto {
  movementType?: 'PURCHASE' | 'SALE' | 'DISCOUNT' | 'INCREASE' | 'OUT_OF_STOCK' | 'ARCHIVED';
  status?: 'PENDING' | 'COMPLETED' | 'ERROR';
  priceBefore?: number;
  priceAfter?: number;
  quantityBefore?: number;
  quantityAfter?: number;
  notes?: string;
  isActive?: boolean;
}

export interface InventoryMovementListResponseDto extends ApiListResponse<InventoryMovementResponseDto> {}

// ========================================
// COMMON QUERY PARAMETER TYPES
// ========================================

export interface CommonListParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface CommonSearchParams extends CommonListParams {
  term: string;
}

export interface CommonFilterParams {
  filter: string;
  page?: number;
  limit?: number;
}

// ========================================
// HEALTH CHECK TYPES
// ========================================

export interface HealthCheckResponseDto {
  status: string;
  timestamp: string;
  uptime: number;
}