import { BaseEntity, PaginationMeta } from '../../domain';

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

export interface UserResponseDto {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
  roleId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserListResponseDto {
  data: UserResponseDto[];
  meta: PaginationMeta;
}

export interface CreateUserResponseDto {
  message: string;
  user: UserResponseDto;
}

export interface UpdateUserResponseDto {
  message: string;
  user: UserResponseDto;
}

export interface DeleteUserResponseDto {
  message: string;
  deletedUserId: string;
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