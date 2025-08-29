import { BaseEntity, PaginationMeta } from '../../domain';

export interface BookGenre extends BaseEntity {
  name: string;
  description?: string;
}

export interface CreateBookGenreDto {
  name: string;
  description?: string;
}

export type UpdateBookGenreDto = Partial<CreateBookGenreDto>;

export interface BookGenreResponseDto {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BookGenreListResponseDto {
  data: BookGenreResponseDto[];
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