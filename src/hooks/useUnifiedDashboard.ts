import { useState, useCallback, useEffect } from 'react';
import { ApiListResponse } from '@/types/api/entities';

// Tipos de operación de datos
type DataOperation = 'list' | 'search' | 'filter' | 'advanced-filter';

// Estado unificado del dashboard
interface UnifiedDashboardState<TEntity = any> {
  // Data state - compartido entre todas las operaciones
  data: TEntity[];
  meta: any;
  loading: boolean;
  error: string | null;
  
  // Operation context - tracking actual operation
  currentOperation: DataOperation;
  lastOperationParams: Record<string, any>;
  
  // Pagination & sorting - persistente entre operaciones
  currentPage: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  
  // Search context
  isSearchActive: boolean;
  searchParams: Record<string, any>;
  
  // Form & modal state
  showForm: boolean;
  isEditing: boolean;
  selectedEntity: any;
  formLoading: boolean;
  showViewModal: boolean;
  showDeleteModal: boolean;
}

// API service interface que deben implementar todos los módulos
interface UnifiedApiService<TEntity, TListParams, TSearchParams, TFilterParams> {
  list: (params: TListParams) => Promise<ApiListResponse<TEntity>>;
  search: (params: TSearchParams) => Promise<ApiListResponse<TEntity>>;
  filter: (params: TFilterParams) => Promise<ApiListResponse<TEntity>>;
  advancedFilter?: (params: any) => Promise<ApiListResponse<TEntity>>;
  
  // CRUD operations
  create?: (data: any) => Promise<TEntity>;
  update?: (id: string, data: any) => Promise<TEntity>;
  delete?: (id: string) => Promise<{message: string}>;
  getById?: (id: string) => Promise<TEntity>;
}

// Configuration interface
interface UnifiedDashboardConfig<TEntity = any> {
  // Entity info
  entityName: string;
  defaultPageSize?: number;
  defaultSort?: {
    field: string;
    direction: 'ASC' | 'DESC';
  };
  
  // Capabilities
  capabilities: {
    crud: string[];
    search: string[];
    export?: boolean;
  };
}

// Main hook
export function useUnifiedDashboard<
  TEntity = any,
  TListParams = any,
  TSearchParams = any,
  TFilterParams = any
