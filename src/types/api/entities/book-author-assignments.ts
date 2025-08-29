import { PaginationMeta } from '../../domain';

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

export interface BookAuthorAssignmentResponseDto {
  id: string;
  bookId: string;
  authorId: string;
  assignmentOrder?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface BookAuthorAssignmentListResponseDto {
  data: BookAuthorAssignmentResponseDto[];
  meta: PaginationMeta;
}