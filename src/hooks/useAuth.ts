import { useState, useCallback } from 'react';
import { authService } from '@/services/api';
import { 
  LoginDto, 
  RegisterUserDto, 
  LoginResponseDto, 
  RegisterResponseDto 
} from '@/types/auth';
import { ApiError } from '@/types/api';

export interface UseAuthReturn {
  loading: boolean;
  error: string | null;
  login: (data: LoginDto) => Promise<LoginResponseDto>;
  register: (data: RegisterUserDto) => Promise<RegisterResponseDto>;
  logout: () => void;
  clearError: () => void;
}

export function useAuth(): UseAuthReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (data: LoginDto): Promise<LoginResponseDto> => {
    try {
      console.log('🔧 useAuth: Iniciando login, loading = true');
      setLoading(true);
      setError(null);
      
      console.log('🌐 useAuth: Llamando authService.login con:', data);
      const response = await authService.login(data);
      console.log('✅ useAuth: Respuesta del authService:', response);
      return response;
    } catch (err) {
      console.error('❌ useAuth: Error en login:', err);
      const apiError = err as ApiError;
      
      // Handle specific error status codes
      if (apiError.status === 401) {
        console.log('🚫 useAuth: Error 401 - Credenciales inválidas');
        setError('Credenciales inválidas');
      } else if (apiError.status === 400) {
        console.log('🚫 useAuth: Error 400 - Datos inválidos');
        setError('Datos de entrada inválidos');
      } else {
        console.log('🚫 useAuth: Error genérico:', apiError.message);
        setError(apiError.message || 'Error al iniciar sesión');
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (data: RegisterUserDto): Promise<RegisterResponseDto> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authService.register(data);
      return response;
    } catch (err) {
      const apiError = err as ApiError;
      
      // Handle specific error status codes
      if (apiError.status === 409) {
        setError('El nombre de usuario ya está en uso');
      } else if (apiError.status === 400) {
        // Handle validation errors
        try {
          const errorResponse = JSON.parse(apiError.message);
          if (errorResponse.message && Array.isArray(errorResponse.message)) {
            setError(errorResponse.message.join(', '));
          } else {
            setError('Datos de entrada inválidos');
          }
        } catch {
          setError('Datos de entrada inválidos');
        }
      } else {
        setError(apiError.message || 'Error al registrar usuario');
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    authService.logout();
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    login,
    register,
    logout,
    clearError
  };
}