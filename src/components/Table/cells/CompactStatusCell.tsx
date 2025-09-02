"use client";

import React from 'react';

interface CompactStatusCellProps {
  isActive: boolean;
  showText?: boolean;
  size?: 'sm' | 'md';
  activeLabel?: string;
  inactiveLabel?: string;
}

export default function CompactStatusCell({
  isActive,
  showText = true,
  size = 'sm',
  activeLabel = 'Activo',
  inactiveLabel = 'Inactivo'
}: CompactStatusCellProps) {
  const sizeClasses = size === 'sm' 
    ? 'w-2 h-2 text-xs px-1 py-0.5' 
    : 'w-3 h-3 text-sm px-2 py-1';

  if (!showText) {
    // Solo mostrar indicador visual (círculo)
    return (
      <div className="flex items-center justify-center">
        <div 
          className={`${sizeClasses} rounded-full ${
            isActive 
              ? 'bg-green-500' 
              : 'bg-red-500'
          }`}
          title={isActive ? activeLabel : inactiveLabel}
        />
      </div>
    );
  }

  // Versión compacta con texto
  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-medium ${sizeClasses} ${
      isActive 
        ? 'bg-green-100 text-green-800' 
        : 'bg-red-100 text-red-800'
    }`}>
      <div className={`w-1.5 h-1.5 rounded-full ${
        isActive ? 'bg-green-500' : 'bg-red-500'
      }`} />
      <span className="hidden sm:inline">
        {isActive ? activeLabel : inactiveLabel}
      </span>
    </span>
  );
}