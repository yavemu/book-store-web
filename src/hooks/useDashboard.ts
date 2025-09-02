/**
 * Centralized Dashboard Logic Hook
 * Manages all CRUD, search, pagination, and form operations
 */

import { useState, useEffect, useCallback } from 'react';
import { useApiRequest } from '@/hooks';
import {
  DashboardEntityConfig,
  DashboardHandlers,
  DashboardState,
  CrudCapability,
  SearchCapability
} from '@/types/dashboard/entities';

interface UseDashboardProps<TEntity = any, TCreateDto = any, TUpdateDto = any> {
  config: DashboardEntityConfig<TEntity, TCreateDto, TUpdateDto>;
  apiService: any; // The API service for the entity
  customHandlers?: Partial<DashboardHandlers<TEntity, TCreateDto, TUpdateDto>>;
}

export function useDashboard<TEntity = any, TCreateDto = any, TUpdateDto = any>({
  config,
  apiService,
  customHandlers = {}
}: UseDashboardProps<TEntity, TCreateDto, TUpdateDto>) {
  
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

  // API request hook for data fetching
  const { loading, error, data, execute } = useApiRequest({
    apiFunction: () => apiService.list({
      page: state.currentPage,
      limit: state.pageSize,
      ...(config.table?.defaultSort && {
        sortBy: config.table.defaultSort.field,
        sortOrder: config.table.defaultSort.direction
      })
    })
  });

  // Update state when API data changes
  useEffect(() => {
    setState(prev => ({
      ...prev,
      data: data?.data || [],
      meta: data?.meta,
      loading,
      error
    }));
  }, [data, loading, error]);

  // Fetch data on mount and when search mode changes
  useEffect(() => {
    if (!state.isSearchMode) {
      execute();
    }
  }, [state.currentPage, state.pageSize, state.isSearchMode]);

  // Update state helper
  const updateState = useCallback((updates: Partial<DashboardState<TEntity>>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  // CRUD Handlers
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
        isSearchMode: false // Reset to normal list view
      });
      
      execute(); // Refresh data
      
    } catch (error) {
      updateState({ formLoading: false });
      throw error; // Let the form handle the error display
    }
  }, [state.selectedEntity, state.isEditing, config.capabilities.crud, apiService, execute]);

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
      
      // Close dialog and refresh data
      updateState({
        showDeleteModal: false,
        selectedEntity: null,
        formLoading: false,
        isSearchMode: false // Reset to normal list view
      });
      
      execute(); // Refresh data
      
    } catch (error) {
      updateState({ formLoading: false });
      throw error; // Let the component handle error display
    }
  }, [state.selectedEntity, config.capabilities.crud, apiService, execute]);

  // Search Handlers
  const handleAutoFilter = useCallback(async (term: string) => {
    if (!config.capabilities.search.includes('auto' as SearchCapability)) return;
    if (!config.search?.autoSearch?.enabled) return;
    if (!term || term.trim().length < 3) return; // Mínimo 3 caracteres

    updateState({ searchLoading: true });
    
    try {
      // Usar quickFilter que llama al endpoint /filter con GET y query params
      const searchMethod = apiService.quickFilter || apiService.filter;
      let response;
      
      if (apiService.quickFilter) {
        // quickFilter ya está configurado correctamente para usar GET /filter?term=...
        response = await searchMethod(term, {
          page: 1,
          limit: state.pageSize
        });
      } else {
        // Fallback al método filter tradicional
        response = await searchMethod({
          [config.entity === 'audit' ? 'filter' : 'name']: term,
          pagination: { 
            page: 1, 
            limit: state.pageSize,
            ...(config.table?.defaultSort && {
              sortBy: config.table.defaultSort.field,
              sortOrder: config.table.defaultSort.direction
            })
          }
        });
      }
      
      // Actualizar estado con los datos recibidos de la API
      updateState({
        data: response?.data || [],
        meta: response?.meta,
        isSearchMode: true,
        currentPage: 1,
        searchParams: { autoFilter: term },
        searchLoading: false
      });
      
    } catch (error) {
      console.error(`Error auto-filtering ${config.entity}:`, error);
      updateState({ 
        searchLoading: false,
        error: error.message || 'Error en búsqueda rápida'
      });
    }
  }, [config, apiService, state.pageSize]);

  const handleSearch = useCallback(async (term: string, fuzzy = false) => {
    if (!config.capabilities.search.includes('simple' as SearchCapability)) return;

    updateState({ searchLoading: true });
    
    try {
      // Usar el endpoint POST /search para búsqueda normal
      let response;
      
      if (apiService.search) {
        // Usar search endpoint POST /search
        response = await apiService.search({
          term,
          page: 1,
          limit: state.pageSize,
          ...(config.table?.defaultSort && {
            sortBy: config.table.defaultSort.field,
            sortOrder: config.table.defaultSort.direction
          })
        });
      } else {
        // Fallback a quickFilter si search no está disponible
        response = await apiService.quickFilter(term, {
          page: 1,
          limit: state.pageSize
        });
      }
      
      // Actualizar estado con los datos recibidos de la API
      updateState({
        data: response?.data || [],
        meta: response?.meta,
        isSearchMode: true,
        currentPage: 1,
        searchParams: { search: term, fuzzy },
        searchLoading: false
      });
      
    } catch (error) {
      console.error(`Error searching ${config.entity}:`, error);
      updateState({ 
        searchLoading: false,
        error: error.message || 'Error en búsqueda'
      });
    }
  }, [config, apiService, state.pageSize]);

  const handleAdvancedFilter = useCallback(async (filters: Record<string, any>) => {
    if (!config.capabilities.search.includes('advanced' as SearchCapability)) return;

    updateState({ searchLoading: true });
    
    try {
      let response;
      
      if (apiService.advancedFilter) {
        // Use advanced filter endpoint POST /advanced-filter
        response = await apiService.advancedFilter({
          ...filters,
          pagination: { 
            page: 1, 
            limit: state.pageSize,
            ...(config.table?.defaultSort && {
              sortBy: config.table.defaultSort.field,
              sortOrder: config.table.defaultSort.direction
            })
          }
        });
      } else {
        // Fallback to regular filter endpoint POST /filter
        response = await apiService.filter({
          ...filters,
          pagination: { 
            page: 1, 
            limit: state.pageSize,
            ...(config.table?.defaultSort && {
              sortBy: config.table.defaultSort.field,
              sortOrder: config.table.defaultSort.direction
            })
          }
        });
      }
      
      // Actualizar estado con los datos recibidos de la API
      updateState({
        data: response?.data || [],
        meta: response?.meta,
        isSearchMode: true,
        currentPage: 1,
        searchParams: { advancedFilter: filters },
        searchLoading: false
      });
      
    } catch (error) {
      console.error(`Error advanced filtering ${config.entity}:`, error);
      updateState({ 
        searchLoading: false,
        error: error.message || 'Error en filtro avanzado'
      });
    }
  }, [config, apiService, state.pageSize]);

  const handleClearSearch = useCallback(() => {
    updateState({
      isSearchMode: false,
      currentPage: 1,
      searchParams: {}
    });
  }, []);

  // Pagination Handlers
  const handlePageChange = useCallback((page: number) => {
    updateState({ currentPage: page });
  }, []);

  // Data Handlers
  const handleDataRefresh = useCallback(() => {
    if (state.isSearchMode) {
      updateState({ isSearchMode: false }); // Reset to normal list view
    }
    execute();
  }, [state.isSearchMode, execute]);

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

  // Modal Handlers
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

  // Combine all handlers
  const handlers: DashboardHandlers<TEntity, TCreateDto, TUpdateDto> = {
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
  };

  return {
    state,
    handlers,
    // Additional helper methods
    utils: {
      handleViewModalClose,
      handleDeleteModalCancel,
      updateState
    }
  };
}