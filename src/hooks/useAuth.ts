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
      setLoading(true);
      setError(null);
      
      const response = await authService.login(data);
      return response;
    } catch (err) {
      const apiError = err as ApiError;
      
      // Handle specific error status codes
      if (apiError.status === 401) {
        setError('Credenciales inválidas');
      } else if (apiError.status === 400) {
        setError('Datos de entrada inválidos');
      } else {
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