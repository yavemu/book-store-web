import { BaseEntity, PaginationMeta } from '../../domain';

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
  id: string;
  firstName: string;
  lastName: string;
  nationality?: string;
  birthDate?: string;
  biography?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BookAuthorListResponseDto {
  data: BookAuthorResponseDto[];
  meta: PaginationMeta;
}

export interface CreateBookAuthorResponseDto {
  message: string;
  author: BookAuthorResponseDto;
}

export interface UpdateBookAuthorResponseDto {
  message: string;
  author: BookAuthorResponseDto;
}

export interface DeleteBookAuthorResponseDto {
  message: string;
  deletedAuthorId: string;
}


export interface AuthorListParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
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
