"use client";

import React from 'react';

interface TextCellProps {
  text: string | null | undefined;
  maxLength?: number;
  emptyText?: string;
  showTooltip?: boolean;
}

export default function TextCell({
  text,
  maxLength = 50,
  emptyText = '-',
  showTooltip = true
}: TextCellProps) {
  if (!text) {
    return <span className="text-gray-500">{emptyText}</span>;
  }

  const shouldTruncate = text.length > maxLength;
  const displayText = shouldTruncate ? `${text.substring(0, maxLength)}...` : text;

  return (
    <span 
      className={shouldTruncate ? 'truncate max-w-xs block cursor-help' : ''}
      title={showTooltip && shouldTruncate ? text : undefined}
    >
      {displayText}
    </span>
  );
}