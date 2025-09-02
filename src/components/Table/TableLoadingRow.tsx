"use client";

import React from 'react';

interface TableLoadingRowProps {
  columnsCount: number;
  rowsCount?: number;
}

export default function TableLoadingRow({ 
  columnsCount, 
  rowsCount = 3 
}: TableLoadingRowProps) {
  return (
    <>
      {Array.from({ length: rowsCount }).map((_, rowIndex) => (
        <tr key={`skeleton-${rowIndex}`} className="skeleton-table-row">
          {Array.from({ length: columnsCount }).map((_, colIndex) => (
            <td key={colIndex}>
              <div 
                className="skeleton-placeholder"
                style={{
                  width: colIndex === 0 ? '80%' : colIndex === 1 ? '100%' : '60%',
                  height: '1rem',
                  backgroundColor: '#e2e8f0',
                  borderRadius: '0.25rem',
                  animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                }}
              />
            </td>
          ))}
          <td>
            <div 
              className="skeleton-placeholder" 
              style={{ 
                width: '70%',
                height: '1rem',
                backgroundColor: '#e2e8f0',
                borderRadius: '0.25rem',
                animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
              }}
            />
          </td>
        </tr>
      ))}
    </>
  );
}