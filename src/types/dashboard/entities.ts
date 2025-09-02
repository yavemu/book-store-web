/**
 * Generic Dashboard Entity Types
 * Provides complete type safety for reusable dashboard configurations
 */

export type CrudCapability = 'create' | 'read' | 'update' | 'delete';
export type SearchCapability = 'auto' | 'simple' | 'advanced';

// Base interfaces for all dashboard entities
export interface DashboardEntityCapabilities {
  crud: CrudCapability[];
  search: SearchCapability[];
  export?: boolean;
}

export interface DashboardColumnConfig {
  key: string;
  label: string;
  type: 'text' | 'date' | 'number' | 'boolean' | 'custom';
  sortable?: boolean;
  render?: (value: any, record: any) => React.ReactNode;
}

export interface DashboardActionConfig {
  key: string;
  label: string;
  variant: 'primary' | 'secondary' | 'danger' | 'ver' | 'editar' | 'eliminar';
  condition?: (record: any) => boolean;
  handler: string; // References handler name in the dashboard hook
}

export interface DashboardSearchFieldConfig {
  key: string;
  label: string;
  type: 'text' | 'select' | 'date' | 'number' | 'boolean';
  placeholder?: string;
  validation?: {
    minLength?: number;
    required?: boolean;
  };
  options?: { value: any; label: string }[];
}

export interface DashboardApiConfig {
  baseEndpoint: string;
  endpoints: {
    list: string;
    create?: string;
    read?: string;
    update?: string;
    delete?: string;
    search?: string;
    filter?: string;
    advancedFilter?: string;
    export?: string;
  };
}

export interface DashboardFormConfig {
  component: React.ComponentType<any>;
  validation?: any; // Zod schema
}

// Main entity configuration interface
export interface DashboardEntityConfig<TEntity = any, TCreateDto = any, TUpdateDto = any> {
  // Basic entity information
  entity: string;
  displayName: string;
  entityName: string; // For singular form (e.g., "autor", "log")

  // Entity capabilities
  capabilities: DashboardEntityCapabilities;

  // API configuration
  api: DashboardApiConfig;

  // Table configuration
  table: {
    columns: DashboardColumnConfig[];
    actions?: DashboardActionConfig[];
    defaultSort?: { field: string; direction: 'ASC' | 'DESC' };
    pageSize: number;
  };

  // Search configuration
  search?: {
    autoSearch?: {
      enabled: boolean;
      minChars: number;
      debounceMs: number;
      placeholder: string;
    };
    advancedSearch?: {
      enabled: boolean;
      fields: DashboardSearchFieldConfig[];
    };
  };

  // Forms configuration (only for CRUD entities)
  forms?: {
    create?: DashboardFormConfig;
    edit?: DashboardFormConfig;
    view?: DashboardFormConfig;
    delete?: DashboardFormConfig;
  };

  // Validation schemas
  validation?: {
    entity?: any;
    create?: any;
    update?: any;
  };

  // Custom configuration per entity
  customConfig?: Record<string, any>;
}

// Handler types for dashboard operations
export interface DashboardHandlers<TEntity = any, TCreateDto = any, TUpdateDto = any> {
  // CRUD handlers
  onCreate?: () => void;
  onEdit?: (entity: TEntity) => void;
  onView?: (entity: TEntity) => void;
  onDelete?: (entity: TEntity) => void;
  onFormSubmit?: (data: TCreateDto | TUpdateDto) => Promise<void>;
  onFormCancel?: () => void;
  onDeleteConfirm?: () => Promise<void>;

  // Search handlers
  onAutoFilter?: (term: string) => void;
  onSearch?: (term: string, fuzzy?: boolean) => void;
  onAdvancedFilter?: (filters: Record<string, any>) => void;
  onClearSearch?: () => void;

  // Pagination handlers
  onPageChange?: (page: number) => void;

  // Data handlers
  onDataRefresh?: () => void;
  onExport?: () => Promise<void>;
}

// State interface for dashboard hook
export interface DashboardState<TEntity = any> {
  // Data state
  data: TEntity[];
  meta?: any;
  loading: boolean;
  error: any;

  // Search state
  isSearchMode: boolean;
  searchLoading: boolean;
  searchParams: Record<string, any>;

  // Form state
  showForm: boolean;
  isEditing: boolean;
  selectedEntity: TEntity | null;
  formLoading: boolean;

  // Modal state
  showViewModal: boolean;
  showDeleteModal: boolean;

  // Pagination state
  currentPage: number;
  pageSize: number;
}

// Props interface for generic dashboard page
export interface GenericDashboardPageProps<TEntity = any, TCreateDto = any, TUpdateDto = any> {
  config: DashboardEntityConfig<TEntity, TCreateDto, TUpdateDto>;
  customHandlers?: Partial<DashboardHandlers<TEntity, TCreateDto, TUpdateDto>>;
  customComponents?: {
    table?: React.ComponentType<any>;
    search?: React.ComponentType<any>;
    form?: React.ComponentType<any>;
  };
}

// Entity registry type for centralized configuration
export interface DashboardEntityRegistry {
  [key: string]: () => Promise<{ config: DashboardEntityConfig }>;
}