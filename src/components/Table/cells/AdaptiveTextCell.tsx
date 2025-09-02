"use client";

import React, { useState } from 'react';

interface AdaptiveTextCellProps {
  text: string | null | undefined;
  maxLength: number;
  emptyText?: string;
  showTooltip?: boolean;
  expandable?: boolean;
}

export default function AdaptiveTextCell({
  text,
  maxLength,
  emptyText = '-',
  showTooltip = true,
  expandable = false
}: AdaptiveTextCellProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!text) {
    return <span className="text-gray-500">{emptyText}</span>;
  }

  const shouldTruncate = text.length > maxLength;
  const displayText = shouldTruncate && !isExpanded 
    ? `${text.substring(0, maxLength)}...` 
    : text;

  if (!shouldTruncate) {
    return <span>{text}</span>;
  }

  return (
    <div className="adaptive-text-cell">
      <span 
        className="block cursor-help"
        title={showTooltip ? text : undefined}
      >
        {displayText}
      </span>
      {expandable && shouldTruncate && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
          className="text-blue-600 hover:text-blue-800 text-xs mt-1 underline"
          type="button"
        >
          {isExpanded ? 'Contraer' : 'Ver más'}
        </button>
      )}
    </div>
  );
}