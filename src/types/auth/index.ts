export type UserRole = 'ADMIN' | 'USER';

export interface UserProfileDto {
  id: string;
  username: string;
  email: string;
  role: UserRole;
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