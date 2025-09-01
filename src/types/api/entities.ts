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

export interface BookAuthorListResponseDto extends ApiListResponse<BookAuthorResponseDto> {}

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