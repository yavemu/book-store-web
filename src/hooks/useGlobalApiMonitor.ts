'use client';

import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
import { apiClient } from '@/services/api';

export interface ApiMonitorConfig {
  healthCheckInterval?: number;
  healthCheckTimeout?: number;
  maxConsecutiveFailures?: number;
  enableAutoLogout?: boolean;
}

const DEFAULT_CONFIG: Required<ApiMonitorConfig> = {
  healthCheckInterval: 30000, // 30 seconds
  healthCheckTimeout: 3000, // 3 seconds
  maxConsecutiveFailures: 3,
  enableAutoLogout: true
};

export function useGlobalApiMonitor(config: ApiMonitorConfig = {}) {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  const consecutiveFailuresRef = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isMonitoringRef = useRef(false);
  const lastHealthCheckRef = useRef<Date | null>(null);

  const performHealthCheck = async (): Promise<boolean> => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), finalConfig.healthCheckTimeout);

      const startTime = Date.now();
      
      await fetch('/api/health', {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      clearTimeout(timeoutId);
      const responseTime = Date.now() - startTime;
      
      console.log(`✅ API Health Check OK (${responseTime}ms)`);
      consecutiveFailuresRef.current = 0;
      lastHealthCheckRef.current = new Date();
      return true;

    } catch (error) {
      consecutiveFailuresRef.current++;
      const isTimeout = error instanceof Error && error.name === 'AbortError';
      
      console.warn(`❌ API Health Check Failed (attempt ${consecutiveFailuresRef.current}/${finalConfig.maxConsecutiveFailures})`, {
        error: isTimeout ? 'Timeout after 3s' : error,
        timestamp: new Date().toISOString()
      });

      // Si hemos alcanzado el máximo de fallos consecutivos, hacer logout
      if (consecutiveFailuresRef.current >= finalConfig.maxConsecutiveFailures && finalConfig.enableAutoLogout) {
        console.error('🔴 API Health: Maximum consecutive failures reached. Logging out user.');
        
        // Limpiar localStorage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('access_token');
          localStorage.removeItem('user');
        }
        
        // Dispatch logout
        dispatch(logout());
        
        return false;
      }

      return false;
    }
  };

  const startMonitoring = () => {
    if (isMonitoringRef.current || !isAuthenticated) return;
    
    console.log('🔍 Starting API Health Monitor...');
    isMonitoringRef.current = true;
    
    // Hacer un chequeo inmediato
    performHealthCheck();
    
    // Configurar chequeos periódicos
    intervalRef.current = setInterval(performHealthCheck, finalConfig.healthCheckInterval);
  };

  const stopMonitoring = () => {
    if (!isMonitoringRef.current) return;
    
    console.log('🛑 Stopping API Health Monitor...');
    isMonitoringRef.current = false;
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Effect para iniciar/detener el monitoreo basado en autenticación
  useEffect(() => {
    if (isAuthenticated) {
      startMonitoring();
    } else {
      stopMonitoring();
    }

    return () => {
      stopMonitoring();
    };
  }, [isAuthenticated]);

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      stopMonitoring();
    };
  }, []);

  return {
    consecutiveFailures: consecutiveFailuresRef.current,
    isMonitoring: isMonitoringRef.current,
    lastHealthCheck: lastHealthCheckRef.current,
    performHealthCheck,
    startMonitoring,
    stopMonitoring
  };
}