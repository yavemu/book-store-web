"use client";

import React from 'react';

interface CompactDateCellProps {
  date: string | Date | null | undefined;
  format?: 'short' | 'relative' | 'time-only' | 'date-only';
  emptyText?: string;
  locale?: string;
}

export default function CompactDateCell({
  date,
  format = 'short',
  emptyText = '-',
  locale = 'es-ES'
}: CompactDateCellProps) {
  if (!date) {
    return <span className="text-gray-500 text-sm">{emptyText}</span>;
  }

  const dateObj = new Date(date);
  
  if (isNaN(dateObj.getTime())) {
    return <span className="text-red-500 text-sm">Inválida</span>;
  }

  const formatDate = () => {
    const now = new Date();
    const diffMs = now.getTime() - dateObj.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    switch (format) {
      case 'relative':
        if (diffMinutes < 1) return 'Ahora';
        if (diffMinutes < 60) return `${diffMinutes}m`;
        if (diffHours < 24) return `${diffHours}h`;
        if (diffDays < 7) return `${diffDays}d`;
        return dateObj.toLocaleDateString(locale, { 
          day: '2-digit', 
          month: '2-digit' 
        });
      
      case 'time-only':
        return dateObj.toLocaleTimeString(locale, { 
          hour: '2-digit', 
          minute: '2-digit' 
        });
      
      case 'date-only':
        return dateObj.toLocaleDateString(locale, { 
          day: '2-digit', 
          month: '2-digit',
          year: '2-digit'
        });
      
      case 'short':
      default:
        return dateObj.toLocaleDateString(locale, { 
          day: '2-digit', 
          month: '2-digit',
          year: '2-digit'
        });
    }
  };

  return (
    <span 
      className="text-sm font-mono"
      title={dateObj.toLocaleString(locale)}
    >
      {formatDate()}
    </span>
  );
}