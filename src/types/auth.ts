// Authentication related types based on API documentation

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterUserDto {
  username: string;
  email: string;
  password: string;
}

export interface LoginResponseDto {
  access_token: string;
  user: {
    id: string;
    username: string;
    email: string;
    role: {
      id: string;
      name: string;
      description?: string;
    };
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

export interface RegisterResponseDto {
  success: boolean;
  message: string;
  data: {
    id: string;
    username: string;
    email: string;
    role: {
      id: string;
      name: string;
      description?: string;
    };
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

export interface UserProfileResponseDto {
  id: string;
  username: string;
  email: string;
  role: {
    id: string;
    name: string;
    description?: string;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PasswordResetRequestDto {
  email: string;
}

export interface PasswordResetConfirmDto {
  token: string;
  newPassword: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

export interface UpdateProfileDto {
  username?: string;
  email?: string;
}