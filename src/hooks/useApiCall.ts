import { useState, useCallback } from 'react';

interface UseApiCallOptions {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

interface ApiCallState {
  loading: boolean;
  error: string;
}

interface UseApiCallReturn<T> {
  state: ApiCallState;
  execute: (apiCall: () => Promise<T>) => Promise<T | undefined>;
  reset: () => void;
}

/**
 * Hook reutilizable para llamadas a API que maneja loading, errores y éxito
 */
export function useApiCall<T = unknown>(options: UseApiCallOptions = {}): UseApiCallReturn<T> {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const execute = useCallback(async (apiCall: () => Promise<T>): Promise<T | undefined> => {
    try {
      setLoading(true);
      setError('');
      
      const result = await apiCall();
      
      if (options.onSuccess) {
        options.onSuccess();
      }
      
      return result;
    } catch (err: unknown) {
      const errorMessage = (err as Error)?.message || 'Ha ocurrido un error';
      setError(errorMessage);
      
      if (options.onError) {
        options.onError(errorMessage);
      }
      
      return undefined;
    } finally {
      setLoading(false);
    }
  }, [options]);

  const reset = useCallback(() => {
    setLoading(false);
    setError('');
  }, []);

  return {
    state: { loading, error },
    execute,
    reset
  };
}