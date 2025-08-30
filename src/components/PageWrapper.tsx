'use client';

import { ReactNode } from 'react';

export interface PageWrapperProps {
  title: string;
  children: ReactNode;
  showSearch?: boolean;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  filters?: ReactNode;
  breadcrumbs?: string[];
}

export default function PageWrapper({
  title,
  children,
  showSearch = false,
  onSearchChange,
  searchPlaceholder = "🔎 Buscar...",
  filters,
  breadcrumbs
}: PageWrapperProps) {
  return (
    <div className="main-content">
      {breadcrumbs && (
        <div className="breadcrumbs">
          {breadcrumbs.map((crumb, index) => (
            <span key={index}>
              {crumb}
              {index < breadcrumbs.length - 1 && ' > '}
            </span>
          ))}
        </div>
      )}

      <h1 className="page-title">{title}</h1>

      {(showSearch || filters) && (
        <div className="filters-container">
          {showSearch && (
            <input
              type="text"
              placeholder={searchPlaceholder}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="search-input"
            />
          )}
          
          {filters && (
            <div className="filters-group">
              {filters}
            </div>
          )}
        </div>
      )}

      <div>
        {children}
      </div>
    </div>
  );
}