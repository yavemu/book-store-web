"use client";

import React from 'react';

interface TableSearchProps {
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export default function TableSearch({
  value,
  placeholder,
  onChange,
  disabled = false
}: TableSearchProps) {
  return (
    <div className="table-search-container">
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="search-input"
        style={{
          display: 'block',
          visibility: 'visible',
          opacity: 1,
          zIndex: 10
        }}
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="search-clear-btn"
          title="Limpiar búsqueda"
        >
          ✕
        </button>
      )}
    </div>
  );
}