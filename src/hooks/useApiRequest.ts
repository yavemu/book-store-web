'use client';

import { useState } from 'react';
import { z } from 'zod';
import { apiClient } from '@/services/api';
import { ApiError } from '@/types/api';
import { useAppDispatch } from '@/store/hooks';
import { clearInvalidAuth } from '@/store/slices/authSlice';

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
  const dispatch = useAppDispatch();
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
            const validationErrors = (error.errors || []).reduce((acc, curr) => {
              const path = curr.path ? curr.path.join('.') : 'unknown';
              if (!acc[path]) acc[path] = [];
              acc[path].push(curr.message || 'Error de validación');
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
      // Normalizar el error para asegurar que siempre tengamos un mensaje útil
      let errorMessage: string = '';
      let structuredError: ApiError | Error;

      if (error instanceof Error) {
        errorMessage = error.message || `Error en ${endpoint}`;
        structuredError = error;
      } else if (error && typeof error === 'object') {
        // Si es un objeto (como ApiError), extraer mensaje
        if ('message' in error && typeof error.message === 'string' && error.message.trim()) {
          errorMessage = error.message;
          structuredError = error as ApiError;
        } else if ('error' in error && typeof error.error === 'string' && error.error.trim()) {
          errorMessage = error.error;
          structuredError = error as ApiError;
        } else {
          // Solo loggear si el objeto no está vacío
          const errorKeys = Object.keys(error);
          if (errorKeys.length > 0) {
            errorMessage = `Error en ${endpoint}: ${JSON.stringify(error)}`;
          } else {
            errorMessage = `Error de conexión en ${endpoint}`;
          }
          structuredError = new Error(errorMessage);
        }
      } else if (typeof error === 'string' && error.trim()) {
        errorMessage = error;
        structuredError = new Error(error);
      } else {
        errorMessage = `Error de conexión en ${endpoint}`;
        structuredError = new Error(errorMessage);
      }

      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }));

      // Check for authentication errors and clear invalid auth data
      if (structuredError && typeof structuredError === 'object' && 'statusCode' in structuredError) {
        const statusCode = (structuredError as any).statusCode;
        if (statusCode === 401 || statusCode === 403) {
          console.log('Authentication error detected, clearing auth data');
          dispatch(clearInvalidAuth());
        }
      }

      // Also check for specific auth error messages
      if (errorMessage.includes('Unauthorized') || 
          errorMessage.includes('Invalid token') || 
          errorMessage.includes('Token expired') ||
          errorMessage.includes('Authentication failed')) {
        console.log('Auth error in message, clearing auth data');
        dispatch(clearInvalidAuth());
      }

      // Loggear error estructurado para debugging solo si hay contenido
      if (errorMessage && errorMessage.trim().length > 0) {
        console.error('useApiRequest Error:', {
          endpoint,
          method,
          errorMessage,
          originalError: error,
          structuredError
        });
      }

      onError?.(structuredError);
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