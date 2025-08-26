'use client';

import { useState, useEffect } from 'react';
import { healthService } from '@/services/api';
import { HealthCheckResponse, ApiError } from '@/types/api';

interface UseHealthCheckReturn {
  data: HealthCheckResponse | null;
  loading: boolean;
  error: ApiError | null;
  refetch: () => Promise<void>;
}

export const useHealthCheck = (): UseHealthCheckReturn => {
  const [data, setData] = useState<HealthCheckResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  const fetchHealthCheck = async () => {
    try {
      setLoading(true);
      setError(null);
      const healthData = await healthService.checkHealth();
      setData(healthData);
    } catch (err) {
      setError(err as ApiError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealthCheck();
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchHealthCheck,
  };
};