>(
  apiService: UnifiedApiService<TEntity, TListParams, TSearchParams, TFilterParams>,
  config: UnifiedDashboardConfig<TEntity>
) {
  const [state, setState] = useState<UnifiedDashboardState<TEntity>>({
    // Data state
    data: [],
    meta: null,
    loading: false,
    error: null,
    
    // Operation tracking
    currentOperation: 'list',
    lastOperationParams: {},
    
    // Pagination & sorting
    currentPage: 1,
    pageSize: config.defaultPageSize || 10,
    sortBy: config.defaultSort?.field,
    sortOrder: config.defaultSort?.direction,
    
    // Search state
    isSearchActive: false,
    searchParams: {},
    
    // UI state
    showForm: false,
    isEditing: false,
    selectedEntity: null,
    formLoading: false,
    showViewModal: false,
    showDeleteModal: false,
  });

  // Helper to update state
  const updateState = useCallback((updates: Partial<UnifiedDashboardState<TEntity>>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  // Helper to build pagination params
  const buildPaginationParams = useCallback(() => {
    return {
      page: state.currentPage,
      limit: state.pageSize,
      ...(state.sortBy && { sortBy: state.sortBy }),
      ...(state.sortOrder && { sortOrder: state.sortOrder })
    };
  }, [state.currentPage, state.pageSize, state.sortBy, state.sortOrder]);

  // Execute any data operation maintaining pagination state
  const executeDataOperation = useCallback(async (
    operation: DataOperation, 
    params: any = {}
  ) => {
    updateState({ loading: true, error: null, currentOperation: operation });
    
    try {
      let response: ApiListResponse<TEntity>;
      const paginationParams = buildPaginationParams();
      
      switch (operation) {
        case 'list':
          response = await apiService.list({ 
            ...paginationParams, 
            ...params 
          } as TListParams);
          break;
          
        case 'search':
          response = await apiService.search({ 
            ...paginationParams, 
            ...params 
          } as TSearchParams);
          break;
          
        case 'filter':
          response = await apiService.filter({ 
            ...params,
            pagination: paginationParams 
          } as TFilterParams);
          break;
          
        case 'advanced-filter':
          if (apiService.advancedFilter) {
            response = await apiService.advancedFilter({ 
              ...params,
              pagination: paginationParams 
            });
          } else {
            throw new Error('Advanced filter not supported');
          }
          break;
          
        default:
          throw new Error(`Unknown operation: ${operation}`);
      }
      
      updateState({
        data: response.data || [],
        meta: response.meta,
        loading: false,
        error: null,
        lastOperationParams: params,
        isSearchActive: operation !== 'list'
      });
      
    } catch (error: any) {
      updateState({
        loading: false,
        error: error.message || 'An error occurred',
        data: [],
        meta: null
      });
    }
  }, [apiService, buildPaginationParams, updateState]);

  // Specific operation handlers
  const handleList = useCallback((params = {}) => {
    return executeDataOperation('list', params);
  }, [executeDataOperation]);

  const handleSearch = useCallback((params: any) => {
    return executeDataOperation('search', params);
  }, [executeDataOperation]);

  const handleFilter = useCallback((params: any) => {
    return executeDataOperation('filter', params);
  }, [executeDataOperation]);

  const handleAdvancedFilter = useCallback((params: any, fuzzySearch: boolean = false) => {
    // Only execute advanced-filter if fuzzySearch is enabled
    if (!fuzzySearch) {
      console.warn('Advanced filter skipped: fuzzySearch not enabled');
      return;
    }
    
    // Check if at least one field has 3+ characters
    const hasValidField = Object.entries(params).some(([key, value]) => {
      if (typeof value === 'string') return value.trim().length >= 3;
      return value !== undefined && value !== null;
    });
    
    if (!hasValidField) {
      console.warn('Advanced filter skipped: no field with 3+ characters');
      return;
    }
    
    return executeDataOperation('advanced-filter', { ...params, fuzzySearch });
  }, [executeDataOperation]);

  // Pagination handlers - maintain current operation
  const handlePageChange = useCallback((newPage: number) => {
    updateState({ currentPage: newPage });
    
    // Re-execute last operation with new page
    setTimeout(() => {
      executeDataOperation(state.currentOperation, state.lastOperationParams);
    }, 0);
  }, [state.currentOperation, state.lastOperationParams, executeDataOperation, updateState]);

  const handlePageSizeChange = useCallback((newPageSize: number) => {
    updateState({ 
      pageSize: newPageSize, 
      currentPage: 1 // Reset to first page when changing size
    });
    
    // Re-execute last operation with new page size
    setTimeout(() => {
      executeDataOperation(state.currentOperation, state.lastOperationParams);
    }, 0);
  }, [state.currentOperation, state.lastOperationParams, executeDataOperation, updateState]);

  // Sorting handlers - maintain current operation
  const handleSort = useCallback((field: string, direction: 'ASC' | 'DESC') => {
    updateState({ 
      sortBy: field, 
      sortOrder: direction,
      currentPage: 1 // Reset to first page when sorting
    });
    
    // Re-execute last operation with new sort
    setTimeout(() => {
      executeDataOperation(state.currentOperation, state.lastOperationParams);
    }, 0);
  }, [state.currentOperation, state.lastOperationParams, executeDataOperation, updateState]);

  // Clear search - return to list mode
  const handleClearSearch = useCallback(() => {
    updateState({
      isSearchActive: false,
      searchParams: {},
      currentPage: 1 // Reset pagination
    });
    
    // Return to list operation
    executeDataOperation('list');
  }, [executeDataOperation, updateState]);

  // Refresh current operation
  const handleRefresh = useCallback(() => {
    executeDataOperation(state.currentOperation, state.lastOperationParams);
  }, [state.currentOperation, state.lastOperationParams, executeDataOperation]);

  // CRUD Handlers
  const handleCreate = useCallback(() => {
    if (!config.capabilities.crud.includes('create')) return;
    updateState({
      selectedEntity: null,
      isEditing: false,
      showForm: true
    });
  }, [config.capabilities.crud, updateState]);

  const handleEdit = useCallback((entity: TEntity) => {
    if (!config.capabilities.crud.includes('update')) return;
    updateState({
      selectedEntity: entity,
      isEditing: true,
      showForm: true
    });
  }, [config.capabilities.crud, updateState]);

  const handleView = useCallback((entity: TEntity) => {
    if (!config.capabilities.crud.includes('read')) return;
    updateState({
      selectedEntity: entity,
      showViewModal: true
    });
  }, [config.capabilities.crud, updateState]);

  const handleDelete = useCallback((entity: TEntity) => {
    if (!config.capabilities.crud.includes('delete')) return;
    updateState({
      selectedEntity: entity,
      showDeleteModal: true
    });
  }, [config.capabilities.crud, updateState]);

  // Initialize data on mount
  useEffect(() => {
    handleList();
  }, [handleList]);

  return {
    // State
    state,
    
    // Data operations
    handleList,
    handleSearch,
    handleFilter,
    handleAdvancedFilter,
    
    // Pagination & sorting
    handlePageChange,
    handlePageSizeChange,
    handleSort,
    
    // Utility operations
    handleClearSearch,
    handleRefresh,
    
    // CRUD operations
    handleCreate,
    handleEdit,
    handleView,
    handleDelete,
    
    // State updaters
    updateState,
    
    // Computed values
    isLoading: state.loading,
    hasError: !!state.error,
    isEmpty: !state.loading && state.data.length === 0,
    totalItems: state.meta?.total || 0,
    totalPages: state.meta?.totalPages || 0,
    hasNext: state.meta?.hasNext || false,
    hasPrev: state.meta?.hasPrev || false
  };
}

export default useUnifiedDashboard;