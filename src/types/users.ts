import { BaseEntity, PaginationMeta } from './domain';

export interface Role {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface User extends BaseEntity {
  username: string;
  password: string;
  email: string;
  roleId: string;
  role: Role;
}

export interface CreateUserDto {
  username: string;
  password: string;
  email: string;
  roleId: string;
}

export interface UpdateUserDto {
  username?: string;
  email?: string;
  roleId?: string;
}

export interface UserResponseDto {
  success: boolean;
  message: string;
  data: User;
}

export interface UserListResponseDto {
  success: boolean;
  message: string;
  data: User[];
  meta: PaginationMeta;
}

export interface CreateUserResponseDto {
  success: boolean;
  message: string;
  data: User;
}

export interface UpdateUserResponseDto {
  success: boolean;
  message: string;
  data: User;
}

export interface DeleteUserResponseDto {
  success: boolean;
  message: string;
}

export interface UserListParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface UserFiltersDto {
  username?: string;
  email?: string;
  roleId?: string;
}