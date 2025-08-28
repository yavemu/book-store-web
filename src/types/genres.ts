import { BaseEntity, PaginationMeta } from './domain';

export interface BookGenre extends BaseEntity {
  name: string;
  description?: string;
  isActive: boolean;
}

export interface CreateBookGenreDto {
  name: string;
  description?: string;
  isActive?: boolean;
}

export type UpdateBookGenreDto = Partial<CreateBookGenreDto>;

export interface BookGenreResponseDto {
  success: boolean;
  message: string;
  data: BookGenre;
}

export interface BookGenreListResponseDto {
  success: boolean;
  message: string;
  data: BookGenre[];
  meta: PaginationMeta;
}

export interface GenreListParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface GenreSearchParams extends GenreListParams {
  q: string;
}

export interface GenreFiltersDto {
  name?: string;
  isActive?: boolean;
}