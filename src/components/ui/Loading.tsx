'use client';

import { useEffect, useState } from 'react';

interface LoadingProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'spinner' | 'dots' | 'pulse';
}

export default function Loading({ 
  message = 'Cargando...', 
  size = 'md', 
  variant = 'spinner' 
}: LoadingProps) {
  const [dots, setDots] = useState(1);

  useEffect(() => {
    if (variant === 'dots') {
      const interval = setInterval(() => {
        setDots(prev => prev >= 3 ? 1 : prev + 1);
      }, 500);
      return () => clearInterval(interval);
    }
  }, [variant]);

  const getSpinnerSize = () => {
    switch (size) {
      case 'sm': return { width: '16px', height: '16px' };
      case 'lg': return { width: '48px', height: '48px' };
      default: return { width: '32px', height: '32px' };
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'sm': return '14px';
      case 'lg': return '20px';
      default: return '16px';
    }
  };

  const spinnerStyle = {
    ...getSpinnerSize(),
    border: '4px solid #e5e5e5',
    borderTop: '4px solid #007bff',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  };

  const renderSpinner = () => (
    <>
      <div style={spinnerStyle} />
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );

  const renderDots = () => (
    <div style={{ display: 'flex', gap: '4px' }}>
      {[1, 2, 3].map(dot => (
        <div 
          key={dot}
          style={{
            width: '8px',
            height: '8px',
            backgroundColor: '#007bff',
            borderRadius: '50%',
            opacity: dot <= dots ? 1 : 0.3,
            transition: 'opacity 0.3s ease'
          }}
        />
      ))}
    </div>
  );

  const renderPulse = () => (
    <>
      <div style={{
        ...getSpinnerSize(),
        backgroundColor: '#007bff',
        borderRadius: '50%',
        animation: 'pulse 2s infinite'
      }} />
      <style jsx>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
    </>
  );

  const renderLoadingElement = () => {
    switch (variant) {
      case 'dots': return renderDots();
      case 'pulse': return renderPulse();
      default: return renderSpinner();
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '16px',
      padding: '32px'
    }}>
      {renderLoadingElement()}
      <p style={{
        color: '#6c757d',
        fontSize: getTextSize(),
        textAlign: 'center',
        margin: 0
      }}>
        {message}
      </p>
    </div>
  );
}