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
    const checkId = Math.random().toString(36).substr(2, 9);
    try {
      console.log(`🔍 useAuthState [${checkId}]: Iniciando checkAuth`);
      setLoading(true);
      setError(null);
      
      console.log(`🔍 useAuthState [${checkId}]: Verificando si está autenticado...`);
      if (!authService.isAuthenticated()) {
        console.log(`🚫 useAuthState [${checkId}]: No autenticado, limpiando estado`);
        setIsAuthenticated(false);
        setUser(null);
        return;
      }

      console.log(`✅ useAuthState [${checkId}]: Autenticado, obteniendo perfil...`);
      const profile = await authService.getProfile();
      console.log(`👤 useAuthState [${checkId}]: Perfil obtenido:`, profile);
      setUser(profile);
      setIsAuthenticated(true);
    } catch (err: unknown) {
      console.error(`❌ useAuthState [${checkId}]: Error en checkAuth:`, err);
      setError('Error al verificar autenticación');
      setIsAuthenticated(false);
      setUser(null);
      
      // Solo eliminar token si es un error 401 (no autorizado)
      // Para otros errores (500, red, etc.) mantener el token
      if (err?.status === 401 || err?.message?.includes('401')) {
        console.log(`🚫 useAuthState [${checkId}]: Token inválido (401), eliminando...`);
        authService.logout();
      } else {
        console.log(`⚠️ useAuthState [${checkId}]: Error de red/servidor, manteniendo token`);
      }
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