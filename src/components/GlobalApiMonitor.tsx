'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import { useGlobalApiMonitor } from '@/hooks/useGlobalApiMonitor';

export default function GlobalApiMonitor() {
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  
  const {
    consecutiveFailures,
    isMonitoring,
    lastHealthCheck
  } = useGlobalApiMonitor({
    healthCheckInterval: 15000, // Chequear cada 15 segundos
    healthCheckTimeout: 3000,   // Timeout de 3 segundos
    maxConsecutiveFailures: 2,  // Logout después de 2 fallos consecutivos
    enableAutoLogout: true
  });

  // Effect para redireccionar cuando el usuario es deslogueado por falta de conexión
  useEffect(() => {
    if (!isAuthenticated && typeof window !== 'undefined') {
      // Solo redirigir si estamos en una ruta protegida
      const currentPath = window.location.pathname;
      const isProtectedRoute = currentPath.startsWith('/books') || 
                              currentPath.startsWith('/genres') || 
                              currentPath.startsWith('/authors') || 
                              currentPath.startsWith('/publishers') || 
                              currentPath.startsWith('/users') || 
                              currentPath.startsWith('/audit');
      
      if (isProtectedRoute) {
        console.log('🔄 Redirecting to login due to API connection issues...');
        router.push('/');
      }
    }
  }, [isAuthenticated, router]);

  // Solo renderizar en development para debug (opcional)
  if (process.env.NODE_ENV === 'development' && isAuthenticated) {
    return (
      <div style={{
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        backgroundColor: 'rgba(0,0,0,0.8)',
        color: 'white',
        padding: '8px 12px',
        borderRadius: '6px',
        fontSize: '12px',
        zIndex: 9999,
        fontFamily: 'monospace'
      }}>
        <div>API Monitor: {isMonitoring ? '🟢 Active' : '🔴 Inactive'}</div>
        <div>Failures: {consecutiveFailures}/2</div>
        {lastHealthCheck && (
          <div>Last: {lastHealthCheck.toLocaleTimeString()}</div>
        )}
      </div>
    );
  }

  return null;
}