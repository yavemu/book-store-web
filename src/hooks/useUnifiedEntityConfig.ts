/**
 * Custom hook for consuming unified entity configurations
 * Ensures consistency between table and search components
 */

import { useMemo } from 'react';
import { EntityUnifiedConfig, getTableColumns, getSearchFields, getAutoSearchFields } from '@/types/dashboard/unified-config';

export function useUnifiedEntityConfig<TEntity = any, TCreateDto = any, TUpdateDto = any>(
  config: EntityUnifiedConfig<TEntity, TCreateDto, TUpdateDto>
) {
  const tableConfig = useMemo(() => {
    const columns = getTableColumns(config.fields);
    
    return {
      columns,
      actions: config.actions,
      defaultSort: config.ui.defaultSort,
      pageSize: config.ui.pageSize,
    };
  }, [config]);

  const searchConfig = useMemo(() => {
    const searchFields = getSearchFields(config.fields);
    const autoSearchFields = getAutoSearchFields(config.fields);
    
    return {
      searchFields,
      autoSearchFields,
      autoSearchField: config.ui.autoSearchField,
      autoSearchPlaceholder: config.ui.autoSearchPlaceholder,
    };
  }, [config]);

  const uiConfig = useMemo(() => ({
    displayName: config.displayName,
    entityName: config.entityName,
    entityNamePlural: config.entityNamePlural,
    breadcrumbs: config.ui.breadcrumbs,
    csvFilename: config.ui.csvFilename,
  }), [config]);

  const apiConfig = useMemo(() => config.api, [config]);
  const capabilities = useMemo(() => config.capabilities, [config]);

  return {
    tableConfig,
    searchConfig,
    uiConfig,
    apiConfig,
    capabilities,
    rawConfig: config,
  };
}

/**
 * Hook for getting table-only configuration
 */
export function useTableConfig<TEntity = any, TCreateDto = any, TUpdateDto = any>(
  config: EntityUnifiedConfig<TEntity, TCreateDto, TUpdateDto>
) {
  const { tableConfig } = useUnifiedEntityConfig(config);
  return tableConfig;
}

/**
 * Hook for getting search-only configuration
 */
export function useSearchConfig<TEntity = any, TCreateDto = any, TUpdateDto = any>(
  config: EntityUnifiedConfig<TEntity, TCreateDto, TUpdateDto>
) {
  const { searchConfig } = useUnifiedEntityConfig(config);
  return searchConfig;
}