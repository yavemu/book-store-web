"use client";

import React from 'react';

interface DateCellProps {
  date: string | Date | null | undefined;
  format?: 'date' | 'datetime' | 'time';
  emptyText?: string;
  locale?: string;
}

export default function DateCell({
  date,
  format = 'datetime',
  emptyText = '-',
  locale = 'es-ES'
}: DateCellProps) {
  if (!date) {
    return <span className="text-gray-500">{emptyText}</span>;
  }

  const dateObj = new Date(date);
  
  if (isNaN(dateObj.getTime())) {
    return <span className="text-red-500">Fecha inválida</span>;
  }

  const formatDate = () => {
    switch (format) {
      case 'date':
        return dateObj.toLocaleDateString(locale);
      case 'time':
        return dateObj.toLocaleTimeString(locale);
      case 'datetime':
      default:
        return dateObj.toLocaleString(locale);
    }
  };

  return (
    <span title={dateObj.toLocaleString(locale)}>
      {formatDate()}
    </span>
  );
}