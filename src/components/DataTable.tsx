'use client';

import React from 'react';
import Button from './ui/Button';

interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: any, record: any, index: number) => React.ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

interface DataTableProps<T = any> {
  data: T[];
  columns: TableColumn[];
  loading?: boolean;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  onSort?: (column: string) => void;
  onView?: (record: T, index: number) => void;
  onEdit?: (record: T, index: number) => void;
  onDelete?: (record: T, index: number) => void;
  capabilities?: {
    crud: string[];
    search?: string[];
    export?: boolean;
  };
  emptyMessage?: string;
  className?: string;
}

export default function DataTable<T = any>({
  data,
  columns,
  loading = false,
  sortBy,
  sortOrder,
  onSort,
  onView,
  onEdit,
  onDelete,
  capabilities = { crud: ['read'] },
  emptyMessage = 'No hay datos disponibles',
  className = ''
}: DataTableProps<T>) {
  
  // Check CRUD capabilities
  const canView = capabilities.crud.includes('read');
  const canEdit = capabilities.crud.includes('update');  
  const canDelete = capabilities.crud.includes('delete');
  
  // Show actions column if any action is available
  const showActionsColumn = canView || canEdit || canDelete;

  // Handle column sorting
  const handleSort = (column: TableColumn) => {
    if (!column.sortable || !onSort) return;
    onSort(column.key);
  };

  // Get sort indicator for column
  const getSortIndicator = (column: TableColumn) => {
    if (!column.sortable) return null;
    if (sortBy !== column.key) return ' ↕️';
    return sortOrder === 'ASC' ? ' ↑' : ' ↓';
  };

  // Render cell content
  const renderCellContent = (column: TableColumn, record: T, index: number) => {
    const value = (record as any)[column.key];
    
    if (column.render) {
      return column.render(value, record, index);
    }
    
    // Default rendering based on value type
    if (value === null || value === undefined) {
      return <span className="text-gray-400">-</span>;
    }
    
    if (typeof value === 'boolean') {
      return value ? 'Sí' : 'No';
    }
    
    if (typeof value === 'number') {
      return value.toLocaleString();
    }
    
    return String(value);
  };

  // Standardized action buttons configuration
  const getActionButtons = (record: T, index: number) => {
    const buttons = [];
    
    // View button - always first if available
    if (canView && onView) {
      buttons.push({
        key: 'view',
        label: 'Ver',
        icon: '👁️',
        variant: 'secondary' as const,
        onClick: () => onView(record, index),
        title: 'Ver detalles'
      });
    }
    
    // Edit button - second if available  
    if (canEdit && onEdit) {
      buttons.push({
        key: 'edit', 
        label: 'Editar',
        icon: '✏️',
        variant: 'primary' as const,
        onClick: () => onEdit(record, index),
        title: 'Editar registro'
      });
    }
    
    // Delete button - always last if available
    if (canDelete && onDelete) {
      buttons.push({
        key: 'delete',
        label: 'Eliminar', 
        icon: '🗑️',
        variant: 'danger' as const,
        onClick: () => onDelete(record, index),
        title: 'Eliminar registro'
      });
    }
    
    return buttons;
  };

  if (loading) {
    return (
      <div className="table-loading">
        <div className="loading-spinner">🔄</div>
        <p>Cargando datos...</p>
      </div>
    );
  }

  return (
    <div className={`data-table-container ${className}`}>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  style={{ 
                    width: column.width,
                    textAlign: column.align || 'left'
                  }}
                  onClick={() => handleSort(column)}
                  title={column.sortable ? 'Clic para ordenar' : undefined}
                >
                  <div>
                    <span>{column.label}</span>
                    {getSortIndicator(column) && (
                      <span>
                        {getSortIndicator(column)}
                      </span>
                    )}
                  </div>
                </th>
              ))}
              {showActionsColumn && (
                <th>
                  Acciones
                </th>
              )}
            </tr>
          </thead>
          
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td 
                  colSpan={columns.length + (showActionsColumn ? 1 : 0)}
                >
                  <div>
                    📋 {emptyMessage}
                  </div>
                </td>
              </tr>
            ) : (
              data.map((record, index) => (
                <tr key={index}>
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      style={{ 
                        width: column.width,
                        textAlign: column.align || 'left'
                      }}
                    >
                      {renderCellContent(column, record, index)}
                    </td>
                  ))}
                  
                  {showActionsColumn && (
                    <td>
                      <div className="action-buttons">
                        {getActionButtons(record, index).map((button) => (
                          <Button
                            key={button.key}
                            variant={button.variant}
                            size="sm"
                            onClick={button.onClick}
                            title={button.title}
                            className="action-button"
                          >
                            <span className="button-icon">{button.icon}</span>
                            <span className="button-text">{button.label}</span>
                          </Button>
                        ))}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Table Footer with Row Count */}
      <div className="table-footer">
        <div className="row-count">
          {data.length === 0 ? 'Sin registros' : `${data.length} registro${data.length !== 1 ? 's' : ''}`}
        </div>
      </div>
    </div>
  );
}