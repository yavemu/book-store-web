'use client';

import React from 'react';
import Button from '../ui/Button';

interface DashboardHeaderProps {
  title: string;
  onCreateClick?: () => void;
  canCreate?: boolean;
  isLoading?: boolean;
  totalItems?: number;
  currentOperation?: string;
  entityName?: string;
  children?: React.ReactNode;
}

export default function DashboardHeader({
  title,
  onCreateClick,
  canCreate = false,
  isLoading = false,
  totalItems = 0,
  currentOperation = 'list',
  entityName = '',
  children
}: DashboardHeaderProps) {
  
  // Operation display names
  const operationNames = {
    list: 'Listado completo',
    search: 'Búsqueda por término',
    filter: 'Filtrado por criterios',
    'advanced-filter': 'Filtros avanzados'
  };

  const operationName = operationNames[currentOperation as keyof typeof operationNames] || currentOperation;

  return (
    <div className="dashboard-header">
      <div className="header-main">
        <div className="header-left">
          <div className="header-title-section">
            <h1 className="dashboard-title">{title}</h1>
            
            {/* Operation and count indicator */}
            <div className="operation-indicator">
              <span className="operation-type">{operationName}</span>
              {totalItems > 0 && (
                <span className="items-count">
                  ({totalItems} {totalItems === 1 ? entityName.toLowerCase() : entityName.toLowerCase() + 's'})
                </span>
              )}
              {isLoading && (
                <span className="loading-indicator">🔄</span>
              )}
            </div>
          </div>

          {/* Search input if provided as children */}
          {children}
        </div>

        <div className="header-right">
          {/* Create Button */}
          {canCreate && onCreateClick && (
            <Button
              onClick={onCreateClick}
              variant="primary"
              disabled={isLoading}
              className="create-btn"
            >
              ➕ Crear {entityName}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}