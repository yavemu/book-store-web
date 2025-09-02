"use client";

import React from 'react';

interface PriceCellProps {
  price: number | string | null | undefined;
  currency?: string;
  decimals?: number;
  emptyText?: string;
}

export default function PriceCell({
  price,
  currency = '$',
  decimals = 2,
  emptyText = '-'
}: PriceCellProps) {
  if (price === null || price === undefined || price === '') {
    return <span className="text-gray-500">{emptyText}</span>;
  }

  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
  
  if (isNaN(numericPrice)) {
    return <span className="text-red-500">Precio inválido</span>;
  }

  return (
    <span className="font-mono">
      {currency}{numericPrice.toFixed(decimals)}
    </span>
  );
}