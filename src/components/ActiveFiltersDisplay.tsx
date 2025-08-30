'use client';

import { SearchFilters, SearchField } from './AdvancedSearchForm';
import { TableColumn } from './DynamicTable';

interface ActiveFiltersDisplayProps {
  filters: SearchFilters;
  searchFields: SearchField[];
  tableColumns: TableColumn[];
  onRemoveFilter: (key: string) => void;
  onClearAll: () => void;
}

export default function ActiveFiltersDisplay({
  filters,
  searchFields,
  tableColumns,
  onRemoveFilter,
  onClearAll
}: ActiveFiltersDisplayProps) {
  const activeFilters = Object.entries(filters).filter(([_, value]) => 
    value !== undefined && value !== null && value !== ''
  );

  if (activeFilters.length === 0) {
    return null;
  }

  // Create a mapping of columns with their filters
  const getColumnFilter = (columnKey: string) => {
    const filterEntry = activeFilters.find(([key]) => key === columnKey);
    return filterEntry ? filterEntry[1] : null;
  };

  const getFieldLabel = (key: string) => {
    if (key === 'startDate') return 'Desde';
    if (key === 'endDate') return 'Hasta';
    const field = searchFields.find(f => f.key === key);
    return field?.label || key;
  };

  const formatFilterValue = (key: string, value: any) => {
    if (key === 'startDate' || key === 'endDate') {
      return new Date(value).toLocaleDateString();
    }
    return String(value);
  };

  // Separate date filters from column filters
  const dateFilters = activeFilters.filter(([key]) => key === 'startDate' || key === 'endDate');
  const columnFilters = activeFilters.filter(([key]) => key !== 'startDate' && key !== 'endDate');

  return (
    <div className="active-filters-display">
      <div className="filters-header">
        <h4 className="filters-title">
          🔍 Filtros Activos ({activeFilters.length})
        </h4>
        <button
          onClick={onClearAll}
          className="clear-all-filters-btn"
          title="Limpiar todos los filtros"
        >
          🗑️ Limpiar Todo
        </button>
      </div>

      {/* Column-aligned filters */}
      {columnFilters.length > 0 && (
        <div className="filters-table">
          <div className="filters-table-header">
            {tableColumns.map((column) => (
              <div key={column.key} className="filter-column-header">
                {column.label}
              </div>
            ))}
            {/* Date columns */}
            <div className="filter-column-header">Fecha Desde</div>
            <div className="filter-column-header">Fecha Hasta</div>
          </div>
          
          <div className="filters-table-row">
            {tableColumns.map((column) => {
              const filterValue = getColumnFilter(column.key);
              return (
                <div key={column.key} className="filter-column-cell">
                  {filterValue ? (
                    <div className="filter-chip">
                      <span className="filter-value">
                        {formatFilterValue(column.key, filterValue)}
                      </span>
                      <button
                        onClick={() => onRemoveFilter(column.key)}
                        className="remove-filter-chip"
                        title={`Eliminar filtro de ${column.label}`}
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <span className="no-filter">—</span>
                  )}
                </div>
              );
            })}
            
            {/* Date filter cells */}
            <div className="filter-column-cell">
              {filters.startDate ? (
                <div className="filter-chip">
                  <span className="filter-value">
                    {formatFilterValue('startDate', filters.startDate)}
                  </span>
                  <button
                    onClick={() => onRemoveFilter('startDate')}
                    className="remove-filter-chip"
                    title="Eliminar filtro de fecha desde"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <span className="no-filter">—</span>
              )}
            </div>
            
            <div className="filter-column-cell">
              {filters.endDate ? (
                <div className="filter-chip">
                  <span className="filter-value">
                    {formatFilterValue('endDate', filters.endDate)}
                  </span>
                  <button
                    onClick={() => onRemoveFilter('endDate')}
                    className="remove-filter-chip"
                    title="Eliminar filtro de fecha hasta"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <span className="no-filter">—</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Compact filter tags for overflow or additional filters */}
      {activeFilters.length > 0 && (
        <div className="filters-tags-compact">
          {activeFilters.map(([key, value]) => (
            <div key={key} className="filter-tag-compact">
              <strong>{getFieldLabel(key)}:</strong>
              <span>{formatFilterValue(key, value)}</span>
              <button
                onClick={() => onRemoveFilter(key)}
                className="remove-filter-compact"
                title={`Eliminar filtro de ${getFieldLabel(key)}`}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}