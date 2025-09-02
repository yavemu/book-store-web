'use client';

import { ReactNode, useEffect } from 'react';
import { useGlobalPagination } from '@/contexts/GlobalPaginationContext';
import { ApiPaginationMeta } from '@/types/api/entities';
import DynamicTable, { 
  DynamicTableProps, 
  TableColumn, 
  TableAction, 
  PaginationParams,
  SortConfig 
} from './DynamicTable';
import PageWrapper, { PageWrapperProps } from './PageWrapper';
import ApiErrorState from './ErrorStates/ApiErrorState';

// Generic interface for API responses with pagination
export interface ApiListResponse<T> {
  data: T[];
  meta: ApiPaginationMeta;
}

// Permission levels for different dashboard actions
export interface DashboardPermissions {
  canView?: boolean;
  canCreate?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
  canSearch?: boolean;
  canExport?: boolean;
}

// Configuration interface for each entity
export interface DashboardConfig<T> {
  entityName: string;           // 'genres', 'books', etc. (for context keys)
  entityDisplayName: string;    // 'géneros', 'libros', etc. (for display)
  entitySingular: string;       // 'género', 'libro', etc. (for singular display)
  columns: TableColumn[];
  
  // Action configuration
  actions?: TableAction[];
  customActions?: TableAction[]; // Override default actions completely
  
  // Feature flags
  permissions?: DashboardPermissions;
  
  // Create functionality
  showCreateButton?: boolean;
  createButtonLabel?: string;
  
  // Search functionality
  showSearch?: boolean;
  searchPlaceholder?: string;
  
  // Form functionality
  showForm?: boolean;
  formComponent?: ReactNode;
  
  // Additional features
  showExportButton?: boolean;
  isReadOnly?: boolean; // For dashboards like audit logs, inventory movements
  
  // Custom validation messages
  emptyStateMessage?: string;
  loadingMessage?: string;
}

// Props for the DashboardWrapper
export interface DashboardWrapperProps<T> {
  // Required configuration
  config: DashboardConfig<T>;
  
  // Page configuration (from PageWrapper)
  title: string;
  breadcrumbs?: string[];
  
  // Data and loading states
  data: ApiListResponse<T> | null;
  loading: boolean;
  error?: string | null;
  
  // Table interaction handlers
  onPageChange?: (page: number) => void;
  onSortChange?: (field: string, direction: 'ASC' | 'DESC') => void;
  onSearchChange?: (value: string) => void;
  onCreateClick?: () => void;
  onFormToggle?: () => void;
  onEditClick?: (record: T) => void;
  
  // Form and editing state
  isEditing?: boolean;
  editingRecord?: T;
  
  // Search configuration
  searchPlaceholder?: string;
  
  // Additional content (filters, forms, etc.)
  additionalContent?: ReactNode;
  
  // Pagination parameter clearing
  onClearPaginationParam?: (param: keyof PaginationParams) => void;
}

/**
 * DashboardWrapper - Wrapper obligatorio y estándar para todos los dashboards
 * 
 * Características centralizadas:
 * - ✅ Gestión de paginación global sincronizada
 * - ✅ Manejo automático de meta de totales 
 * - ✅ Estructura común y consistente de página
 * - ✅ Integración completa con DynamicTable
 * - ✅ Validaciones y permisos por dashboard
 * - ✅ Soporte para dashboards de solo lectura
 * - ✅ Configuración flexible de acciones
 * - ✅ Manejo de estados de error y carga
 * 
 * Casos de uso soportados:
 * - Dashboards CRUD completos (géneros, libros, autores)
 * - Dashboards de solo lectura (movimientos de inventario, auditoría) 
 * - Dashboards con permisos específicos por rol
 * - Dashboards con acciones personalizadas
 * 
 * Uso obligatorio en todos los dashboards para mantener consistencia.
 */
