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

      // El backend siempre devuelve respuestas exitosas en formato: {data: {...}, message: "..."}
      // Extraemos automáticamente la propiedad 'data' para simplificar el manejo en toda la app
      if (data && typeof data === "object" && "data" in data && "message" in data) {
        // SOLUCIÓN TRANSVERSAL: Detectar y normalizar respuestas paginadas automáticamente
        // Si data.data es un array directo, asumir que es una respuesta paginada que necesita meta
        if (Array.isArray(data.data)) {
          // Verificar si ya tiene la estructura correcta {data: [...], meta: {...}}
          const hasCorrectStructure = data.data.length > 0 && typeof data.data[0] === "object" && "data" in data.data[0] && "meta" in data.data[0];

          if (!hasCorrectStructure) {
            // Crear estructura paginada estándar para CUALQUIER endpoint que devuelva array
            const paginatedResponse = {
              data: data.data,
              meta: {
                currentPage: 1,
                totalPages: 1,
                totalItems: data.data.length,
                itemsPerPage: data.data.length,
                hasNextPage: false,
                hasPrevPage: false,
              },
            };

            return paginatedResponse as T;
          }
        }

        // Si data.data no es array pero parece ser una respuesta paginada mal estructurada, normalizarla
        if (data.data && typeof data.data === "object" && !Array.isArray(data.data)) {
          // Si tiene 'data' pero no 'meta', agregamos meta por defecto
          if ("data" in data.data && Array.isArray((data.data as any).data) && !("meta" in data.data)) {
            const arrayData = (data.data as any).data;
            const normalizedResponse = {
              data: arrayData,
              meta: {
                currentPage: 1,
                totalPages: 1,
                totalItems: arrayData.length,
                itemsPerPage: arrayData.length,
                hasNextPage: false,
                hasPrevPage: false,
              },
            };

            return normalizedResponse as T;
          }
        }

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
