import { BaseEntity, PaginationMeta } from '../../domain';

export interface BookCatalog extends BaseEntity {
  title: string;
  isbnCode: string;
  price: number;
  isAvailable: boolean;
  stockQuantity: number;
  coverImageUrl?: string;
  publicationDate?: string;
  pageCount?: number;
  summary?: string;
  genreId: string;
  publisherId: string;
}

export interface CreateBookCatalogDto {
  title: string;
  isbnCode: string;
  price: number;
  isAvailable?: boolean;
  stockQuantity?: number;
  coverImageUrl?: string;
  publicationDate?: string;
  pageCount?: number;
  summary?: string;
  genreId: string;
  publisherId: string;
}

export interface UpdateBookCatalogDto {
  title?: string;
  isbnCode?: string;
  price?: number;
  isAvailable?: boolean;
  stockQuantity?: number;
  coverImageUrl?: string;
  publicationDate?: string;
  pageCount?: number;
  summary?: string;
  genreId?: string;
  publisherId?: string;
}

export interface BookFiltersDto {
  title?: string;
  genreId?: string;
  publisherId?: string;
  isAvailable?: boolean;
  minPrice?: number;
  maxPrice?: number;
}

export interface BookCatalogListParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
  search?: string;
  genreId?: string;
  publisherId?: string;
  isAvailable?: boolean;
  minPrice?: number;
  maxPrice?: number;
}

export interface BookCatalogSearchParams {
  term: string;
  page?: number;
  limit?: number;
}

export interface BookCatalogResponseDto {
  id: string;
  title: string;
  isbnCode: string;
  price: number;
  isAvailable: boolean;
  stockQuantity: number;
  coverImageUrl?: string;
  publicationDate?: string;
  pageCount?: number;
  summary?: string;
  genreId: string;
  publisherId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookCatalogResponseDto {
  message: string;
  book: BookCatalogResponseDto;
}

export interface BookCatalogListResponseDto {
  data: BookCatalogResponseDto[];
  meta: PaginationMeta;
}

export interface UpdateBookCatalogResponseDto {
  message: string;
  book: BookCatalogResponseDto;
}

export interface DeleteBookCatalogResponseDto {
  message: string;
  deletedBookId: string;
}

export interface IsbnCheckResponse {
  exists: boolean;
}
