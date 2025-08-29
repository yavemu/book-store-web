'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { apiClient } from '@/services/api';

export interface HealthStatus {
  isHealthy: boolean;
  isChecking: boolean;
  lastChecked: Date | null;
  uptime: number | null;
  responseTime: number | null;
  error: string | null;
}

export interface UseApiHealthOptions {
  checkInterval?: number; // milliseconds
  enableAutoCheck?: boolean;
  onStatusChange?: (status: HealthStatus) => void;
}

const DEFAULT_CHECK_INTERVAL = 30000; // 30 seconds

export function useApiHealth({
  checkInterval = DEFAULT_CHECK_INTERVAL,
  enableAutoCheck = true,
  onStatusChange
}: UseApiHealthOptions = {}) {
  const [status, setStatus] = useState<HealthStatus>({
    isHealthy: true,
    isChecking: false,
    lastChecked: null,
    uptime: null,
    responseTime: null,
    error: null
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isComponentMounted = useRef(true);

  const checkHealth = useCallback(async (): Promise<HealthStatus> => {
    if (!isComponentMounted.current) return status;

    const startTime = Date.now();
    
    setStatus(prev => ({ ...prev, isChecking: true, error: null }));

    try {
      const response = await apiClient.get('/health');
      const responseTime = Date.now() - startTime;

      const newStatus: HealthStatus = {
        isHealthy: true,
        isChecking: false,
        lastChecked: new Date(),
        uptime: response?.uptime || null,
        responseTime,
        error: null
      };

      if (isComponentMounted.current) {
        setStatus(newStatus);
        onStatusChange?.(newStatus);
      }

      return newStatus;

    } catch (error) {
      const responseTime = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Error de conexión';

      const newStatus: HealthStatus = {
        isHealthy: false,
        isChecking: false,
        lastChecked: new Date(),
        uptime: null,
        responseTime,
        error: errorMessage
      };

      if (isComponentMounted.current) {
        setStatus(newStatus);
        onStatusChange?.(newStatus);
      }

      return newStatus;
    }
  }, [onStatusChange]);

  const startAutoCheck = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Check immediately
    checkHealth();

    // Then check at intervals
    intervalRef.current = setInterval(checkHealth, checkInterval);
  }, [checkHealth, checkInterval]);

  const stopAutoCheck = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Auto-start checking if enabled
  useEffect(() => {
    if (enableAutoCheck) {
      startAutoCheck();
    }

    return () => {
      stopAutoCheck();
    };
  }, [enableAutoCheck, startAutoCheck, stopAutoCheck]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isComponentMounted.current = false;
      stopAutoCheck();
    };
  }, [stopAutoCheck]);

  return {
    status,
    checkHealth,
    startAutoCheck,
    stopAutoCheck,
    isHealthy: status.isHealthy,
    isChecking: status.isChecking,
    lastError: status.error,
    responseTime: status.responseTime
  };
}