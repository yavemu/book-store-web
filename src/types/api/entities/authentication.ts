export interface LoginDto {
  email: string;
  password: string;
}

export interface UserProfileDto {
  id: string;
  username: string;
  email: string;
  role: 'ADMIN' | 'USER';
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

export interface UserProfileResponseDto {
  id: string;
  username: string;
  email: string;
  role: 'ADMIN' | 'USER';
  createdAt: string;
  updatedAt: string;
}