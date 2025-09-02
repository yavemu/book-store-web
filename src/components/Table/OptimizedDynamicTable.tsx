"use client";

import React from 'react';
import { useTablePagination, PaginationMeta, PaginationParams } from '@/hooks/table/useTablePagination';
import { useTableSorting, SortConfig } from '@/hooks/table/useTableSorting';
import { useTableActions, TableAction } from '@/hooks/table/useTableActions';
import { useTableSearch } from '@/hooks/table/useTableSearch';

import TableHeader from './TableHeader';
import TableSearch from './TableSearch';
import TableCreateButton from './TableCreateButton';
import TableHeaderCell from './TableHeaderCell';
import TableActions from './TableActions';
import TablePagination from './TablePagination';
import TableInfo from './TableInfo';
import TableLoadingRow from './TableLoadingRow';

export interface TableColumn {
  key: string;
  label: string;
  render?: (value: any, record: any) => React.ReactNode;
  sortable?: boolean;
}

interface OptimizedDynamicTableProps {
  // Data props
  data: any[];
  columns: TableColumn[];
  meta?: any; // API meta response
  loading?: boolean;

  // Pagination props
  onPageChange?: (page: number) => void;
  paginationParams?: PaginationParams;

  // Sorting props
  sortConfig?: SortConfig;
  onSortChange?: (field: string, direction: 'ASC' | 'DESC') => void;

  // Actions props
  actions?: TableAction[];
  onEdit?: (record: any) => void;
  onDelete?: (record: any) => void;
  onView?: (record: any) => void;

  // Create/Form props
  showCreateButton?: boolean;
  onCreateClick?: () => void;
  createButtonLabel?: string;
  showForm?: boolean;
  formComponent?: React.ReactNode;
  onFormToggle?: () => void;
  isEditing?: boolean;

  // Search props
  showSearch?: boolean;
  searchPlaceholder?: string;
  onSearchChange?: (value: string) => void;

  // Display props
  entityName?: string;
  showStats?: boolean;
  className?: string;
}

export default function OptimizedDynamicTable({
  // Data props
  data,
  columns,
  meta,
  loading = false,

  // Pagination props
  onPageChange,
  paginationParams,

  // Sorting props
  sortConfig,
  onSortChange,

  // Actions props
  actions: customActions,
  onEdit,
  onDelete,
  onView,

  // Create/Form props
  showCreateButton = false,
  onCreateClick,
  createButtonLabel,
  showForm = false,
  formComponent,
  onFormToggle,
  isEditing = false,

  // Search props
  showSearch = false,
  searchPlaceholder,
  onSearchChange,

  // Display props
  entityName = 'registro',
  showStats = true,
  className = ''
}: OptimizedDynamicTableProps) {

  // Hooks para funcionalidades específicas
  const { getSafePaginationMeta, handlePageChange } = useTablePagination({
    onPageChange
  });

  const { handleSort, getSortIcon, isSortActive } = useTableSorting({
    initialSort: sortConfig,
    onSortChange
  });

  const { actions, getButtonClassName } = useTableActions({
    entityName,
    customActions,
    onEdit,
    onDelete,
    onView
  });

  const { searchValue, handleSearchChange } = useTableSearch({
    placeholder: searchPlaceholder || `Buscar ${entityName}...`,
    onSearchChange
  });

  // Obtener metadata segura
  const safeMeta = getSafePaginationMeta(meta, data, paginationParams);
  const hasApiMeta = Boolean(meta);
  const showLoadingOverlay = loading && data.length > 0;

  // Handler para cambio de página
  const onPageChangeHandler = (page: number) => {
    handlePageChange(page);
  };

  // Render del contenido de la tabla
  const renderTableContent = () => {
    if (data.length === 0) {
      if (loading) {
        return (
          <TableLoadingRow 
            columnsCount={columns.length} 
            rowsCount={3} 
          />
        );
      }
      
      return (
        <tr>
          <td colSpan={columns.length + 1} className="no-data-text">
            No hay datos disponibles
          </td>
        </tr>
      );
    }

    return data.map((record, index) => (
      <tr key={record.id || index}>
        {columns.map((column) => (
          <td key={column.key}>
            {column.render
              ? column.render(record[column.key], record)
              : record[column.key] || '-'
            }
          </td>
        ))}
        <td>
          <TableActions
            record={record}
            actions={actions}
            getButtonClassName={getButtonClassName}
          />
        </td>
      </tr>
    ));
  };

  return (
    <div className={`table-container ${className}`}>
      {/* Header con búsqueda y botón de crear */}
      <TableHeader 
        showSearch={showSearch}
        showCreateButton={showCreateButton}
        showStats={showStats}
        totalItems={safeMeta.totalItems}
        totalPages={safeMeta.totalPages}
      >
        {showSearch && (
          <TableSearch
            value={searchValue}
            placeholder={searchPlaceholder || `Buscar ${entityName}...`}
            onChange={handleSearchChange}
            disabled={loading}
          />
        )}
        
        {showCreateButton && (
          <TableCreateButton
            entityName={entityName}
            onClick={() => {
              if (showForm) {
                onFormToggle?.();
              } else {
                onCreateClick?.();
              }
            }}
            isFormVisible={showForm}
            isEditing={isEditing}
            customLabel={createButtonLabel}
            disabled={loading}
          />
        )}
      </TableHeader>

      {/* Formulario si está visible */}
      {showForm && formComponent && (
        <div className="card-boutique form-card">
          <div className="card-content">
            {formComponent}
          </div>
        </div>
      )}

      {/* Tabla principal */}
      <div className="card-boutique">
        <div 
          className={`card-content ${showLoadingOverlay ? 'table-loading-overlay' : ''}`} 
          style={{ position: 'relative' }}
        >
          {showLoadingOverlay && (
            <div className="table-loading-indicator">
              <div className="table-loading-spinner" />
              Actualizando datos...
            </div>
          )}
          
          <table className="table-dashboard">
            <thead>
              <tr>
                {columns.map((column) => (
                  <TableHeaderCell
                    key={column.key}
                    label={column.label}
                    field={column.key}
                    sortable={column.sortable !== false}
                    sortIcon={getSortIcon(column.key)}
                    isSortActive={isSortActive(column.key)}
                    onSort={handleSort}
                    disabled={!onSortChange || loading}
                  />
                ))}
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {renderTableContent()}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {hasApiMeta && (
          <TablePagination
            meta={safeMeta}
            onPageChange={onPageChangeHandler}
            disabled={loading}
          />
        )}

        {/* Información de registros */}
        <TableInfo meta={safeMeta} />
      </div>
    </div>
  );
}