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
    // Auto-search is enabled by default if 'auto' is in capabilities
    const autoSearchEnabled = config.search?.autoSearch?.enabled !== false;
    if (!autoSearchEnabled) return;
    if (!term || term.trim().length < 3) return; // Mínimo 3 caracteres

    updateState({ searchLoading: true });
    
    try {
      // Limpiar estado de búsquedas anteriores
      updateState({ 
        searchParams: {},
        error: null 
      });
      
      let response;
      
      // ALWAYS prioritize quickFilter for auto-search (uses GET /filter?term)
      if (apiService.quickFilter) {
        response = await apiService.quickFilter(term.trim(), {
          page: 1,
          limit: state.pageSize
        });
      } else {
        throw new Error('quickFilter method not available for auto-search');
      }
      
      if (!response) {
        throw new Error('No response from quickFilter');
      }
      
      // Actualizar estado con los datos recibidos de la API
      updateState({
        data: response?.data || [],
        meta: response?.meta,
        isSearchMode: true,
        currentPage: 1,
        searchParams: { autoFilter: term.trim() },
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

  const handleSearch = useCallback(async (term: string, fuzzy = false, page = 1) => {
    if (!config.capabilities.search.includes('simple' as SearchCapability)) return;

    updateState({ searchLoading: true });
    
    try {
      // Limpiar estado de búsquedas anteriores
      updateState({ 
        searchParams: {},
        error: null 
      });
      
      // Usar el endpoint POST /search para búsqueda normal
      let response;
      
      if (apiService.search) {
        // Para search (POST), no enviar 'term' sino crear búsqueda específica por campos
        // Convertir el término de búsqueda en campos específicos según la entidad
        let searchPayload: any = {};
        
        if (config.entity === 'authors') {
          // Para autores: buscar en firstName y lastName
          searchPayload = {
            firstName: term.trim(),
            lastName: term.trim(),
          };
        } else if (config.entity === 'users') {
          // Para usuarios: buscar en username, email, firstName, lastName
          searchPayload = {
            username: term.trim(),
            email: term.trim(),
            firstName: term.trim(),
            lastName: term.trim(),
          };
        } else if (config.entity === 'books' || config.entity === 'book-catalog') {
          // Para libros: buscar en title, isbnCode
          searchPayload = {
            title: term.trim(),
            isbnCode: term.trim(),
          };
        } else if (config.entity === 'genres') {
          // Para géneros: buscar en name
          searchPayload = {
            name: term.trim(),
          };
        } else if (config.entity === 'publishing-houses') {
          // Para editoriales: buscar en name
          searchPayload = {
            name: term.trim(),
          };
        } else {
          // Fallback genérico
          searchPayload = {
            name: term.trim(),
          };
        }
        
        response = await apiService.search(searchPayload);
      } else {
        // No fallback - search debe ser independiente
        throw new Error('Search endpoint not available for this entity');
      }
      
      // Actualizar estado con los datos recibidos de la API
      updateState({
        data: response?.data || [],
        meta: response?.meta,
        isSearchMode: true,
        currentPage: page,
        searchParams: { search: term.trim(), fuzzy },
        searchLoading: false
      });
      
    } catch (error) {
      console.error(`Error searching ${config.entity}:`, error);
      updateState({ 
        searchLoading: false,
        error: error?.message || 'Error en búsqueda'
      });
    }
  }, [config, apiService, state.pageSize]);

  const handleAdvancedFilter = useCallback(async (filters: Record<string, any>, page = 1, useExactSearch = false) => {
    if (!config.capabilities.search.includes('advanced' as SearchCapability)) return;

    updateState({ searchLoading: true });
    
    try {
      // Limpiar estado de búsquedas anteriores
      updateState({ 
        searchParams: {},
        error: null 
      });
      
      let response;
      
      // Limpiar filtros - solo incluir campos válidos, excluyendo propiedades de búsquedas anteriores
      const cleanFilters: Record<string, any> = {};
      Object.entries(filters).forEach(([key, value]) => {
        // Excluir propiedades que son específicas de otros tipos de búsqueda
        if (key !== 'term' && key !== 'autoFilter' && key !== 'quickFilter' && key !== 'search' && key !== 'fuzzy') {
          if (value !== undefined && value !== null && value !== '') {
            cleanFilters[key] = value;
          }
        }
      });
      
      // Decide which endpoint to use based on useExactSearch flag
      if (useExactSearch && apiService.search) {
        // Use /search endpoint for exact search
        response = await apiService.search(cleanFilters);
      } else if (apiService.advancedFilter) {
        // Use advanced filter endpoint POST /advanced-filter
        // Check if the API expects embedded pagination (authors, book-author-assignments pattern)
        // or separate parameters (books, genres, publishing-houses, inventory-movements pattern)
        const paginationParams = { 
          page, 
          limit: state.pageSize,
          ...(config.table?.defaultSort && {
            sortBy: config.table.defaultSort.field,
            sortOrder: config.table.defaultSort.direction
          })
        };
        
        // For services that expect embedded pagination (authors, book-author-assignments)
        if (config.entity === 'authors' || config.entity === 'book-author-assignments') {
          response = await apiService.advancedFilter({
            ...cleanFilters,
            pagination: paginationParams
          });
        } else {
          // For services that expect separate parameters (books, genres, publishing-houses, inventory-movements)
          response = await apiService.advancedFilter(cleanFilters, paginationParams);
        }
      } else {
        // No fallback - search/advancedFilter debe ser independiente
        const endpointType = useExactSearch ? 'search' : 'advanced filter';
        throw new Error(`${endpointType} endpoint not available for this entity`);
      }
      
      // Actualizar estado con los datos recibidos de la API
      updateState({
        data: response?.data || [],
        meta: response?.meta,
        isSearchMode: true,
        currentPage: page,
        searchParams: { advancedFilter: cleanFilters },
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

  // Quick Filter Handler - Uses GET /filter?term=...
  const handleQuickFilter = useCallback(async (term: string, page = 1) => {
    if (!config.capabilities.search.includes('simple' as SearchCapability)) return;

    updateState({ searchLoading: true });
    
    try {
      // Limpiar estado de búsquedas anteriores
      updateState({ 
        searchParams: {},
        error: null 
      });
      
      let response;
      
      if (apiService.quickFilter) {
        // Use quickFilter which calls GET /filter?term=...
        response = await apiService.quickFilter(term.trim(), {
          page,
          limit: state.pageSize
        });
      } else {
        // No fallback - quickFilter debe ser independiente
        throw new Error('Quick filter endpoint not available for this entity');
      }
      
      // Actualizar estado con los datos recibidos de la API
      updateState({
        data: response?.data || [],
        meta: response?.meta,
        isSearchMode: true,
        currentPage: page,
        searchParams: { quickFilter: term.trim() },
        searchLoading: false
      });
      
    } catch (error) {
      console.error(`Error quick filtering ${config.entity}:`, error);
      updateState({ 
        searchLoading: false,
        error: error?.message || 'Error en filtro rápido'
      });
    }
  }, [config, apiService, state.pageSize]);

  const handleClearSearch = useCallback(() => {
    updateState({
      isSearchMode: false,
      currentPage: 1,
      searchParams: {},
      error: null,
      searchLoading: false
    });
    
    // Recargar datos originales
    execute();
  }, [execute]);

  // Pagination Handlers
  const handlePageChange = useCallback((page: number) => {
    updateState({ currentPage: page });
    
    // If in search mode, re-execute the last search with the new page
    if (state.isSearchMode && state.searchParams) {
      if (state.searchParams.search) {
        // Re-execute simple search with new page
        handleSearch(state.searchParams.search, state.searchParams.fuzzy, page);
      } else if (state.searchParams.advancedFilter) {
        // Re-execute advanced filter with new page
        handleAdvancedFilter(state.searchParams.advancedFilter, page);
      } else if (state.searchParams.quickFilter) {
        // Re-execute quick filter with new page
        handleQuickFilter(state.searchParams.quickFilter, page);
      }
    }
  }, [state.isSearchMode, state.searchParams, handleSearch, handleAdvancedFilter, handleQuickFilter]);

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
    onQuickFilter: handleQuickFilter,
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