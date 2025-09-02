'use client';

import { useState, useCallback, useRef } from 'react';
import { z } from 'zod';
import { apiClient } from '@/services/api';
import { ApiError } from '@/types/api';

export interface RetryConfig {
  maxRetries: number;
  retryDelay: number;
  retryBackoff: boolean;
}

export interface UseEnhancedApiRequestOptions<TData, TResponse> {
  endpoint: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  schema?: z.ZodSchema<TData>;
  onSuccess?: (response: TResponse) => void;
  onError?: (error: ApiError | Error) => void;
  retryConfig?: Partial<RetryConfig>;
  enableOfflineDetection?: boolean;
}

export interface ApiRequestState<TResponse> {
  loading: boolean;
  error: string | null;
  data: TResponse | null;
  validationErrors: Record<string, string[]> | null;
  retryCount: number;
  isRetrying: boolean;
  isOffline: boolean;
  lastError: ApiError | Error | null;
}

export type ErrorType = 'network' | 'server' | 'validation' | 'unknown';

export interface ErrorInfo {
  type: ErrorType;
  message: string;
  statusCode?: number;
  canRetry: boolean;
  suggestedAction: string;
}

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  retryDelay: 1000,
  retryBackoff: true,
};

export function useEnhancedApiRequest<TData = any, TResponse = any>({
  endpoint,
  method = 'POST',
  schema,
  onSuccess,
  onError,
  retryConfig = {},
  enableOfflineDetection = true
}: UseEnhancedApiRequestOptions<TData, TResponse>) {
  const [state, setState] = useState<ApiRequestState<TResponse>>({
    loading: false,
    error: null,
    data: null,
    validationErrors: null,
    retryCount: 0,
    isRetrying: false,
    isOffline: false,
    lastError: null
  });

  const retryConfigRef = useRef({ ...DEFAULT_RETRY_CONFIG, ...retryConfig });

  const getErrorInfo = (error: any): ErrorInfo => {
    if (error.statusCode === 0 || error.message?.includes('Failed to fetch')) {
      return {
        type: 'network',
        message: 'Sin conexión al servidor',
        canRetry: true,
        suggestedAction: 'Verificar conexión a internet y reintentar'
      };
    }

    if (error.statusCode >= 500) {
      return {
        type: 'server',
        message: 'Error interno del servidor',
        statusCode: error.statusCode,
        canRetry: true,
        suggestedAction: 'El servidor está experimentando problemas. Intentar más tarde.'
      };
    }

    if (error.statusCode >= 400 && error.statusCode < 500) {
      return {
        type: 'validation',
        message: error.message || 'Error de validación',
        statusCode: error.statusCode,
        canRetry: false,
        suggestedAction: 'Verificar los datos ingresados'
      };
    }

    return {
      type: 'unknown',
      message: error.message || 'Error desconocido',
      canRetry: false,
      suggestedAction: 'Contactar soporte si el problema persiste'
    };
  };

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const executeRequest = async (requestData?: TData, isRetry: boolean = false): Promise<{ success: boolean; data?: TResponse; error?: string; validationErrors?: Record<string, string[]> }> => {
    try {
      // Validación con Zod si se proporciona schema
      if (schema && requestData) {
        try {
          schema.parse(requestData);
        } catch (error) {
          if (error instanceof z.ZodError) {
            const validationErrors = error.errors.reduce((acc, curr) => {
              const path = curr.path.join('.');
              if (!acc[path]) acc[path] = [];
              acc[path].push(curr.message);
              return acc;
            }, {} as Record<string, string[]>);
            
            return { success: false, validationErrors };
          }
          throw error;
        }
      }

      // Llamada API
      let response: TResponse;
      switch (method) {
        case 'GET':
          response = await apiClient.get<TResponse>(endpoint);
          break;
        case 'POST':
          response = await apiClient.post<TResponse>(endpoint, requestData);
          break;
        case 'PUT':
          response = await apiClient.put<TResponse>(endpoint, requestData);
          break;
        case 'DELETE':
          response = await apiClient.delete<TResponse>(endpoint);
          break;
        default:
          throw new Error(`Método HTTP ${method} no soportado`);
      }

      return { success: true, data: response };

    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Error desconocido';

      return { success: false, error: errorMessage };
    }
  };

  const execute = useCallback(async (requestData?: TData) => {
    setState(prev => ({
      ...prev,
      loading: true,
      error: null,
      validationErrors: null,
      retryCount: 0,
      isRetrying: false,
      lastError: null
    }));

    const config = retryConfigRef.current;
    let lastError: ApiError | Error | null = null;

    for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
      if (attempt > 0) {
        setState(prev => ({ ...prev, isRetrying: true, retryCount: attempt }));
        
        const delay = config.retryBackoff 
          ? config.retryDelay * Math.pow(2, attempt - 1)
          : config.retryDelay;
        
        await sleep(delay);
      }

      try {
        const result = await executeRequest(requestData, attempt > 0);

        if (result.success && result.data) {
          setState(prev => ({
            ...prev,
            loading: false,
            data: result.data!,
            error: null,
            isRetrying: false,
            retryCount: attempt
          }));

          onSuccess?.(result.data);
          return { success: true, data: result.data };
        }

        if (result.validationErrors) {
          setState(prev => ({
            ...prev,
            loading: false,
            validationErrors: result.validationErrors!,
            isRetrying: false
          }));
          return { success: false, validationErrors: result.validationErrors };
        }

        throw new Error(result.error || 'Error desconocido');

      } catch (error) {
        lastError = error as ApiError | Error;
        const errorInfo = getErrorInfo(error);

        // Si no se puede reintentar o es el último intento
        if (!errorInfo.canRetry || attempt === config.maxRetries) {
          setState(prev => ({
            ...prev,
            loading: false,
            error: errorInfo.message,
            lastError,
            isRetrying: false,
            retryCount: attempt,
            isOffline: errorInfo.type === 'network'
          }));

          onError?.(lastError);
          return { success: false, error: errorInfo.message, errorInfo };
        }
      }
    }

    // Este código no debería ejecutarse nunca, pero por seguridad
    const finalError = lastError || new Error('Error desconocido');
    setState(prev => ({
      ...prev,
      loading: false,
      error: finalError.message || 'Error desconocido',
      lastError: finalError,
      isRetrying: false
    }));

    return { success: false, error: finalError.message || 'Error desconocido' };
  }, [endpoint, method, schema, onSuccess, onError]);

  const retry = useCallback(() => {
    execute();
  }, [execute]);

  const reset = useCallback(() => {
    setState({
      loading: false,
      error: null,
      data: null,
      validationErrors: null,
      retryCount: 0,
      isRetrying: false,
      isOffline: false,
      lastError: null
    });
  }, []);

  const getCurrentErrorInfo = useCallback(() => {
    if (!state.lastError) return null;
    return getErrorInfo(state.lastError);
  }, [state.lastError]);

  return {
    ...state,
    execute,
    retry,
    reset,
    getErrorInfo: getCurrentErrorInfo,
    isSuccess: !state.loading && !state.error && state.data !== null,
    canRetry: state.lastError ? getErrorInfo(state.lastError).canRetry : false
  };
}