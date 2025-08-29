'use client';

import { useEffect, useState } from 'react';
import { healthService } from '@/services/api';
import { HealthCheckResponse } from '@/types/api';
import Loading from '@/components/ui/Loading';

export default function Home() {
  const [healthData, setHealthData] = useState<HealthCheckResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await healthService.checkHealth();
        setHealthData(response);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al verificar el estado de la API');
      } finally {
        setLoading(false);
      }
    };

    checkHealth();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading message="Verificando conexión con la API..." size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error de Conexión</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Book Store API
        </h1>
        
        {healthData && (
          <div className="space-y-3 text-left">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600 font-medium">Estado:</span>
              <span className="text-green-600 font-semibold capitalize">
                {healthData.status}
              </span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600 font-medium">Tiempo activo:</span>
              <span className="text-gray-900 font-mono text-sm">
                {Math.round(healthData.uptime)}s
              </span>
            </div>
            
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600 font-medium">Última verificación:</span>
              <span className="text-gray-900 text-sm">
                {new Date(healthData.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </div>
        )}
        
        <div className="mt-6 pt-6 border-t border-gray-100">
          <p className="text-sm text-gray-500">
            API funcionando correctamente
          </p>
        </div>
      </div>
    </div>
  );
}