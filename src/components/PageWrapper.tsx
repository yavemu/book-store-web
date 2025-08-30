'use client';

import { ReactNode } from 'react';
import { useAppSelector } from '@/store/hooks';

export interface PageWrapperProps {
  title: string;
  children: ReactNode;
  showSearch?: boolean;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  filters?: ReactNode;
  breadcrumbs?: string[];
  showCsvDownload?: boolean;
  onCsvDownload?: () => void;
  csvDownloadEnabled?: boolean;
}

export default function PageWrapper({
  title,
  children,
  showSearch = false,
  onSearchChange,
  searchPlaceholder = "🔎 Buscar...",
  filters,
  breadcrumbs,
  showCsvDownload = false,
  onCsvDownload,
  csvDownloadEnabled = false
}: PageWrapperProps) {
  const { user } = useAppSelector((state) => state.auth);
  
  // Handle role as string or object
  const userRole = typeof user?.role === 'string' 
    ? user.role 
    : (typeof user?.role === 'object' && user?.role?.name) 
    ? user.role.name 
    : 'USER';

  // CSV download is only available for admin users
  const canShowCsvDownload = showCsvDownload && userRole === 'ADMIN';
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

      <div className="page-header">
        <h1 className="page-title">{title}</h1>
        {canShowCsvDownload && (
          <button
            onClick={onCsvDownload}
            disabled={!csvDownloadEnabled}
            className={`csv-download-button ${!csvDownloadEnabled ? 'disabled' : ''}`}
            title={csvDownloadEnabled ? 'Descargar CSV' : 'Realiza una búsqueda para habilitar la descarga'}
          >
            📥 CSV
          </button>
        )}
      </div>

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