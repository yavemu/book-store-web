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

  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'w-4 h-4';
      case 'lg': return 'w-12 h-12';
      default: return 'w-8 h-8';
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'sm': return 'text-sm';
      case 'lg': return 'text-xl';
      default: return 'text-base';
    }
  };

  const renderSpinner = () => (
    <div className={`${getSizeClasses()} border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin`} />
  );

  const renderDots = () => (
    <div className="flex space-x-1">
      {[1, 2, 3].map(dot => (
        <div 
          key={dot}
          className={`w-2 h-2 bg-blue-600 rounded-full ${
            dot <= dots ? 'opacity-100' : 'opacity-30'
          } transition-opacity duration-300`}
        />
      ))}
    </div>
  );

  const renderPulse = () => (
    <div className={`${getSizeClasses()} bg-blue-600 rounded-full animate-pulse`} />
  );

  const renderLoadingElement = () => {
    switch (variant) {
      case 'dots': return renderDots();
      case 'pulse': return renderPulse();
      default: return renderSpinner();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-8">
      {renderLoadingElement()}
      <p className={`text-gray-600 ${getTextSize()} text-center`}>
        {message}
      </p>
    </div>
  );
}