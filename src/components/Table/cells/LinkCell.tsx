"use client";

import React from 'react';

interface LinkCellProps {
  url: string | null | undefined;
  text?: string;
  external?: boolean;
  emptyText?: string;
}

export default function LinkCell({
  url,
  text,
  external = true,
  emptyText = '-'
}: LinkCellProps) {
  if (!url) {
    return <span className="text-gray-500">{emptyText}</span>;
  }

  const formattedUrl = url.startsWith('http') ? url : `https://${url}`;
  const displayText = text || url;

  return (
    <a 
      href={formattedUrl}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
      title={`Ir a ${formattedUrl}`}
    >
      {displayText}
    </a>
  );
}