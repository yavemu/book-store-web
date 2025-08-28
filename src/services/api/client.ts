import { environment } from '@/config/environment';
import { ApiError } from '@/types/api';
import { authService } from "@/services/api";

class ApiClient {
  private baseURL: string;

  constructor() {
    this.baseURL = environment.apiUrl;
    console.log('🏗️ ApiClient: Inicializando con baseURL:', this.baseURL);
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const token = authService.getToken();

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
        Authorization: `Bearer ${token}`,
      },
      ...options,
    };

    console.log('🌐 ApiClient: Haciendo request a:', url, 'con config:', config);

    try {
      const response = await fetch(url, config);
      console.log('📨 ApiClient: Respuesta recibida, status:', response.status);
      
      if (!response.ok) {
        console.error('❌ ApiClient: Response no ok, status:', response.status);
        const errorData: ApiError = {
          message: `HTTP ${response.status}: ${response.statusText}`,
          status: response.status,
        };
        throw errorData;
      }

      const data = await response.json();
      console.log('✅ ApiClient: Data parseada:', data);
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw {
          message: error.message,
          code: 'FETCH_ERROR',
        } as ApiError;
      }
      throw error;
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();