'use client';

import { useState } from 'react';
import { EntityUnifiedConfig } from '@/types/dashboard/unified-config';
import { useUnifiedEntityConfig } from '@/hooks/useUnifiedEntityConfig';
import AdvancedSearchForm, { SearchFilters } from '@/components/AdvancedSearchForm';
import DynamicTable from '@/components/DynamicTable';

interface UnifiedDashboardProps<TEntity = any, TCreateDto = any, TUpdateDto = any> {
  config: EntityUnifiedConfig<TEntity, TCreateDto, TUpdateDto>;
  data: TEntity[];
  loading?: boolean;
  totalPages?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  onSort?: (field: string, direction: 'ASC' | 'DESC') => void;
  onSearch?: (filters: SearchFilters) => void;
  onAdvancedFilter?: (filters: SearchFilters) => void;
  onClearFilters?: () => void;
  onView?: (row: TEntity) => void;
  onEdit?: (row: TEntity) => void;
  onCreate?: () => void;
  onDelete?: (row: TEntity) => void;
}

/**
 * Unified Dashboard Component
 * 
 * This component demonstrates the new unified architecture where table columns
 * and search fields are guaranteed to be synchronized through a single configuration.
 * 
 * Key benefits:
 * 1. Single source of truth for field definitions
 * 2. Automatic synchronization between table and search
 * 3. Type safety across all components
 * 4. Reusable across all entities
 * 5. Consistent UI/UX patterns
 */
export default function UnifiedDashboard<TEntity = any, TCreateDto = any, TUpdateDto = any>({
  config,
  data,
  loading = false,
  totalPages = 1,
  currentPage = 1,
  onPageChange,
  onSort,
  onSearch,
  onAdvancedFilter,
  onClearFilters,
  onView,
  onEdit,
  onCreate,
  onDelete,
}: UnifiedDashboardProps<TEntity, TCreateDto, TUpdateDto>) {
  const [filters, setFilters] = useState<SearchFilters>({});
  const [isFiltering, setIsFiltering] = useState(false);

  // Extract configurations using the unified hook
  const { tableConfig, searchConfig, uiConfig, capabilities } = useUnifiedEntityConfig(config);

  const handleSearch = (searchFilters: SearchFilters) => {
    setFilters(searchFilters);
    setIsFiltering(true);
    onSearch?.(searchFilters);
  };

  const handleAdvancedFilter = (searchFilters: SearchFilters) => {
    setFilters(searchFilters);
    setIsFiltering(true);
    onAdvancedFilter?.(searchFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
    setIsFiltering(false);
    onClearFilters?.();
  };

  const handleRowAction = (actionKey: string, row: TEntity) => {
    switch (actionKey) {
      case 'view':
        onView?.(row);
        break;
      case 'edit':
        onEdit?.(row);
        break;
      case 'delete':
        onDelete?.(row);
        break;
      default:
        console.warn(`Unknown action: ${actionKey}`);
    }
  };

  return (
    <div className="unified-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <h1 className="dashboard-title">{uiConfig.displayName}</h1>
        {capabilities.crud.includes('create') && (
          <button 
            onClick={onCreate}
            className="create-button"
            disabled={loading}
          >
            + Crear {uiConfig.entityName}
          </button>
        )}
      </div>

      {/* Breadcrumbs */}
      <nav className="breadcrumbs">
        {uiConfig.breadcrumbs.map((crumb, index) => (
          <span key={index} className="breadcrumb">
            {crumb}
            {index < uiConfig.breadcrumbs.length - 1 && ' / '}
          </span>
        ))}
      </nav>

      {/* Advanced Search - Uses unified fields configuration */}
      {capabilities.search.includes('advanced') && (
        <AdvancedSearchForm
          unifiedFields={config.fields} // Pass unified fields directly
          onSearch={handleSearch}
          onAdvancedFilter={handleAdvancedFilter}
          onClear={handleClearFilters}
          loading={loading}
          entityName={uiConfig.entityNamePlural}
          initialFilters={filters}
          isFiltering={isFiltering}
        />
      )}

      {/* Results Summary */}
      <div className="results-summary">
        <p>
          Mostrando {data.length} {uiConfig.entityNamePlural}
          {Object.keys(filters).length > 0 && ' (filtrados)'}
        </p>
      </div>

      {/* Data Table - Uses unified fields configuration */}
      <DynamicTable
        columns={tableConfig.columns} // Automatically derived from unified config
        data={data}
        loading={loading}
        actions={tableConfig.actions}
        onRowAction={handleRowAction}
        onSort={onSort}
        pagination={{
          currentPage,
          totalPages,
          onPageChange: onPageChange || (() => {}),
        }}
        defaultSort={tableConfig.defaultSort}
      />

      {/* Footer Info */}
      <div className="dashboard-footer">
        <p className="sync-guarantee">
          ✅ Los campos de búsqueda y tabla están automáticamente sincronizados
        </p>
      </div>
    </div>
  );
}

/**
 * Example usage:
 * 
 * ```tsx
 * import { UnifiedDashboard } from '@/components/Dashboard/UnifiedDashboard';
 * import { authorsUnifiedConfig } from '@/config/dashboard';
 * 
 * function AuthorsPage() {
 *   const [authors, setAuthors] = useState([]);
 *   const [loading, setLoading] = useState(false);
 * 
 *   return (
 *     <UnifiedDashboard
 *       config={authorsUnifiedConfig}
 *       data={authors}
 *       loading={loading}
 *       onSearch={(filters) => console.log('Search:', filters)}
 *       onAdvancedFilter={(filters) => console.log('Filter:', filters)}
 *       onView={(author) => console.log('View:', author)}
 *       onEdit={(author) => console.log('Edit:', author)}
 *       onDelete={(author) => console.log('Delete:', author)}
 *     />
 *   );
 * }
 * ```
 */