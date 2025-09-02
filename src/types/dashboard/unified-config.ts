/**
 * Unified Dashboard Configuration Types
 * Ensures table columns and search fields share the same structure for consistency
 */

export interface UnifiedFieldConfig {
  key: string;
  label: string;
  type: 'text' | 'number' | 'email' | 'select' | 'date' | 'boolean';
  
  // Table-specific properties
  table?: {
    sortable?: boolean;
    render?: (value: any, row?: any) => React.ReactNode;
    width?: string;
    align?: 'left' | 'center' | 'right';
  };
  
  // Search-specific properties
  search?: {
    searchable?: boolean;
    placeholder?: string;
    options?: { value: any; label: string }[];
    validation?: {
      minLength?: number;
      maxLength?: number;
      pattern?: RegExp;
    };
  };
}

export interface EntityUnifiedConfig<TEntity = any, TCreateDto = any, TUpdateDto = any> {
  // Basic entity information
  entity: string;
  displayName: string;
  entityName: string;
  entityNamePlural: string;
  
  // Unified fields configuration - single source of truth
  fields: UnifiedFieldConfig[];
  
  // Entity capabilities
  capabilities: {
    crud: Array<'create' | 'read' | 'update' | 'delete'>;
    search: Array<'auto' | 'simple' | 'advanced'>;
    export: boolean;
  };
  
  // API configuration
  api: {
    baseEndpoint: string;
    endpoints: {
      list: string;
      create: string;
      read: string;
      update: string;
      delete: string;
      search: string;
      filter: string;
      export?: string;
    };
  };
  
  // UI configuration
  ui: {
    defaultSort: { field: string; direction: 'ASC' | 'DESC' };
    pageSize: number;
    autoSearchField: string;
    autoSearchPlaceholder: string;
    breadcrumbs: string[];
    csvFilename: string;
  };
  
  // Actions configuration
  actions: Array<{
    key: string;
    label: string;
    variant: 'ver' | 'editar' | 'eliminar' | 'custom';
    handler: string;
    condition?: (row: TEntity) => boolean;
  }>;
}

/**
 * Helper functions to extract configurations from unified config
 */

// Extract table columns from unified fields
export const getTableColumns = (fields: UnifiedFieldConfig[]) => {
  return fields.map(field => ({
    key: field.key,
    label: field.label,
    type: field.type,
    sortable: field.table?.sortable ?? true,
    render: field.table?.render,
    width: field.table?.width,
    align: field.table?.align ?? 'left'
  }));
};

// Extract search fields from unified fields
export const getSearchFields = (fields: UnifiedFieldConfig[]) => {
  return fields
    .filter(field => field.search?.searchable !== false) // Include by default unless explicitly disabled
    .map(field => ({
      key: field.key,
      label: field.label,
      type: field.type,
      placeholder: field.search?.placeholder || `Buscar por ${field.label.toLowerCase()}...`,
      options: field.search?.options,
      validation: field.search?.validation
    }));
};

// Extract auto-search fields (text fields only)
export const getAutoSearchFields = (fields: UnifiedFieldConfig[]) => {
  return fields
    .filter(field => 
      (field.type === 'text' || field.type === 'email') && 
      field.search?.searchable !== false
    )
    .map(field => field.key);
};