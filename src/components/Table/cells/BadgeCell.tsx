"use client";

import React from 'react';

interface BadgeCellProps {
  value: string | null | undefined;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  customColor?: {
    bg: string;
    text: string;
  };
  emptyText?: string;
}

export default function BadgeCell({
  value,
  variant = 'default',
  customColor,
  emptyText = '-'
}: BadgeCellProps) {
  if (!value) {
    return <span className="text-gray-500">{emptyText}</span>;
  }

  const getVariantClasses = () => {
    if (customColor) {
      return `${customColor.bg} ${customColor.text}`;
    }

    switch (variant) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'info':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getVariantClasses()}`}>
      {value}
    </span>
  );
}