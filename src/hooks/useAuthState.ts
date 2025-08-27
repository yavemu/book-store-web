import { useState, useEffect } from 'react';
import { authService } from '@/services/api';
import { UserProfileResponseDto } from '@/types/auth';

export interface UseAuthStateReturn {
  isAuthenticated: boolean;
  user: UserProfileResponseDto | null;
  loading: boolean;
  error: string | null;
  checkAuth: () => Promise<void>;
  logout: () => void;
}

export function useAuthState(): UseAuthStateReturn {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<UserProfileResponseDto | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const checkAuth = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!authService.isAuthenticated()) {
        setIsAuthenticated(false);
        setUser(null);
        return;
      }

      const profile = await authService.getProfile();
      setUser(profile);
      setIsAuthenticated(true);
    } catch (err) {
      setError('Error al verificar autenticación');
      setIsAuthenticated(false);
      setUser(null);
      // Si hay error, limpiar token inválido
      authService.logout();
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setUser(null);
    setError(null);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return {
    isAuthenticated,
    user,
    loading,
    error,
    checkAuth,
    logout
  };
}