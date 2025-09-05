// Adapter to convert existing dashboard configurations to unified format

import { DashboardEntityConfig } from '@/types/dashboard/entities';

// Unified configuration interface
export interface UnifiedDashboardConfig {
  entity: string; // Identificador de la entidad para el hook useDashboard
  entityName: string;
  displayName: string;
  defaultPageSize?: number;
  defaultSort?: {
    field: string;
    direction: 'ASC' | 'DESC';
  };
  capabilities: {
    crud: string[];
    search: string[];
    export?: boolean;
  };
  columns: any[];
  searchFields?: any[];
  formFields?: any[];
}

// API service adapter interface
export interface UnifiedApiServiceAdapter<TEntity = any> {
  list: (params: any) => Promise<{data: TEntity[], meta: any}>;
  search: (params: any) => Promise<{data: TEntity[], meta: any}>;
  filter: (params: any) => Promise<{data: TEntity[], meta: any}>;
  quickFilter?: (term: string, params?: any) => Promise<{data: TEntity[], meta: any}>;
  advancedFilter?: (params: any) => Promise<{data: TEntity[], meta: any}>;
  create?: (data: any) => Promise<TEntity>;
  update?: (id: string, data: any) => Promise<TEntity>;
  delete?: (id: string) => Promise<{message: string}>;
  getById?: (id: string) => Promise<TEntity>;
}

// Convert old config to unified format
export function adaptDashboardConfig(oldConfig: any): UnifiedDashboardConfig {
  // Handle different config structures
  const entityName = oldConfig.entityName || oldConfig.entity || 'Entity';
  const displayName = oldConfig.displayName || oldConfig.entityNamePlural || oldConfig.title || entityName + 's';
  
  // Determinar identificador de entidad para búsquedas
  let entity = 'generic';
  if (entityName.toLowerCase().includes('autor') || displayName.toLowerCase().includes('autor')) {
    entity = 'authors';
  } else if (entityName.toLowerCase().includes('usuario') || displayName.toLowerCase().includes('usuario')) {
    entity = 'users';
  } else if (entityName.toLowerCase().includes('libro') || displayName.toLowerCase().includes('libro')) {
    entity = 'books';
  } else if (entityName.toLowerCase().includes('género') || displayName.toLowerCase().includes('género')) {
    entity = 'genres';
  } else if (entityName.toLowerCase().includes('editorial') || displayName.toLowerCase().includes('editorial')) {
    entity = 'publishing-houses';
  }
  
  // Extract capabilities from different formats
  const capabilities = {
    crud: ['create', 'read', 'update', 'delete'],
    search: ['simple', 'advanced'],
    export: false
  };
  
  if (oldConfig.capabilities) {
    if (Array.isArray(oldConfig.capabilities.crud)) {
      capabilities.crud = oldConfig.capabilities.crud;
    }
    if (Array.isArray(oldConfig.capabilities.search)) {
      capabilities.search = oldConfig.capabilities.search;
    }
    if (oldConfig.capabilities.export !== undefined) {
      capabilities.export = oldConfig.capabilities.export;
    }
  }

  // Extract table configuration
  let columns = [];
  let defaultSort: { field: string; direction: 'ASC' | 'DESC' } | undefined = undefined;
  let defaultPageSize = 10;

  // From table config
  if (oldConfig.table) {
    columns = oldConfig.table.columns || [];
    defaultPageSize = oldConfig.table.pageSize || 10;
    if (oldConfig.table.defaultSort) {
      defaultSort = {
        field: oldConfig.table.defaultSort.field,
        direction: oldConfig.table.defaultSort.direction
      };
    }
  }

  // From UI config (alternative structure)
  if (oldConfig.ui && oldConfig.ui.tableColumns) {
    columns = oldConfig.ui.tableColumns;
  }

  // From columns property (direct)
  if (oldConfig.columns) {
    columns = oldConfig.columns;
  }

  // Extract search fields
  let searchFields = [];
  if (oldConfig.search && oldConfig.search.advancedSearch && oldConfig.search.advancedSearch.fields) {
    searchFields = oldConfig.search.advancedSearch.fields;
  }
  if (oldConfig.searchFields) {
    searchFields = oldConfig.searchFields;
  }

  // Extract form fields for CRUD operations
  let formFields = [];
  if (oldConfig.formFields) {
    formFields = oldConfig.formFields;
  }

  return {
    entity,
    entityName,
    displayName,
    defaultPageSize,
    defaultSort,
    capabilities,
    columns,
    searchFields,
    formFields
  };
}

// Create API service adapter from existing API services
export function adaptApiService(existingApiService: any): UnifiedApiServiceAdapter {
  
  const adaptedService = {
    // Main list endpoint
    list: async (params: any) => {
      const response = await existingApiService.list(params);
      return response;
    },

    // Search endpoint
    search: async (params: any) => {
      if (existingApiService.search) {
        return await existingApiService.search(params);
      }
      // Fallback to list if search not available
      return await existingApiService.list(params);
    },

    // Filter endpoint
    filter: async (params: any) => {
      if (existingApiService.filter) {
        return await existingApiService.filter(params);
      }
      // Fallback to list if filter not available
      return await existingApiService.list(params);
    },

    // Quick filter endpoint (for search as you type)
    quickFilter: existingApiService.quickFilter ? async (term: string, params?: any) => {
      return await existingApiService.quickFilter(term, params);
    } : undefined,

    // Advanced filter endpoint
    advancedFilter: existingApiService.advancedFilter ? async (params: any) => {
      return await existingApiService.advancedFilter(params);
    } : undefined,

    // CRUD operations (optional)
    create: existingApiService.create ? async (data: any) => {
      return await existingApiService.create(data);
    } : undefined,

    update: existingApiService.update ? async (id: string, data: any) => {
      return await existingApiService.update(id, data);
    } : undefined,

    delete: existingApiService.delete ? async (id: string) => {
      return await existingApiService.delete(id);
    } : undefined,

    getById: existingApiService.getById ? async (id: string) => {
      return await existingApiService.getById(id);
    } : undefined
  };

  return adaptedService;
}

// Helper to create unified dashboard props from existing config
export function createUnifiedDashboardProps(
  existingConfig: any, 
  existingApiService: any,
  customHandlers?: any
) {
  return {
    config: adaptDashboardConfig(existingConfig),
    apiService: adaptApiService(existingApiService),
    customHandlers
  };
}