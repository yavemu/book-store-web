// API Response Types for all entities

// Common pagination meta structure that all endpoints return
export interface ApiPaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Generic list response structure
export interface ApiListResponse<T> {
  data: T[];
  meta: ApiPaginationMeta;
  message?: string;
}

// Book Genre Types
export interface BookGenreResponseDto {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface CreateBookGenreDto {
  name: string;
  description?: string;
  isActive?: boolean;
}

export interface UpdateBookGenreDto {
  name?: string;
  description?: string;
  isActive?: boolean;
}

export interface BookGenreListResponseDto extends ApiListResponse<BookGenreResponseDto> {}

// Book Author Types
export interface BookAuthorResponseDto {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  biography?: string;
  birthDate?: string;
  deathDate?: string;
  nationality?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface CreateBookAuthorDto {
  firstName: string;
  lastName: string;
  biography?: string;
  birthDate?: string;
  deathDate?: string;
  nationality?: string;
  isActive?: boolean;
}

export interface UpdateBookAuthorDto {
  firstName?: string;
  lastName?: string;
  biography?: string;
  birthDate?: string;
  deathDate?: string;
  nationality?: string;
  isActive?: boolean;
}

export interface CreateBookAuthorResponseDto {
  data: BookAuthorResponseDto;
  message: string;
}

export interface UpdateBookAuthorResponseDto {
  data: BookAuthorResponseDto;
  message: string;
}

export interface DeleteBookAuthorResponseDto {
  message: string;
}

export interface BookAuthorListResponseDto extends ApiListResponse<BookAuthorResponseDto> {}

// Book Author Assignment Types
export interface CreateBookAuthorAssignmentDto {
  bookId: string;
  authorId: string;
}

export interface UpdateBookAuthorAssignmentDto {
  bookId?: string;
  authorId?: string;
}

// Publishing House Types
export interface PublishingHouseResponseDto {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface CreatePublishingHouseDto {
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  isActive?: boolean;
}

export interface UpdatePublishingHouseDto {
  name?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  isActive?: boolean;
}

export interface CreatePublishingHouseResponseDto {
  data: PublishingHouseResponseDto;
  message: string;
}

export interface UpdatePublishingHouseResponseDto {
  data: PublishingHouseResponseDto;
  message: string;
}

export interface DeletePublishingHouseResponseDto {
  message: string;
}

export interface PublishingHouseListResponseDto extends ApiListResponse<PublishingHouseResponseDto> {}

// Book Types
export interface BookResponseDto {
  id: string;
  title: string;
  isbn?: string;
  description?: string;
  publicationYear?: number;
  pages?: number;
  price: number;
  stockQuantity: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  // Relations
  author?: BookAuthorResponseDto;
  genre?: BookGenreResponseDto;
  publishingHouse?: PublishingHouseResponseDto;
}

export interface CreateBookDto {
  title: string;
  isbn?: string;
  description?: string;
  publicationYear?: number;
  pages?: number;
  price: number;
  stockQuantity: number;
  authorId: string;
  genreId: string;
  publishingHouseId: string;
  isActive?: boolean;
}

export interface UpdateBookDto {
  title?: string;
  isbn?: string;
  description?: string;
  publicationYear?: number;
  pages?: number;
  price?: number;
  stockQuantity?: number;
  authorId?: string;
  genreId?: string;
  publishingHouseId?: string;
  isActive?: boolean;
}

export interface BookListResponseDto extends ApiListResponse<BookResponseDto> {}

// User Types
export interface UserResponseDto {
  id: string;
  username: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  // Relations
  role?: {
    id: string;
    name: string;
    description?: string;
  };
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

export interface CreateUserResponseDto {
  data: UserResponseDto;
  message: string;
}

export interface UpdateUserResponseDto {
  data: UserResponseDto;
  message: string;
}

export interface DeleteUserResponseDto {
  message: string;
}

export interface UserListResponseDto extends ApiListResponse<UserResponseDto> {}

// Inventory Movement Types
export interface InventoryMovementResponseDto {
  id: string;
  bookId: string;
  movementType: 'IN' | 'OUT';
  quantity: number;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
  // Relations
  book?: BookResponseDto;
}

export interface CreateInventoryMovementDto {
  bookId: string;
  movementType: 'IN' | 'OUT';
  quantity: number;
  notes?: string;
}

export interface UpdateInventoryMovementDto {
  movementType?: 'IN' | 'OUT';
  quantity?: number;
  notes?: string;
}

export interface InventoryMovementListResponseDto extends ApiListResponse<InventoryMovementResponseDto> {}