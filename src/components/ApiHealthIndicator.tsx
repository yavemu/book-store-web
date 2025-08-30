'use client';

import React, { useState } from 'react';
import { useApiHealth } from '@/hooks/useApiHealth';

export interface ApiHealthIndicatorProps {
  showDetails?: boolean;
  position?: 'fixed' | 'static';
  onHealthChange?: (isHealthy: boolean) => void;
}

export default function ApiHealthIndicator({ 
  showDetails = false, 
  position = 'static',
  onHealthChange 
}: ApiHealthIndicatorProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const { status, checkHealth } = useApiHealth({
    checkInterval: 15000, // Check every 15 seconds
    enableAutoCheck: true,
    onStatusChange: (newStatus) => {
      onHealthChange?.(newStatus.isHealthy);
    }
  });

  const getStatusColor = () => {
    if (status.isChecking) return '#ffc107'; // yellow
    return status.isHealthy ? '#28a745' : '#dc3545'; // green : red
  };

  const getStatusText = () => {
    if (status.isChecking) return 'Verificando...';
    return status.isHealthy ? 'Conectado' : 'Desconectado';
  };

  const getStatusIcon = () => {
    if (status.isChecking) return '🔄';
    return status.isHealthy ? '🟢' : '🔴';
  };

  const formatResponseTime = (time: number | null) => {
    if (!time) return 'N/A';
    return `${time}ms`;
  };

  const formatUptime = (uptime: number | null) => {
    if (!uptime) return 'N/A';
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const baseStyles: React.CSSProperties = {
    backgroundColor: 'white',
    border: `2px solid ${getStatusColor()}`,
    borderRadius: '8px',
    padding: '8px 12px',
    fontSize: '14px',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: showDetails ? 'pointer' : 'default',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    ...(position === 'fixed' && {
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 1000
    })
  };

  return (
    <div>
      <div
        style={baseStyles}
        onClick={showDetails ? () => setIsExpanded(!isExpanded) : undefined}
        onMouseOver={(e) => {
          if (showDetails) {
            (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
          }
        }}
        onMouseOut={(e) => {
          if (showDetails) {
            (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
          }
        }}
      >
        <span style={{ 
          animation: status.isChecking ? 'spin 1s linear infinite' : 'none',
          display: 'inline-block'
        }}>
          {getStatusIcon()}
        </span>
        
        <span style={{ color: getStatusColor() }}>
          {getStatusText()}
        </span>

        {status.responseTime && (
          <span style={{ 
            fontSize: '12px', 
            color: '#6c757d',
            backgroundColor: '#f8f9fa',
            padding: '2px 6px',
            borderRadius: '4px'
          }}>
            {formatResponseTime(status.responseTime)}
          </span>
        )}

        {showDetails && (
          <span style={{ fontSize: '12px', color: '#6c757d' }}>
            {isExpanded ? '▼' : '▶'}
          </span>
        )}
      </div>

      {/* Expanded Details */}
      {showDetails && isExpanded && (
        <div style={{
          position: position === 'fixed' ? 'fixed' : 'absolute',
          top: position === 'fixed' ? '60px' : '100%',
          right: position === 'fixed' ? '20px' : '0',
          backgroundColor: 'white',
          border: '1px solid #dee2e6',
          borderRadius: '8px',
          padding: '16px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          minWidth: '250px',
          zIndex: 1001
        }}>
          <h4 style={{ 
            margin: '0 0 12px 0', 
            fontSize: '16px',
            color: '#495057',
            borderBottom: '1px solid #dee2e6',
            paddingBottom: '8px'
          }}>
            Estado de la API
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#6c757d' }}>Estado:</span>
              <span style={{ color: getStatusColor(), fontWeight: '500' }}>
                {getStatusText()}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#6c757d' }}>Tiempo de respuesta:</span>
              <span>{formatResponseTime(status.responseTime)}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#6c757d' }}>Uptime del servidor:</span>
              <span>{formatUptime(status.uptime)}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#6c757d' }}>Última verificación:</span>
              <span style={{ fontSize: '12px' }}>
                {status.lastChecked ? status.lastChecked.toLocaleTimeString() : 'Nunca'}
              </span>
            </div>

            {status.error && (
              <div className="error-display compact">
                <strong>Error:</strong> {status.error}
              </div>
            )}

            <button
              onClick={checkHealth}
              disabled={status.isChecking}
              style={{
                marginTop: '12px',
                backgroundColor: status.isChecking ? '#6c757d' : '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                padding: '6px 12px',
                fontSize: '12px',
                cursor: status.isChecking ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.2s'
              }}
            >
              {status.isChecking ? 'Verificando...' : 'Verificar ahora'}
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}