export default function DashboardWrapper<T = any>({
  config,
  title,
  breadcrumbs,
  data,
  loading,
  error,
  onPageChange,
  onSortChange,
  onSearchChange,
  onCreateClick,
  onFormToggle,
  onEditClick,
  isEditing = false,
  editingRecord,
  searchPlaceholder,
  additionalContent,
  onClearPaginationParam
}: DashboardWrapperProps<T>) {
  
  // Global pagination management
  const {
    getEntityPagination,
    updateEntityPagination,
    handlePageChange: globalHandlePageChange,
    handleSortChange: globalHandleSortChange,
    updateFromApiMeta,
    clearEntityParameter
  } = useGlobalPagination();
  
  // Get current pagination for this entity
  const sharedPagination = getEntityPagination(config.entityName);
  
  // Default permissions (everything allowed unless specified)
  const permissions: DashboardPermissions = {
    canView: true,
    canCreate: true,
    canEdit: true,
    canDelete: true,
    canSearch: true,
    canExport: false,
    ...config.permissions
  };
  
  // Override permissions for read-only dashboards
  if (config.isReadOnly) {
    permissions.canCreate = false;
    permissions.canEdit = false;
    permissions.canDelete = false;
  }
  
  // Update global pagination when API responds with meta
  useEffect(() => {
    if (data?.meta) {
      updateFromApiMeta(config.entityName, data.meta);
    }
  }, [data?.meta, config.entityName, updateFromApiMeta]);
  
  // Handle page changes
  const handlePageChange = (page: number) => {
    globalHandlePageChange(config.entityName, page);
    onPageChange?.(page);
  };
  
  // Handle sort changes
  const handleSortChange = (field: string, direction: 'ASC' | 'DESC') => {
    globalHandleSortChange(config.entityName, field, direction);
    onSortChange?.(field, direction);
  };
  
  // Handle pagination parameter clearing
  const handleClearPaginationParam = (param: keyof PaginationParams) => {
    clearEntityParameter(config.entityName, param);
    onClearPaginationParam?.(param);
  };
  
  // Prepare data for DynamicTable
  const tableData = data?.data || [];
  const tableMeta = data?.meta || null;
  
  // Generate default actions based on permissions
  const generateDefaultActions = (): TableAction[] => {
    const defaultActions: TableAction[] = [];
    
    if (permissions.canView) {
      defaultActions.push({
        label: 'Ver',
        onClick: (record: T) => {
          console.log(`Ver ${config.entitySingular}:`, record);
          // Default view action - can be overridden
        },
        variant: 'primary'
      });
    }
    
    if (permissions.canEdit) {
      defaultActions.push({
        label: 'Editar',
        onClick: (record: T) => {
          console.log(`Editar ${config.entitySingular}:`, record);
          onEditClick?.(record);
        },
        variant: 'secondary'
      });
    }
    
    if (permissions.canDelete) {
      defaultActions.push({
        label: 'Eliminar',
        onClick: (record: T) => {
          if (confirm(`¿Estás seguro de eliminar este ${config.entitySingular}?`)) {
            console.log(`Eliminar ${config.entitySingular}:`, record);
            // Default delete action - should be overridden with actual API call
          }
        },
        variant: 'danger'
      });
    }
    
    return defaultActions;
  };
  
  // Determine which actions to use
  const tableActions: TableAction[] = config.customActions 
    ? config.customActions 
    : config.actions 
      ? config.actions 
      : generateDefaultActions();
  
  // Create sort config from shared pagination
  const sortConfig: SortConfig = {
    field: sharedPagination.sortBy,
    direction: sharedPagination.sortOrder
  };
  
  // Error handling for the entire dashboard
  if (error) {
    return (
      <PageWrapper title={title} breadcrumbs={breadcrumbs}>
        <ApiErrorState 
          title={`Error en ${title}`}
          message={error}
          showTechnicalDetails={false}
        />
      </PageWrapper>
    );
  }
  
  return (
    <PageWrapper title={title} breadcrumbs={breadcrumbs}>
      {/* Additional content (filters, forms, etc.) */}
      {additionalContent}
      
      {/* Main data table with permission-based features */}
      <DynamicTable
        data={tableData}
        columns={config.columns}
        meta={tableMeta}
        loading={loading}
        onPageChange={handlePageChange}
        actions={tableActions}
        // Create button - only show if permissions allow and not read-only
        showCreateButton={permissions.canCreate && config.showCreateButton && !config.isReadOnly}
        onCreateClick={permissions.canCreate ? onCreateClick : undefined}
        createButtonLabel={config.createButtonLabel || `+ Crear ${config.entitySingular}`}
        entityName={config.entitySingular}
        // Form functionality - only if not read-only  
        showForm={config.showForm && !config.isReadOnly}
        formComponent={config.formComponent}
        onFormToggle={onFormToggle}
        isEditing={isEditing}
        editingRecord={editingRecord}
        onEditClick={permissions.canEdit ? onEditClick : undefined}
        // Search functionality - based on permissions
        showSearch={permissions.canSearch && (config.showSearch !== false)}
        searchPlaceholder={config.searchPlaceholder || searchPlaceholder || `Buscar ${config.entityDisplayName}... (mín. 3 caracteres)`}
        onSearchChange={permissions.canSearch ? onSearchChange : undefined}
        sortConfig={sortConfig}
        onSortChange={handleSortChange}
        paginationParams={sharedPagination}
        onClearPaginationParam={handleClearPaginationParam}
        showPaginationInfo={true}
      />
    </PageWrapper>
  );
}