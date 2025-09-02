"use client";

import React from 'react';

interface TableHeaderCellProps {
  label: string;
  field: string;
  sortable?: boolean;
  sortIcon?: string;
  isSortActive?: boolean;
  onSort?: (field: string) => void;
  disabled?: boolean;
}

export default function TableHeaderCell({
  label,
  field,
  sortable = true,
  sortIcon = '↕️',
  isSortActive = false,
  onSort,
  disabled = false
}: TableHeaderCellProps) {
  if (!sortable || !onSort) {
    return <th className="table-header-cell">{label}</th>;
  }

  return (
    <th className="table-header-cell">
      <button
        type="button"
        onClick={() => onSort(field)}
        className="sort-header-btn"
        disabled={disabled}
      >
        <span className="sort-label">{label}</span>
        <span 
          className={`sort-icon ${isSortActive ? 'active' : ''}`}
          data-default={!isSortActive}
        >
          {sortIcon}
        </span>
      </button>
    </th>
  );
}