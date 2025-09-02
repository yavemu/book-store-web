"use client";

import React, { useRef } from 'react';
import { useTablePagination, PaginationMeta, PaginationParams } from '@/hooks/table/useTablePagination';
import { useTableSorting, SortConfig } from '@/hooks/table/useTableSorting';
import { useTableActions, TableAction } from '@/hooks/table/useTableActions';
import { useTableSearch } from '@/hooks/table/useTableSearch';
import { useResponsiveTable, ResponsiveColumn, BreakpointSize } from '@/hooks/table/useResponsiveTable';

import TableHeader from './TableHeader';
import TableSearch from './TableSearch';
import TableCreateButton from './TableCreateButton';
import TableHeaderCell from './TableHeaderCell';
import ResponsiveTableActions from './ResponsiveTableActions';
import TablePagination from './TablePagination';
import TableInfo from './TableInfo';
import TableLoadingRow from './TableLoadingRow';

// Componentes de celda responsivos
import AdaptiveTextCell from './cells/AdaptiveTextCell';
import CompactStatusCell from './cells/CompactStatusCell';
import CompactDateCell from './cells/CompactDateCell';

interface ResponsiveDynamicTableProps {
  // Data props
  data: any[];
  columns: ResponsiveColumn[];
  meta?: any;
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
  className?: string;
  
  // Responsive props
  enableHorizontalScroll?: boolean;
  showHiddenColumnsButton?: boolean;
}

export default function ResponsiveDynamicTable({
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
  className = '',

  // Responsive props
  enableHorizontalScroll = true,
  showHiddenColumnsButton = true
}: ResponsiveDynamicTableProps) {

  const containerRef = useRef<HTMLDivElement>(null);

  // Hook responsivo principal
  const responsive = useResponsiveTable({
    columns,
    containerRef
  });

  // Hooks de funcionalidad
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

  // Metadata segura
  const safeMeta = getSafePaginationMeta(meta, data, paginationParams);
  const hasApiMeta = Boolean(meta);
  const showLoadingOverlay = loading && data.length > 0;

  // Handler para cambio de página
  const onPageChangeHandler = (page: number) => {
    handlePageChange(page);
  };

  // Renderizar celda con componente adaptativo basado en breakpoint
  const renderAdaptiveCell = (column: ResponsiveColumn, value: any, record: any) => {
    const maxTextLength = responsive.getMaxTextLength();

    if (column.render) {
      return column.render(value, record);
    }

    // Auto-detectar tipo de dato y usar componente apropiado
    if (typeof value === 'boolean') {
      return (
        <CompactStatusCell 
          isActive={value} 
          showText={!responsive.isMobile}
          size={responsive.isMobile ? 'sm' : 'md'}
        />
      );
    }

    if (value && (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}/))) {
      return (
        <CompactDateCell 
          date={value} 
          format={responsive.isMobile ? 'short' : 'relative'}
        />
      );
    }

    if (typeof value === 'string' || typeof value === 'number') {
      return (
        <AdaptiveTextCell 
          text={String(value)}
          maxLength={maxTextLength}
          expandable={!responsive.isMobile}
        />
      );
    }

    return String(value || '-');
  };

  // Renderizar contenido de la tabla
  const renderTableContent = () => {
    if (data.length === 0) {
      if (loading) {
        return (
          <TableLoadingRow 
            columnsCount={responsive.visibleColumns.length} 
            rowsCount={3} 
          />
        );
      }
      
      return (
        <tr>
          <td colSpan={responsive.visibleColumns.length + 1} className="no-data-text">
            No hay datos disponibles
          </td>
        </tr>
      );
    }

    return data.map((record, index) => (
      <tr key={record.id || index}>
        {responsive.visibleColumns.map((column) => (
          <td 
            key={column.key}
            style={{ 
              width: responsive.getColumnWidth()(column),
              maxWidth: responsive.getColumnWidth()(column)
            }}
            className="table-cell-responsive"
          >
            {renderAdaptiveCell(column, record[column.key], record)}
          </td>
        ))}
        <td style={{ width: '120px' }} className="table-actions-cell">
          <ResponsiveTableActions
            record={record}
            actions={actions}
            getButtonClassName={getButtonClassName}
            compact={responsive.isMobile}
            maxVisibleActions={responsive.isMobile ? 1 : 2}
          />
        </td>
      </tr>
    ));
  };

  // Clase CSS para scroll horizontal
  const tableContainerClass = enableHorizontalScroll && responsive.needsHorizontalScroll
    ? 'table-scroll-container'
    : 'table-fit-container';

  return (
    <div ref={containerRef} className={`responsive-table-container ${className}`}>
      {/* Header responsivo */}
      <TableHeader 
        showSearch={showSearch}
        showCreateButton={showCreateButton}
        showStats={!responsive.isMobile}
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

      {/* Indicador de columnas ocultas */}
      {responsive.hiddenColumns.length > 0 && showHiddenColumnsButton && (
        <div className="hidden-columns-indicator">
          <span className="text-sm text-gray-600">
            {responsive.hiddenColumns.length} columnas ocultas en esta vista
          </span>
          <button 
            className="text-blue-600 hover:text-blue-800 text-sm ml-2"
            onClick={() => {
              // TODO: Implementar modal con columnas ocultas
              console.log('Mostrar columnas ocultas:', responsive.hiddenColumns);
            }}
          >
            Ver todas
          </button>
        </div>
      )}

      {/* Formulario si está visible */}
      {showForm && formComponent && (
        <div className="card-boutique form-card">
          <div className="card-content">
            {formComponent}
          </div>
        </div>
      )}

      {/* Tabla principal con scroll adaptativo */}
      <div className="card-boutique">
        <div className={tableContainerClass}>
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
            
            <table className="table-dashboard responsive-table">
              <thead>
                <tr>
                  {responsive.visibleColumns.map((column) => (
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
                  <th style={{ width: '120px' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {renderTableContent()}
              </tbody>
            </table>
          </div>
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