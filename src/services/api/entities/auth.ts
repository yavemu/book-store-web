import { apiClient } from '../client';
import { 
  LoginDto, 
  LoginResponseDto, 
  RegisterUserDto, 
  RegisterResponseDto, 
  UserProfileResponseDto 
} from '@/types/auth';

class AuthService {
  private getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('access_token');
    }
    return null;
  }

  private setAuthToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', token);
    }
  }

  private removeAuthToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
    }
  }

  private getAuthHeaders(): Record<string, string> {
    const token = this.getAuthToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async register(registerData: RegisterUserDto): Promise<RegisterResponseDto> {
    try {
      const response = await apiClient.post<RegisterResponseDto>('/auth/register', registerData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async login(loginData: LoginDto): Promise<LoginResponseDto> {
    try {
      console.log('🔄 AuthService: Enviando login request a /auth/login con:', loginData);
      const response = await apiClient.post<LoginResponseDto>('/auth/login', loginData);
      console.log('📡 AuthService: Respuesta recibida:', response);
      
      if (response.access_token) {
        console.log('🔑 AuthService: Guardando token en localStorage');
        this.setAuthToken(response.access_token);
      } else {
        console.warn('⚠️ AuthService: No se recibió access_token en la respuesta');
      }
      
      return response;
    } catch (error) {
      console.error('❌ AuthService: Error en login:', error);
      throw error;
    }
  }

  async getProfile(): Promise<UserProfileResponseDto> {
    try {
      const headers = this.getAuthHeaders();
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'}/auth/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  }

  logout(): void {
    this.removeAuthToken();
  }

  isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }
}

export const authService = new AuthService();