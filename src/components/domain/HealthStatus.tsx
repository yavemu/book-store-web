'use client';

import { HealthCheckResponse } from '@/types/api';
import { Card } from '@/components/ui';

interface HealthStatusProps {
  data: HealthCheckResponse;
}

export const HealthStatus: React.FC<HealthStatusProps> = ({ data }) => {
  const formatUptime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    
    return `${hours}h ${minutes}m ${remainingSeconds}s`;
  };

  const formatDate = (timestamp: string): string => {
    return new Date(timestamp).toLocaleString('es-ES');
  };

  const isHealthy = (status: string): boolean => {
    return status.toLowerCase() === 'ok' || status.toLowerCase() === 'healthy';
  };

  const getStatusBadge = (status: string): string => {
    return isHealthy(status)
      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
      : 'bg-red-100 text-red-800 border border-red-200';
  };

  const getStatusIcon = (status: string): string => {
    return isHealthy(status) ? '🟢' : '🔴';
  };

  return (
    <Card 
      title="Estado de la API" 
      subtitle="Información del servidor backend"
      variant={isHealthy(data.status) ? 'status-active' : 'status-warning'}
      hover={true}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl">
            <span className="text-sm font-medium text-neutral-700">Estado:</span>
            <div className="flex items-center space-x-2">
              <span>{getStatusIcon(data.status)}</span>
              <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-xl ${getStatusBadge(data.status)}`}>
                {data.status.toUpperCase()}
              </span>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl">
            <span className="text-sm font-medium text-neutral-700">Tiempo activo:</span>
            <span className="text-sm font-mono text-indigo-600">{formatUptime(data.uptime)}</span>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-neutral-100">
            <span className="text-sm font-medium text-neutral-700">⏰ Timestamp:</span>
            <span className="text-sm text-neutral-800">{formatDate(data.timestamp)}</span>
          </div>
          
          {data.environment && (
            <div className="flex items-center justify-between py-2 border-b border-neutral-100">
              <span className="text-sm font-medium text-neutral-700">🌍 Entorno:</span>
              <span className={`text-sm px-2 py-1 rounded ${data.environment === 'production' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'}`}>
                {data.environment}
              </span>
            </div>
          )}
        </div>
        
        <div className="mt-6 p-4 bg-neutral-100 rounded-xl border border-neutral-200">
          <h4 className="text-sm font-semibold text-neutral-700 mb-3 flex items-center">
            📄 Respuesta completa del servidor:
          </h4>
          <pre className="text-xs text-neutral-600 overflow-x-auto font-mono bg-white p-3 rounded-lg border">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      </div>
    </Card>
  );
};