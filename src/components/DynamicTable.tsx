'use client';

import { useState } from 'react';

export interface TableColumn {
  key: string;
  label: string;
  render?: (value: any, record: any) => React.ReactNode;
}

export interface TableAction {
  label: string;
  onClick: (record: any) => void;
  variant?: 'primary' | 'secondary' | 'danger';
}

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface DynamicTableProps {
  data: any[];
  columns: TableColumn[];
  meta?: PaginationMeta;
  loading?: boolean;
  onPageChange?: (page: number) => void;
  actions?: TableAction[];
  showCreateButton?: boolean;
  onCreateClick?: () => void;
  createButtonLabel?: string;
  entityName?: string;
  showForm?: boolean;
  formComponent?: React.ReactNode;
  onFormToggle?: () => void;
  isEditing?: boolean;
  editingRecord?: any;
  onEditClick?: (record: any) => void;
}

export default function DynamicTable({
  data,
  columns,
  meta,
  loading,
  onPageChange,
  actions = [],
  showCreateButton = false,
  onCreateClick,
  createButtonLabel,
  entityName = 'registro',
  showForm = false,
  formComponent,
  onFormToggle,
  isEditing = false,
  editingRecord,
  onEditClick
}: DynamicTableProps) {
  const [currentPage, setCurrentPage] = useState(meta?.currentPage || 1);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    onPageChange?.(page);
  };

  if (loading) {
    return <div className="loading-text">Cargando...</div>;
  }

  const renderPagination = () => {
    if (!meta || meta.totalPages <= 1) return null;

    const pages = [];
    for (let i = 1; i <= meta.totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`pagination-btn ${i === currentPage ? 'active' : ''}`}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="pagination-container">
        <button
          onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
          disabled={!meta.hasPrevPage}
          className="pagination-btn"
        >
          Anterior
        </button>
        {pages}
        <button
          onClick={() => handlePageChange(Math.min(meta.totalPages, currentPage + 1))}
          disabled={!meta.hasNextPage}
          className="pagination-btn"
        >
          Siguiente
        </button>
      </div>
    );
  };

  const renderActions = (record: any) => {
    // Always use default actions unless custom actions are provided
    const defaultActions = [
      {
        label: 'Ver',
        onClick: (record: any) => console.log('Ver', record),
        variant: 'ver' as const
      },
      {
        label: 'Editar',
        onClick: (record: any) => {
          if (onEditClick) {
            onEditClick(record);
          } else {
            console.log('Editar', record);
          }
        },
        variant: 'editar' as const
      },
      {
        label: 'Eliminar',
        onClick: (record: any) => {
          if (confirm(`¿Estás seguro de eliminar este ${entityName}?`)) {
            console.log('Eliminar', record);
          }
        },
        variant: 'eliminar' as const
      }
    ];

    // Use custom actions if provided, otherwise use defaults
    const actionsToRender = actions && actions.length > 0 ? actions : defaultActions;

    const getButtonClassName = (variant?: string) => {
      switch (variant) {
        case 'primary': return 'btn-action-ver';
        case 'secondary': return 'btn-action-editar';
        case 'danger': return 'btn-action-eliminar';
        default: return 'btn-action-ver';
      }
    };

    return (
      <div className="table-actions">
        {actionsToRender.map((action, index) => (
          <button
            key={index}
            onClick={() => action.onClick(record)}
            className={getButtonClassName(action.variant)}
          >
            {action.label}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="table-container">
      <div className="table-header">
        {meta && (
          <div className="table-stats">
            <div className="stat-item">
              <span className="stat-label">Total:</span>
              <span className="stat-value">{meta.totalItems}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Páginas:</span>
              <span className="stat-value">{meta.totalPages}</span>
            </div>
          </div>
        )}
        
        <div className="header-right">
          {showCreateButton && (
            <div className="create-section">
              <button
                onClick={onFormToggle || onCreateClick}
                className="btn-create"
              >
                {showForm ? (isEditing ? `✏️ Editando ${entityName}` : `🔧 Creando ${entityName}`) : `${createButtonLabel || `+ Crear ${entityName}`}`}
              </button>
            </div>
          )}
        </div>
      </div>

      {showForm && formComponent && (
        <div className="card-boutique form-card">
          <div className="card-content">
            {formComponent}
          </div>
        </div>
      )}

      <div className="card-boutique">
        <div className="card-content">
          <table className="table-dashboard">
            <thead>
              <tr>
                {columns.map((column) => (
                  <th key={column.key}>
                    {column.label}
                  </th>
                ))}
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + 1}
                    className="no-data-text"
                  >
                    No hay datos disponibles
                  </td>
                </tr>
              ) : (
                data.map((record, index) => (
                  <tr key={record.id || index}>
                    {columns.map((column) => (
                      <td key={column.key}>
                        {column.render
                          ? column.render(record[column.key], record)
                          : record[column.key]
                        }
                      </td>
                    ))}
                    <td>
                      {renderActions(record)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {renderPagination()}

        {meta && (
          <div className="pagination-info">
            Mostrando {((meta.currentPage - 1) * meta.itemsPerPage) + 1} - {Math.min(meta.currentPage * meta.itemsPerPage, meta.totalItems)} de {meta.totalItems} registros
          </div>
        )}
      </div>
    </div>
  );
}