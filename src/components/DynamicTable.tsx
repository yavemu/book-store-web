'use client';

import TablePagination from "@/components/Table/TablePagination";
import { useState } from "react";

export interface TableColumn {
  key: string;
  label: string;
  render?: (value: any, record: any) => React.ReactNode;
  sortable?: boolean;
}

export interface SortConfig {
  field: string;
  direction: "ASC" | "DESC";
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: "ASC" | "DESC";
}

export interface TableAction {
  label: string;
  onClick: (record: any) => void;
  variant?: "primary" | "secondary" | "danger";
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
  showSearch?: boolean;
  searchPlaceholder?: string;
  onSearchChange?: (value: string) => void;
  sortConfig?: SortConfig;
  onSortChange?: (field: string, direction: "ASC" | "DESC") => void;
  paginationParams?: PaginationParams;
  onClearPaginationParam?: (param: keyof PaginationParams) => void;
  showPaginationInfo?: boolean;
  // New props for quick search
  quickSearchComponent?: React.ReactNode;
}

/**
 * DynamicTable - Reusable table component with global meta mapping
 *
 * Automatically handles API responses from all endpoints:
 * - getAll, filter, filter-advance, search
 *
 * Maps API meta structure to consistent internal format:
 * API: { total, page, limit, totalPages, hasNext, hasPrev }
 * Internal: { totalItems, currentPage, itemsPerPage, totalPages, hasNextPage, hasPrevPage }
 *
 * Provides safe fallbacks when API meta is unavailable.
 */
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
  entityName = "registro",
  showForm = false,
  formComponent,
  onFormToggle,
  isEditing = false,
  editingRecord,
  onEditClick,
  showSearch = false,
  searchPlaceholder = `Buscar ${entityName}...`,
  onSearchChange,
  sortConfig,
  onSortChange,
  paginationParams,
  onClearPaginationParam,
  showPaginationInfo = true,
  quickSearchComponent,
}: DynamicTableProps) {
  const [currentPage, setCurrentPage] = useState(meta?.currentPage || 1);

  // Global, robust meta mapping for all API endpoints (getAll, filter, filter-advance, search)
  // This handles the standard API meta structure that all endpoints use
  const mapApiMetaToPaginationMeta = (apiMeta: any): PaginationMeta | null => {
    if (!apiMeta) return null;

    // Extract values with multiple fallback options to ensure compatibility
    const totalItems = Number(apiMeta.total || apiMeta.totalItems || 0);
    const currentPage = Number(apiMeta.page || apiMeta.currentPage || 1);
    const itemsPerPage = Number(apiMeta.limit || apiMeta.itemsPerPage || apiMeta.size || 10);
    const totalPages = Number(apiMeta.totalPages || apiMeta.pages || Math.ceil(totalItems / itemsPerPage) || 1);

    // Handle boolean values with multiple possible formats
    const hasNextPage = Boolean(
      apiMeta.hasNext !== undefined
        ? apiMeta.hasNext
        : apiMeta.hasNextPage !== undefined
        ? apiMeta.hasNextPage
        : apiMeta.hasMore !== undefined
        ? apiMeta.hasMore
        : currentPage < totalPages,
    );

    const hasPrevPage = Boolean(
      apiMeta.hasPrev !== undefined
        ? apiMeta.hasPrev
        : apiMeta.hasPrevPage !== undefined
        ? apiMeta.hasPrevPage
        : apiMeta.hasPrevious !== undefined
        ? apiMeta.hasPrevious
        : currentPage > 1,
    );

    return {
      totalItems,
      currentPage,
      itemsPerPage,
      totalPages,
      hasNextPage,
      hasPrevPage,
    };
  };

  // Get the properly mapped meta from API response
  const mappedMeta = mapApiMetaToPaginationMeta(meta);

  // Ensure we always have consistent meta values for all dashboards
  // Priority: 1) Mapped API meta, 2) Smart fallback based on actual data and pagination params
  const effectiveMeta: PaginationMeta = mappedMeta || {
    totalItems: data.length,
    currentPage: paginationParams?.page || 1,
    itemsPerPage: paginationParams?.limit || 10,
    totalPages: Math.max(1, Math.ceil(data.length / (paginationParams?.limit || 10))),
    hasNextPage: data.length > (paginationParams?.limit || 10),
    hasPrevPage: (paginationParams?.page || 1) > 1,
  };

  // Safety validation to ensure all values are valid numbers
  const safeEffectiveMeta: PaginationMeta = {
    totalItems: Math.max(0, effectiveMeta.totalItems || 0),
    currentPage: Math.max(1, effectiveMeta.currentPage || 1),
    itemsPerPage: Math.max(1, effectiveMeta.itemsPerPage || 10),
    totalPages: Math.max(1, effectiveMeta.totalPages || 1),
    hasNextPage: Boolean(effectiveMeta.hasNextPage),
    hasPrevPage: Boolean(effectiveMeta.hasPrevPage),
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    onPageChange?.(page);
  };

  // Don't show loading overlay if there's no data yet (first load)
  const showLoadingOverlay = loading && data.length > 0;

  // Handle sorting
  const handleSort = (field: string) => {
    if (!onSortChange) return;

    // If clicking the same field, toggle direction
    if (sortConfig?.field === field) {
      const newDirection = sortConfig.direction === "ASC" ? "DESC" : "ASC";
      onSortChange(field, newDirection);
    } else {
      // If clicking a different field, start with ASC
      onSortChange(field, "ASC");
    }
  };

  // Get sort icon for a field
  const getSortIcon = (field: string) => {
    const isActive = sortConfig && sortConfig.field === field;

    if (!isActive) {
      return "↕️"; // Default sort icon
    }

    return sortConfig.direction === "ASC" ? "↑" : "↓";
  };

  // Check if sort is active for styling
  const isSortActive = (field: string) => {
    return sortConfig && sortConfig.field === field && !(field === "createdAt" && sortConfig.direction === "DESC");
  };

  // Render pagination info component
  const renderPaginationInfo = () => {
    if (!showPaginationInfo) return null;

    // Use meta values if available, otherwise fallback to paginationParams
    const currentPage = meta?.currentPage || paginationParams?.page || 1;
    const currentLimit = meta?.itemsPerPage || paginationParams?.limit || 10;
    const currentSortBy = paginationParams?.sortBy || "createdAt";
    const currentSortOrder = paginationParams?.sortOrder || "DESC";

    // Get the display name for the sort field from columns
    const sortColumn = columns.find((col) => col.key === currentSortBy);
    const sortDisplayName = sortColumn ? sortColumn.label : currentSortBy;

    const params = [];

    // Always show parameters when we have API data
    if (meta || paginationParams) {
      // Show current page if not the first page
      if (currentPage > 1) {
        params.push({
          key: "page" as const,
          label: "Página actual",
          value: currentPage,
          displayValue: `${currentPage}`,
        });
      }

      // Show sorting if it's not the default OR if we have actual data
      if (currentSortBy !== "createdAt" || currentSortOrder !== "DESC" || (meta && data && data.length > 0)) {
        params.push({
          key: "sortBy" as const,
          label: "Ordenar por",
          value: currentSortBy,
          displayValue: `${sortDisplayName} (${currentSortOrder})`,
        });
      }

      // Don't show limit parameter in applied parameters as per user request
    }

    if (params.length === 0) return null;

    return (
      <div>
        <div>
          <span>📊 Parámetros aplicados:</span>
        </div>
        <div>
          {params.map((param) => (
            <div key={param.key}>
              <span>{param.label}:</span>
              <span>{param.displayValue}</span>
              {onClearPaginationParam && (
                <button
                  type="button"
                  onClick={() => onClearPaginationParam(param.key)}
                  title={`Eliminar ${param.label.toLowerCase()}`}
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderPagination = () => {
    return <TablePagination meta={safeEffectiveMeta} onPageChange={handlePageChange} disabled={!mappedMeta} />;
  };

  const renderActions = (record: any) => {
    // Always use default actions unless custom actions are provided
    const defaultActions = [
      {
        label: "Ver",
        onClick: (record: any) => console.log("Ver", record),
        variant: "ver" as const,
      },
      {
        label: "Editar",
        onClick: (record: any) => {
          if (onEditClick) {
            onEditClick(record);
          } else {
            console.log("Editar", record);
          }
        },
        variant: "editar" as const,
      },
      {
        label: "Eliminar",
        onClick: (record: any) => {
          if (confirm(`¿Estás seguro de eliminar este ${entityName}?`)) {
            console.log("Eliminar", record);
          }
        },
        variant: "eliminar" as const,
      },
    ];

    // Use custom actions if provided, otherwise use defaults
    const actionsToRender = actions && actions.length > 0 ? actions : defaultActions;

    return (
      <div>
        {actionsToRender.map((action, index) => (
          <button key={index} onClick={() => action.onClick(record)}>
            {action.label}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div>
      {/* Pagination Info */}
      {renderPaginationInfo()}

      {/* Form positioned between applied params and create button */}
      {showForm && formComponent && (
        <div>
          <div>{formComponent}</div>
        </div>
      )}

      <div>
        {(showSearch || meta) && (
          <div>
            {showSearch && (
              <input
                type="text"
                placeholder={searchPlaceholder}
                onChange={(e) => onSearchChange?.(e.target.value)}
                style={{
                  display: "block",
                  visibility: "visible",
                  opacity: 1,
                  zIndex: 10,
                }}
              />
            )}

            <div>
              <div>
                <span>Total:</span>
                <span>{safeEffectiveMeta.totalItems}</span>
              </div>
              <div>
                <span>Páginas:</span>
                <span>{safeEffectiveMeta.totalPages}</span>
              </div>
            </div>
          </div>
        )}

        <div>
          {quickSearchComponent && (
            <div>
              {quickSearchComponent}
            </div>
          )}
          
          {showCreateButton && (
            <div>
              <button
                onClick={() => {
                  if (showForm) {
                    onFormToggle?.();
                  } else {
                    onCreateClick?.();
                  }
                }}
              >
                {showForm
                  ? isEditing
                    ? `✏️ Editando ${entityName}`
                    : `🔧 Creando ${entityName}`
                  : `${createButtonLabel || `+ Crear ${entityName}`}`}
              </button>
            </div>
          )}
        </div>
      </div>

      <div>
        <div style={{ position: "relative" }}>
          {showLoadingOverlay && (
            <div>
              <div>⏳</div>
              Actualizando datos...
            </div>
          )}

          <table>
            <thead>
              <tr>
                {columns.map((column) => (
                  <th key={column.key}>
                    {column.sortable !== false ? (
                      <button type="button" onClick={() => handleSort(column.key)} disabled={!onSortChange}>
                        <span>{column.label}</span>
                        <span>
                          {getSortIcon(column.key)}
                        </span>
                      </button>
                    ) : (
                      column.label
                    )}
                  </th>
                ))}
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                loading ? (
                  // Show skeleton rows for first load
                  Array.from({ length: 3 }).map((_, index) => (
                    <tr key={`skeleton-${index}`}>
                      {columns.map((column, colIndex) => (
                        <td key={column.key}>
                          <div>
                            Cargando...
                          </div>
                        </td>
                      ))}
                      <td>
                        <div>Cargando...</div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={columns.length + 1}>
                      No hay datos disponibles
                    </td>
                  </tr>
                )
              ) : (
                data.map((record, index) => (
                  <tr key={record.id || index}>
                    {columns.map((column) => (
                      <td key={column.key}>{column.render ? column.render(record[column.key], record) : record[column.key]}</td>
                    ))}
                    <td>{renderActions(record)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {renderPagination()}

        
      </div>
    </div>
  );
}