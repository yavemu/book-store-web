/**
 * Hook especializado para diferentes tipos de llamadas API del dashboard
 * Maneja: /getAll, /search, /filter, /advanced-filter
 */

import { useState, useCallback } from 'react';
import { useApiRequest } from '../useApiRequest';

export type ApiCallType = 'getAll' | 'search' | 'filter' | 'advanced-filter';

interface UseApiCallProps {
  apiService: any;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

export function useApiCall({ apiService, onSuccess, onError }: UseApiCallProps) {
  const [currentCallType, setCurrentCallType] = useState<ApiCallType>('getAll');
  const [lastParams, setLastParams] = useState<any>(null);

  // Hook base para llamadas API
  const { loading, error, data, execute } = useApiRequest({
    apiFunction: () => {
      switch (currentCallType) {
        case 'getAll':
          return apiService.list(lastParams);
        case 'search':
          return apiService.search(lastParams);
        case 'filter':
          return apiService.filter(lastParams);
        case 'advanced-filter':
          return apiService.advancedFilter ? 
            apiService.advancedFilter(lastParams.filters, lastParams.pagination) :
            apiService.filter(lastParams);
        default:
          return apiService.list(lastParams);
      }
    }
  });

  // Método para ejecutar getAll
  const executeGetAll = useCallback(async (params: any = { page: 1, limit: 10 }) => {
    setCurrentCallType('getAll');
    setLastParams(params);
    try {
      const result = await execute();
      onSuccess?.(result);
      return result;
    } catch (err) {
      onError?.(err);
      throw err;
    }
  }, [execute, onSuccess, onError]);

  // Método para ejecutar search
  const executeSearch = useCallback(async (searchParams: any) => {
    setCurrentCallType('search');
    setLastParams(searchParams);
    try {
      const result = await execute();
      onSuccess?.(result);
      return result;
    } catch (err) {
      onError?.(err);
      throw err;
    }
  }, [execute, onSuccess, onError]);

  // Método para ejecutar filter
  const executeFilter = useCallback(async (filterParams: any) => {
    setCurrentCallType('filter');
    setLastParams(filterParams);
    try {
      const result = await execute();
      onSuccess?.(result);
      return result;
    } catch (err) {
      onError?.(err);
      throw err;
    }
  }, [execute, onSuccess, onError]);

  // Método para ejecutar advanced-filter
  const executeAdvancedFilter = useCallback(async (filters: any, pagination?: any) => {
    setCurrentCallType('advanced-filter');
    setLastParams({ filters, pagination });
    try {
      const result = await execute();
      onSuccess?.(result);
      return result;
    } catch (err) {
      onError?.(err);
      throw err;
    }
  }, [execute, onSuccess, onError]);

  // Método para re-ejecutar la última llamada
  const refetch = useCallback(async () => {
    try {
      const result = await execute();
      onSuccess?.(result);
      return result;
    } catch (err) {
      onError?.(err);
      throw err;
    }
  }, [execute, onSuccess, onError]);

  return {
    // Estado
    loading,
    error,
    data,
    currentCallType,
    lastParams,

    // Métodos especializados
    executeGetAll,
    executeSearch,
    executeFilter,
    executeAdvancedFilter,
    refetch,

    // Utilidades
    isGetAll: currentCallType === 'getAll',
    isSearch: currentCallType === 'search',
    isFilter: currentCallType === 'filter',
    isAdvancedFilter: currentCallType === 'advanced-filter'
  };
}