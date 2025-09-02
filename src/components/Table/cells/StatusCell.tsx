"use client";

import React from 'react';

interface StatusCellProps {
  isActive: boolean;
  activeLabel?: string;
  inactiveLabel?: string;
  activeClass?: string;
  inactiveClass?: string;
}

export default function StatusCell({
  isActive,
  activeLabel = 'Activo',
  inactiveLabel = 'Inactivo',
  activeClass = 'bg-green-100 text-green-800',
  inactiveClass = 'bg-red-100 text-red-800'
}: StatusCellProps) {
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
      isActive ? activeClass : inactiveClass
    }`}>
      {isActive ? activeLabel : inactiveLabel}
    </span>
  );
}