'use client';

import { useState } from 'react';
import { z } from 'zod';
import { apiClient } from '@/services/api';
import { ApiError } from '@/types/api';

interface UseApiRequestOptions<TData, TResponse> {
  endpoint: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  schema?: z.ZodSchema<TData>;
  onSuccess?: (response: TResponse) => void;
  onError?: (error: ApiError | Error) => void;
}

interface ApiRequestState<TResponse> {
  loading: boolean;
  error: string | null;
  data: TResponse | null;
  validationErrors: Record<string, string[]> | null;
}

export function useApiRequest<TData = any, TResponse = any>({
  endpoint,
  method = 'POST',
  schema,
  onSuccess,
  onError
}: UseApiRequestOptions<TData, TResponse>) {
  const [state, setState] = useState<ApiRequestState<TResponse>>({
    loading: false,
    error: null,
    data: null,
    validationErrors: null
  });

  const execute = async (requestData?: TData) => {
    setState(prev => ({
      ...prev,
      loading: true,
      error: null,
      validationErrors: null
    }));

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
            
            setState(prev => ({
              ...prev,
              loading: false,
              validationErrors
            }));
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

      setState(prev => ({
        ...prev,
        loading: false,
        data: response,
        error: null
      }));

      onSuccess?.(response);
      return { success: true, data: response };

    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Error desconocido';

      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }));

      onError?.(error as ApiError | Error);
      return { success: false, error: errorMessage };
    }
  };

  const reset = () => {
    setState({
      loading: false,
      error: null,
      data: null,
      validationErrors: null
    });
  };

  return {
    ...state,
    execute,
    reset,
    isSuccess: !state.loading && !state.error && state.data !== null
  };
}