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
  searchPlaceholder = "Buscar...",
  filters,
  breadcrumbs
}: PageWrapperProps) {
  return (
    <div style={{ padding: '20px' }}>
      {breadcrumbs && (
        <div style={{ marginBottom: '10px', fontSize: '14px', color: '#6c757d' }}>
          {breadcrumbs.map((crumb, index) => (
            <span key={index}>
              {crumb}
              {index < breadcrumbs.length - 1 && ' > '}
            </span>
          ))}
        </div>
      )}

      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: 'bold', 
          margin: '0 0 20px 0',
          color: '#212529'
        }}>
          {title}
        </h1>

        {(showSearch || filters) && (
          <div style={{ 
            display: 'flex', 
            gap: '15px', 
            alignItems: 'center',
            flexWrap: 'wrap'
          }}>
            {showSearch && (
              <div>
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  onChange={(e) => onSearchChange?.(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    border: '1px solid #ced4da',
                    borderRadius: '4px',
                    fontSize: '14px',
                    minWidth: '250px'
                  }}
                />
              </div>
            )}
            
            {filters && (
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                {filters}
              </div>
            )}
          </div>
        )}
      </div>

      <div>
        {children}
      </div>
    </div>
  );
}