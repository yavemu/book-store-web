import { BaseEntity, PaginationMeta } from './domain';

export interface BookAuthor extends BaseEntity {
  firstName: string;
  lastName: string;
  biography?: string;
  nationality?: string;
  birthDate?: string;
  deathDate?: string;
  profileImageUrl?: string;
  website?: string;
  isActive: boolean;
}

export interface CreateBookAuthorDto {
  firstName: string;
  lastName: string;
  biography?: string;
  nationality?: string;
  birthDate?: string;
  deathDate?: string;
  profileImageUrl?: string;
  website?: string;
  isActive?: boolean;
}

export type UpdateBookAuthorDto = Partial<CreateBookAuthorDto>;

export interface BookAuthorResponseDto {
  success: boolean;
  message: string;
  data: BookAuthor;
}

export interface BookAuthorListResponseDto {
  success: boolean;
  message: string;
  data: BookAuthor[];
  meta: PaginationMeta;
}

export interface CreateBookAuthorResponseDto {
  success: boolean;
  message: string;
  data: BookAuthor;
}

export interface UpdateBookAuthorResponseDto {
  success: boolean;
  message: string;
  data: BookAuthor;
}

export interface DeleteBookAuthorResponseDto {
  success: boolean;
  message: string;
}

export interface CreateBookAuthorAssignmentDto {
  bookId: string;
  authorId: string;
  isPrimaryAuthor?: boolean;
  role?: string;
}

export type UpdateBookAuthorAssignmentDto = Partial<CreateBookAuthorAssignmentDto>;

export interface AuthorListParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface AuthorSearchParams extends AuthorListParams {
  term: string;
}

export interface AuthorFiltersDto {
  firstName?: string;
  lastName?: string;
  nationality?: string;
  isActive?: boolean;
  birthYearFrom?: number;
  birthYearTo?: number;
}