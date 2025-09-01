import { environment } from "@/config/environment";
import { ApiError } from "@/types/api";

class ApiClient {
  private baseURL: string;

  constructor() {
    this.baseURL = environment.apiUrl;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    // Obtener token solo si existe (evita dependencia circular)
    let token = null;
    try {
      token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    } catch {
      // Si no puede acceder al localStorage, continúa sin token
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...options.headers as Record<string, string>,
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const config: RequestInit = {
      headers,
      ...options,
    };

    try {
      const response = await fetch(url, config);

      const contentType = response.headers.get("content-type");
      let data: unknown = null;

      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      }

      if (!response.ok) {
        const responseData = data as any;
        let errorMessage = "Error desconocido";
        
        if (responseData?.message) {
          if (Array.isArray(responseData.message)) {
            errorMessage = (responseData.message || []).join(", ");
          } else {
            errorMessage = responseData.message;
          }
        } else {
          errorMessage = response.statusText || "Error desconocido";
        }

        const errorData: ApiError = {
          message: errorMessage,
          error: responseData?.error || "Request Error",
          statusCode: responseData?.statusCode || response.status,
        };

        throw errorData;
      }

      // El backend siempre devuelve respuestas exitosas en formato: {data: {...}, meta: {...}, message: "..."}
      // Para respuestas paginadas, preservamos tanto data como meta de la API
      if (data && typeof data === "object" && "data" in data) {
        // Si la respuesta tiene meta (respuesta paginada), preservarla tal como viene de la API
        if ("meta" in data) {
          return {
            data: (data as any).data,
            meta: (data as any).meta  // ✅ Preservar meta original de la API
          } as T;
        }
        
        // Si no tiene meta pero tiene data, extraer solo data (respuestas simples)
        return (data as any).data as T;
      }

      return data as T;
    } catch (error) {
      // Mejorar el manejo de errores para proporcionar más información
      if (error instanceof Error) {
        let errorMessage = error.message;
        let statusCode = 0;

        // Detectar diferentes tipos de errores de conexión
        if (error.message.includes('Failed to fetch') || 
            error.message.includes('fetch is not defined') ||
            error.message.includes('NetworkError') ||
            error.name === 'TypeError') {
          errorMessage = 'Sin conexión al servidor';
          statusCode = 0;
        } else if (error.name === 'AbortError') {
          errorMessage = 'Timeout de conexión';
          statusCode = 408;
        }

        const apiError: ApiError = {
          message: errorMessage,
          error: "NetworkError",
          statusCode: statusCode,
        };


        throw apiError;
      }

      // Si el error no es una instancia de Error, lo convertimos en un ApiError estructurado
      const fallbackError: ApiError = {
        message: typeof error === 'string' 
          ? error 
          : error && typeof error === 'object' && 'message' in error 
            ? String(error.message)
            : 'Error desconocido en la comunicación con el servidor',
        error: 'UnknownError',
        statusCode: error && typeof error === 'object' && 'statusCode' in error 
          ? Number(error.statusCode) || 0 
          : 0,
      };


      throw fallbackError;
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }
}

export const apiClient = new ApiClient();
