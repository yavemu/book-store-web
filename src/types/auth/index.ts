export type UserRole = 'ADMIN' | 'USER';

export interface RoleDto {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface UserProfileDto {
  id: string;
  username: string;
  email: string;
  role: RoleDto;
}

export interface UserProfileResponseDto extends UserProfileDto {
  createdAt: string;
  updatedAt: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface LoginResponseDto {
  access_token: string;
  user: UserProfileDto;
}

export interface RegisterUserDto {
  username: string;
  password: string;
  email: string;
  roleId?: string;
}

export interface RegisterResponseDto {
  message: string;
  user: UserProfileDto;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: UserProfileDto | null;
  token: string | null;
  loading: boolean;
}