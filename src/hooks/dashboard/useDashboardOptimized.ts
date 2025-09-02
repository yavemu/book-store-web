/**
 * Optimized Dashboard Hook - Integrates with specialized hooks
 * Manages all CRUD, search, pagination, and form operations efficiently
 */

import { useState, useCallback, useMemo } from 'react';
import { useApiCall } from '../api/useApiCall';
import {
  DashboardEntityConfig,
  DashboardHandlers,
  DashboardState,
  CrudCapability,
  SearchCapability
} from '@/types/dashboard/entities';

interface UseDashboardOptimizedProps<TEntity = any, TCreateDto = any, TUpdateDto = any> {
  config: DashboardEntityConfig<TEntity, TCreateDto, TUpdateDto>;
  apiService: any;
  customHandlers?: Partial<DashboardHandlers<TEntity, TCreateDto, TUpdateDto>>;
  specializedHooks?: {
    isbnValidation?: any;
    genreEditorialManager?: any;
  };
}

export function useDashboardOptimized<TEntity = any, TCreateDto = any, TUpdateDto = any>({
  config,
  apiService,
  customHandlers = {},
  specializedHooks = {}
}: UseDashboardOptimizedProps<TEntity, TCreateDto, TUpdateDto>) {
  
  // Initialize state
  const [state, setState] = useState<DashboardState<TEntity>>({
    data: [],
    meta: undefined,
    loading: false,
    error: null,
    isSearchMode: false,
    searchLoading: false,
    searchParams: {},
    showForm: false,
    isEditing: false,
    selectedEntity: null,
    formLoading: false,
    showViewModal: false,
    showDeleteModal: false,
    currentPage: 1,
    pageSize: config.table?.pageSize || 10
  });

  // Update state helper
  const updateState = useCallback((updates: Partial<DashboardState<TEntity>>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  // Specialized API call hook
  const apiCall = useApiCall({
    apiService,
    onSuccess: (data) => {
      updateState({
        data: data?.data || [],
        meta: data?.meta,
        loading: false,
        error: null
      });
    },
    onError: (error) => {
      updateState({
        loading: false,
        error,
        data: []
      });
    }
  });

  // ===== DATA LOADING HANDLERS =====

  const loadData = useCallback(async () => {
    updateState({ loading: true });
    await apiCall.executeGetAll({
      page: state.currentPage,
      limit: state.pageSize,
      ...(config.table?.defaultSort && {
        sortBy: config.table.defaultSort.field,
        sortOrder: config.table.defaultSort.direction
      })
    });
  }, [apiCall, state.currentPage, state.pageSize, config.table]);

  // ===== CRUD HANDLERS =====

  const handleCreate = useCallback(() => {
    if (!config.capabilities.crud.includes('create' as CrudCapability)) return;
    
    updateState({
      selectedEntity: null,
      isEditing: false,
      showForm: true
    });
  }, [config.capabilities.crud]);

  const handleEdit = useCallback((entity: TEntity) => {
    if (!config.capabilities.crud.includes('update' as CrudCapability)) return;
    
    updateState({
      selectedEntity: entity,
      isEditing: true,
      showForm: true
    });
  }, [config.capabilities.crud]);

  const handleView = useCallback((entity: TEntity) => {
    if (!config.capabilities.crud.includes('read' as CrudCapability)) return;
    
    updateState({
      selectedEntity: entity,
      showViewModal: true
    });
  }, [config.capabilities.crud]);

  const handleDelete = useCallback((entity: TEntity) => {
    if (!config.capabilities.crud.includes('delete' as CrudCapability)) return;
    
    updateState({
      selectedEntity: entity,
      showDeleteModal: true
    });
  }, [config.capabilities.crud]);

  const handleFormSubmit = useCallback(async (formData: TCreateDto | TUpdateDto) => {
    if (!state.selectedEntity && !config.capabilities.crud.includes('create' as CrudCapability)) return;
    if (state.selectedEntity && !config.capabilities.crud.includes('update' as CrudCapability)) return;

    updateState({ formLoading: true });
    
    try {
      if (state.isEditing && state.selectedEntity) {
        await apiService.update((state.selectedEntity as any).id, formData as TUpdateDto);
      } else {
        await apiService.create(formData as TCreateDto);
      }

      // Close form and refresh data
      updateState({
        showForm: false,
        selectedEntity: null,
        isEditing: false,
        formLoading: false,
        isSearchMode: false
      });
      
      await loadData();
      
    } catch (error) {
      updateState({ formLoading: false });
      throw error;
    }
  }, [state.selectedEntity, state.isEditing, config.capabilities.crud, apiService, loadData]);

  const handleFormCancel = useCallback(() => {
    updateState({
      showForm: false,
      selectedEntity: null,
      isEditing: false,
      formLoading: false
    });
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!state.selectedEntity || !config.capabilities.crud.includes('delete' as CrudCapability)) return;

    updateState({ formLoading: true });
    
    try {
      await apiService.delete((state.selectedEntity as any).id);
      
      updateState({
        showDeleteModal: false,
        selectedEntity: null,
        formLoading: false,
        isSearchMode: false
      });
      
      await loadData();
      
    } catch (error) {
      updateState({ formLoading: false });
      throw error;
    }
  }, [state.selectedEntity, config.capabilities.crud, apiService, loadData]);

  // ===== SEARCH HANDLERS =====

  const handleAutoFilter = useCallback(async (term: string) => {
    if (!config.capabilities.search.includes('auto' as SearchCapability)) return;
    if (!config.search?.autoSearch?.enabled) return;

    updateState({ searchLoading: true });
    
    try {
      const filterParams = {
        [config.entity === 'audit' ? 'filter' : 'name']: term,
        pagination: { 
          page: 1, 
          limit: state.pageSize,
          ...(config.table?.defaultSort && {
            sortBy: config.table.defaultSort.field,
            sortOrder: config.table.defaultSort.direction
          })
        }
      };

      await apiCall.executeFilter(filterParams);
      
      updateState({
        isSearchMode: true,
        currentPage: 1,
        searchParams: { autoFilter: term },
        searchLoading: false
      });
      
    } catch (error) {
      console.error(`Error auto-filtering ${config.entity}:`, error);
      updateState({ searchLoading: false });
    }
  }, [config, apiCall, state.pageSize]);

  const handleSearch = useCallback(async (term: string, fuzzy = false) => {
    if (!config.capabilities.search.includes('simple' as SearchCapability)) return;

    updateState({ searchLoading: true });
    
    try {
      const searchParams = {
        term,
        page: 1,
        limit: state.pageSize,
        ...(config.table?.defaultSort && {
          sortBy: config.table.defaultSort.field,
          sortOrder: config.table.defaultSort.direction
        })
      };

      await apiCall.executeSearch(searchParams);
      
      updateState({
        isSearchMode: true,
        currentPage: 1,
        searchParams: { search: term, fuzzy },
        searchLoading: false
      });
      
    } catch (error) {
      console.error(`Error searching ${config.entity}:`, error);
      updateState({ searchLoading: false });
    }
  }, [config, apiCall, state.pageSize]);

  const handleAdvancedFilter = useCallback(async (filters: Record<string, any>) => {
    if (!config.capabilities.search.includes('advanced' as SearchCapability)) return;

    updateState({ searchLoading: true });
    
    try {
      if (config.entity === 'audit' && apiService.advancedFilter) {
        await apiCall.executeAdvancedFilter(filters, {
          page: 1,
          limit: state.pageSize,
          ...(config.table?.defaultSort && {
            sortBy: config.table.defaultSort.field,
            sortOrder: config.table.defaultSort.direction
          })
        });
      } else {
        const filterParams = {
          ...filters,
          pagination: { 
            page: 1, 
            limit: state.pageSize,
            ...(config.table?.defaultSort && {
              sortBy: config.table.defaultSort.field,
              sortOrder: config.table.defaultSort.direction
            })
          }
        };
        await apiCall.executeFilter(filterParams);
      }
      
      updateState({
        isSearchMode: true,
        currentPage: 1,
        searchParams: { advancedFilter: filters },
        searchLoading: false
      });
      
    } catch (error) {
      console.error(`Error advanced filtering ${config.entity}:`, error);
      updateState({ searchLoading: false });
    }
  }, [config, apiService, apiCall, state.pageSize]);

  const handleClearSearch = useCallback(() => {
    updateState({
      isSearchMode: false,
      currentPage: 1,
      searchParams: {}
    });
  }, []);

  // ===== PAGINATION HANDLERS =====

  const handlePageChange = useCallback((page: number) => {
    updateState({ currentPage: page });
  }, []);

  // ===== DATA HANDLERS =====

  const handleDataRefresh = useCallback(async () => {
    if (state.isSearchMode) {
      updateState({ isSearchMode: false });
    }
    await loadData();
  }, [state.isSearchMode, loadData]);

  const handleExport = useCallback(async () => {
    if (!config.capabilities.export) return;

    try {
      const csvData = await apiService.exportToCsv();
      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${config.entity}_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(`Error exporting ${config.entity}:`, error);
    }
  }, [config, apiService]);

  // ===== MODAL HANDLERS =====

  const handleViewModalClose = useCallback(() => {
    updateState({
      showViewModal: false,
      selectedEntity: null
    });
  }, []);

  const handleDeleteModalCancel = useCallback(() => {
    updateState({
      showDeleteModal: false,
      selectedEntity: null
    });
  }, []);

  // ===== COMBINED HANDLERS =====

  const handlers: DashboardHandlers<TEntity, TCreateDto, TUpdateDto> = useMemo(() => ({
    // CRUD handlers
    onCreate: handleCreate,
    onEdit: handleEdit,
    onView: handleView,
    onDelete: handleDelete,
    onFormSubmit: handleFormSubmit,
    onFormCancel: handleFormCancel,
    onDeleteConfirm: handleDeleteConfirm,

    // Search handlers
    onAutoFilter: handleAutoFilter,
    onSearch: handleSearch,
    onAdvancedFilter: handleAdvancedFilter,
    onClearSearch: handleClearSearch,

    // Pagination handlers
    onPageChange: handlePageChange,

    // Data handlers
    onDataRefresh: handleDataRefresh,
    onExport: handleExport,

    // Override with custom handlers
    ...customHandlers
  }), [
    handleCreate, handleEdit, handleView, handleDelete, handleFormSubmit, handleFormCancel, handleDeleteConfirm,
    handleAutoFilter, handleSearch, handleAdvancedFilter, handleClearSearch,
    handlePageChange, handleDataRefresh, handleExport,
    customHandlers
  ]);

  // ===== DERIVED STATE =====

  const derivedState = useMemo(() => ({
    ...state,
    loading: state.loading || apiCall.loading,
    error: state.error || apiCall.error,
    data: state.data.length ? state.data : (apiCall.data?.data || []),
    meta: state.meta || apiCall.data?.meta
  }), [state, apiCall]);

  return {
    state: derivedState,
    handlers,
    // API call utilities
    apiCall: {
      refetch: apiCall.refetch,
      currentCallType: apiCall.currentCallType,
      lastParams: apiCall.lastParams
    },
    // Additional helper methods
    utils: {
      handleViewModalClose,
      handleDeleteModalCancel,
      updateState,
      loadData
    },
    // Specialized hooks integration
    specialized: specializedHooks
  };
}