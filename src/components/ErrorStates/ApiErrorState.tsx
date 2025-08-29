'use client';

import React from 'react';

export interface ApiErrorStateProps {
  error: string;
  canRetry?: boolean;
  isRetrying?: boolean;
  retryCount?: number;
  maxRetries?: number;
  onRetry?: () => void;
  onReset?: () => void;
  title?: string;
  description?: string;
  showTechnicalDetails?: boolean;
}

export default function ApiErrorState({
  error,
  canRetry = false,
  isRetrying = false,
  retryCount = 0,
  maxRetries = 3,
  onRetry,
  onReset,
  title,
  description,
  showTechnicalDetails = false
}: ApiErrorStateProps) {
  const getErrorIcon = () => {
    if (error.toLowerCase().includes('conexión') || error.toLowerCase().includes('network')) {
      return '🌐';
    }
    if (error.toLowerCase().includes('servidor') || error.toLowerCase().includes('server')) {
      return '🔧';
    }
    return '⚠️';
  };

  const getErrorTitle = () => {
    if (title) return title;
    
    if (error.toLowerCase().includes('conexión') || error.toLowerCase().includes('network')) {
      return 'Sin conexión al servidor';
    }
    if (error.toLowerCase().includes('servidor') || error.toLowerCase().includes('server')) {
      return 'Error del servidor';
    }
    return 'Error inesperado';
  };

  const getErrorDescription = () => {
    if (description) return description;
    
    if (error.toLowerCase().includes('conexión') || error.toLowerCase().includes('network')) {
      return 'No se pudo conectar con el servidor. Revisa tu conexión a internet.';
    }
    if (error.toLowerCase().includes('servidor') || error.toLowerCase().includes('server')) {
      return 'El servidor está experimentando problemas. Nuestro equipo está trabajando para solucionarlo.';
    }
    return 'Algo salió mal. Por favor intenta nuevamente.';
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      textAlign: 'center',
      backgroundColor: '#f8f9fa',
      borderRadius: '8px',
      border: '1px solid #e9ecef',
      margin: '20px 0'
    }}>
      {/* Error Icon */}
      <div style={{
        fontSize: '48px',
        marginBottom: '16px',
        opacity: 0.8
      }}>
        {getErrorIcon()}
      </div>

      {/* Error Title */}
      <h3 style={{
        color: '#495057',
        marginBottom: '12px',
        fontSize: '24px',
        fontWeight: '600'
      }}>
        {getErrorTitle()}
      </h3>

      {/* Error Description */}
      <p style={{
        color: '#6c757d',
        marginBottom: '24px',
        fontSize: '16px',
        maxWidth: '500px',
        lineHeight: '1.5'
      }}>
        {getErrorDescription()}
      </p>

      {/* Retry Information */}
      {retryCount > 0 && (
        <div style={{
          background: '#fff3cd',
          border: '1px solid #ffeaa7',
          borderRadius: '4px',
          padding: '8px 16px',
          marginBottom: '16px',
          fontSize: '14px',
          color: '#856404'
        }}>
          {isRetrying ? (
            <span>🔄 Reintentando... (intento {retryCount + 1} de {maxRetries + 1})</span>
          ) : (
            <span>Se intentó {retryCount} {retryCount === 1 ? 'vez' : 'veces'}</span>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div style={{
        display: 'flex',
        gap: '12px',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        {canRetry && onRetry && (
          <button
            onClick={onRetry}
            disabled={isRetrying}
            style={{
              backgroundColor: isRetrying ? '#6c757d' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: '12px 24px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: isRetrying ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseOver={(e) => {
              if (!isRetrying) {
                (e.target as HTMLElement).style.backgroundColor = '#0056b3';
              }
            }}
            onMouseOut={(e) => {
              if (!isRetrying) {
                (e.target as HTMLElement).style.backgroundColor = '#007bff';
              }
            }}
          >
            {isRetrying ? (
              <>
                <span style={{ 
                  display: 'inline-block', 
                  animation: 'spin 1s linear infinite',
                  transformOrigin: 'center'
                }}>
                  🔄
                </span>
                Reintentando...
              </>
            ) : (
              <>🔄 Reintentar</>
            )}
          </button>
        )}

        {onReset && (
          <button
            onClick={onReset}
            style={{
              backgroundColor: 'transparent',
              color: '#6c757d',
              border: '1px solid #6c757d',
              borderRadius: '6px',
              padding: '12px 24px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              (e.target as HTMLElement).style.backgroundColor = '#6c757d';
              (e.target as HTMLElement).style.color = 'white';
            }}
            onMouseOut={(e) => {
              (e.target as HTMLElement).style.backgroundColor = 'transparent';
              (e.target as HTMLElement).style.color = '#6c757d';
            }}
          >
            🏠 Volver al inicio
          </button>
        )}
      </div>

      {/* Technical Details (Collapsible) */}
      {showTechnicalDetails && (
        <details style={{
          marginTop: '20px',
          padding: '12px',
          backgroundColor: '#f1f3f4',
          borderRadius: '4px',
          fontSize: '12px',
          color: '#5f6368',
          maxWidth: '100%',
          width: '100%'
        }}>
          <summary style={{ cursor: 'pointer', fontWeight: '500' }}>
            Detalles técnicos
          </summary>
          <div style={{ marginTop: '8px', fontFamily: 'monospace' }}>
            {error}
          </div>
        </details>
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