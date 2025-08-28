export interface Genre {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PublishingHouse {
  id: string;
  name: string;
  country?: string;
  foundedYear?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Author {
  id: string;
  firstName: string;
  lastName: string;
  biography?: string;
  birthDate?: string;
  nationality?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BookCatalog {
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
  genre?: Genre;
  publisher?: PublishingHouse;
  authors?: Author[];
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
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
  sortOrder?: 'ASC' | 'DESC';
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

export interface IsbnCheckResponse {
  exists: boolean;
}