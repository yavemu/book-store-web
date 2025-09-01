'use client';

import { useEffect, useState } from 'react';
import { useApiRequest, useDebounce, useAdvancedSearch } from '@/hooks';
import { genresApi, GenreListParams, GenreFilterParams } from '@/services/api/entities/genres';
import { genreFilterSchema, CreateGenreFormData, UpdateGenreFormData } from '@/services/validation/schemas/genres';
import { genresSearchConfig } from '@/config/searchConfigs';
import DynamicTable, { TableColumn, PaginationMeta, SortConfig, PaginationParams } from '@/components/DynamicTable';
import PageWrapper from '@/components/PageWrapper';
import ApiErrorState from '@/components/ErrorStates/ApiErrorState';
import AdvancedSearchForm, { SearchField, SearchFilters } from '@/components/AdvancedSearchForm';
import ActiveFiltersDisplay from '@/components/ActiveFiltersDisplay';
import InlineForm from '@/components/InlineForm';

export default function GenresPage() {
  const [params, setParams] = useState<GenreListParams>({ page: 1, limit: 10 });
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingGenre, setEditingGenre] = useState<any>(null);
  const [viewingGenre, setViewingGenre] = useState<any>(null);
  const [deletingGenre, setDeletingGenre] = useState<any>(null);
  // Remove individual sortConfig state - now managed by useAdvancedSearch

  // Use the standardized advanced search hook with shared pagination
  const {
    searchFilters,
    setSearchFilters,
    sharedPagination,
    searchLoading,
    searchError,
    searchData,
    advancedFilterLoading,
    advancedFilterError,
    advancedFilterData,
    isLoading: advancedSearchLoading,
    handleAdvancedSearch,
    handleAdvancedFilter,
    handleClearAdvancedSearch: clearAdvancedSearch,
    handlePaginationChange,
    handleSortChange,
    handleClearPagination,
    updatePaginationFromMeta
  } = useAdvancedSearch({
    config: genresSearchConfig,
    entityName: 'genres',
    defaultPagination: { page: 1, limit: params.limit || 10, sortBy: 'createdAt', sortOrder: 'DESC' }
  });

  const { loading, error, data, execute } = useApiRequest({
    apiFunction: () => {
      const apiParams = { 
        ...params, 
        sortBy: sharedPagination.sortBy, 
        sortOrder: sharedPagination.sortOrder 
      };
      console.log('Calling getAll with params:', apiParams);
      return genresApi.list(apiParams);
    },
    onSuccess: (response) => {
      console.log('Genres loaded (getAll):', response);
      console.log('Meta from getAll:', response?.meta);
      // Sync shared pagination with getAll response meta
      if (response?.meta) {
        handlePaginationChange({
          page: response.meta.currentPage,
          limit: response.meta.itemsPerPage
        });
      }
    },
    onError: (error) => {
      console.error('Error loading genres:', error);
    }
  });

  // Sync params with shared pagination when pagination changes
  useEffect(() => {
    const newParams = {
      page: sharedPagination.page,
      limit: sharedPagination.limit,
      sortBy: sharedPagination.sortBy,
      sortOrder: sharedPagination.sortOrder
    };
    
    // Only update params if they are different
    const isDifferent = Object.keys(newParams).some(key => 
      params[key as keyof typeof params] !== newParams[key as keyof typeof newParams]
    );
    
    if (isDifferent) {
      setParams(prev => ({ ...prev, ...newParams }));
    }
  }, [sharedPagination]);

  useEffect(() => {
    execute();
  }, [params]);

  const handlePageChange = (page: number) => {
    handlePaginationChange({ page });
    // params will be updated by the useEffect that watches sharedPagination
  };

  const handleTableSortChange = (field: string, direction: 'ASC' | 'DESC') => {
    handleSortChange(field, direction);
    // params will be updated by the useEffect that watches sharedPagination
  };

  const { loading: filterLoading, error: filterError, data: filterData, execute: executeFilter } = useApiRequest({
    apiFunction: (filterParams: GenreFilterParams) => {
      console.log('Calling genresApi.filter with params:', filterParams);
      return genresApi.filter(filterParams);
    },
    validationSchema: genreFilterSchema,
    onSuccess: (response) => {
      console.log('Filter response:', response);
      // Sync shared pagination with filter response meta
      if (response?.meta) {
        handlePaginationChange({
          page: response.meta.currentPage,
          limit: response.meta.itemsPerPage
        });
      }
    },
    onError: (error) => {
      console.error('Filter error:', error);
    }
  });

  // Debounced search term for API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  // Keep track of the last search term to avoid duplicate calls
  const [lastSearchTerm, setLastSearchTerm] = useState('');

  // Effect for handling debounced search - only call when value actually changes
  useEffect(() => {
    const trimmedValue = debouncedSearchTerm.trim();
    
    // Skip if it's the same value as before
    if (trimmedValue === lastSearchTerm) {
      return;
    }
    
    if (trimmedValue.length >= 3) {
      // Only call API when we have 3+ characters AND the value is different
      console.log('Executing search with term:', trimmedValue);
      setLastSearchTerm(trimmedValue);
      executeFilter({ 
        filter: trimmedValue, 
        page: 1, 
        limit: sharedPagination.limit,
        sortBy: sharedPagination.sortBy,
        sortOrder: sharedPagination.sortOrder
      });
    } else if (trimmedValue.length === 0 && lastSearchTerm.length >= 3) {
      // Only reset if we previously had a search active (3+ chars)
      console.log('Resetting search');
      setLastSearchTerm('');
      execute();
    }
    // Ignore cases where trimmedValue < 3 and lastSearchTerm < 3 (no action needed)
  }, [debouncedSearchTerm]);

  const { loading: createLoading, error: createError, execute: executeCreate } = useApiRequest({
    apiFunction: (data: CreateGenreFormData) => genresApi.create(data),
    onSuccess: (response) => {
      console.log('Genre created:', response);
      setShowForm(false);
      execute(); // Refresh the list
    },
    onError: (error) => {
      console.error('Error creating genre:', error);
    }
  });

  const { loading: updateLoading, error: updateError, execute: executeUpdate } = useApiRequest({
    apiFunction: ({ id, data }: { id: string; data: UpdateGenreFormData }) => genresApi.update(id, data),
    onSuccess: (response) => {
      console.log('Genre updated:', response);
      setShowForm(false);
      setEditingGenre(null);
      execute(); // Refresh the list
    },
    onError: (error) => {
      console.error('Error updating genre:', error);
    }
  });

  const handleCreateGenre = () => {
    setEditingGenre(null);
    setShowForm(true);
  };

  const handleViewGenre = (record: any) => {
    setViewingGenre(record);
  };

  const handleEditGenre = (record: any) => {
    setEditingGenre(record);
    setShowForm(true);
  };

  const { loading: deleteLoading, error: deleteError, execute: executeDelete } = useApiRequest({
    apiFunction: (id: string) => genresApi.delete(id),
    onSuccess: (response) => {
      console.log('Genre deleted:', response);
      setDeletingGenre(null);
      execute(); // Refresh the list
    },
    onError: (error) => {
      console.error('Error deleting genre:', error);
      // Keep modal open to show error
    }
  });

  const handleDeleteGenre = (record: any) => {
    setDeletingGenre(record);
  };

  const confirmDeleteGenre = () => {
    if (deletingGenre) {
      executeDelete(deletingGenre.id);
    }
  };

  const cancelDeleteGenre = () => {
    setDeletingGenre(null);
  };

  // Advanced Search Fields for Genres
  const searchFields: SearchField[] = [
    {
      key: 'name',
      label: 'Nombre',
      type: 'text',
      placeholder: 'Buscar por nombre...'
    },
    {
      key: 'description',
      label: 'Descripción',
      type: 'text',
      placeholder: 'Buscar por descripción...'
    }
  ];

  const handleClearAdvancedSearch = () => {
    clearAdvancedSearch();
    setParams({ page: 1, limit: 10 });
    // Clear search term to avoid conflicts
    setSearchTerm('');
    setLastSearchTerm('');
    // Reset to original data
    execute();
  };

  const genreFormFields = [
    {
      key: 'name',
      label: 'Nombre del Género',
      type: 'text' as const,
      required: true
    },
    {
      key: 'description',
      label: 'Descripción',
      type: 'text' as const,
      required: false
    }
  ];

  const handleFormSubmit = (formData: Record<string, any>) => {
    if (editingGenre) {
      // Update existing genre
      executeUpdate({ 
        id: editingGenre.id, 
        data: formData as UpdateGenreFormData 
      });
    } else {
      // Create new genre
      executeCreate(formData as CreateGenreFormData);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingGenre(null);
  };

  const handleRemoveFilter = (key: string) => {
    const newFilters = { ...searchFilters };
    delete newFilters[key];
    setSearchFilters(newFilters);
    // TODO: Update API request without this filter
  };

  const columns: TableColumn[] = [
    { key: 'name', label: 'Nombre', sortable: true },
    { key: 'description', label: 'Descripción', sortable: true },
    { 
      key: 'createdAt', 
      label: 'Creado',
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString()
    },
    { 
      key: 'updatedAt', 
      label: 'Actualizado',
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString()
    }
  ];

  const actions = [
    {
      label: 'Ver',
      onClick: handleViewGenre,
      variant: 'ver' as const
    },
    {
      label: 'Editar',
      onClick: handleEditGenre,
      variant: 'editar' as const
    },
    {
      label: 'Eliminar',
      onClick: handleDeleteGenre,
      variant: 'eliminar' as const
    }
  ];

  if (error) {
    return (
      <PageWrapper title="Géneros">
        <ApiErrorState
          error={error}
          canRetry={error.includes('conexión') || error.includes('servidor') || error.includes('NetworkError') || error.includes('Failed to fetch')}
          isRetrying={loading}
          onRetry={() => execute()}
          onReset={() => {
            setParams({ page: 1, limit: 10 });
            setSearchTerm('');
            execute();
          }}
          title="Error cargando géneros"
          description="No se pudieron cargar los géneros del sistema."
          showTechnicalDetails={true}
        />
      </PageWrapper>
    );
  }

  // Determine which data to display
  const displayData = filterData?.data || searchData?.data || advancedFilterData?.data || data?.data || [];
  const displayMeta = filterData?.meta || searchData?.meta || advancedFilterData?.meta || data?.meta;
  const isLoading = loading || filterLoading || searchLoading || advancedFilterLoading;
  
  

  return (
    <PageWrapper 
      title="Gestión de Géneros"
      breadcrumbs={['Géneros']}
    >
      {/* Advanced Search Form with exact match checkbox */}
      <AdvancedSearchForm
        fields={searchFields}
        onSearch={handleAdvancedSearch}
        onAdvancedFilter={handleAdvancedFilter}
        onClear={handleClearAdvancedSearch}
        loading={isLoading}
        entityName="géneros"
        initialFilters={searchFilters}
        isFiltering={advancedFilterLoading}
      />

      {/* Active Filters Display */}
      <ActiveFiltersDisplay
        filters={searchFilters}
        searchFields={searchFields}
        tableColumns={columns}
        onRemoveFilter={handleRemoveFilter}
        onClearAll={handleClearAdvancedSearch}
      />

      <DynamicTable
        data={displayData}
        columns={columns}
        meta={displayMeta as PaginationMeta}
        loading={isLoading}
        onPageChange={handlePageChange}
        actions={actions}
        showCreateButton
        onCreateClick={handleCreateGenre}
        entityName="género"
        showForm={showForm}
        showSearch
        searchPlaceholder={filterLoading ? "Buscando..." : "Buscar géneros... (mín. 3 caracteres)"}
        onSearchChange={handleSearchChange}
        sortConfig={{ field: sharedPagination.sortBy, direction: sharedPagination.sortOrder }}
        onSortChange={handleTableSortChange}
        paginationParams={sharedPagination}
        onClearPaginationParam={(param) => {
          if (param === 'sortBy') {
            handleSortChange('createdAt', 'DESC');
          } else if (param === 'limit') {
            handlePaginationChange({ limit: 10 });
          } else if (param === 'page') {
            handlePaginationChange({ page: 1 });
          }
          // params will be updated by the useEffect that watches sharedPagination
        }}
        formComponent={
          <InlineForm
            fields={genreFormFields}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
            title={editingGenre ? 'Editar Género' : 'Crear Nuevo Género'}
            submitLabel={editingGenre ? 'Actualizar' : 'Crear'}
            initialData={editingGenre ? { name: editingGenre.name, description: editingGenre.description } : {}}
            loading={createLoading || updateLoading}
          />
        }
        onFormToggle={() => setShowForm(!showForm)}
        isEditing={!!editingGenre}
        editingRecord={editingGenre}
      />

      {/* View Genre Modal - needs to be implemented */}
      {viewingGenre && (
        <div className="modal-overlay" onClick={() => setViewingGenre(null)}>
          <div className="modal-content view-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Detalles del Género</h3>
              <button 
                className="modal-close-button"
                onClick={() => setViewingGenre(null)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="view-list">
                <div className="view-row">
                  <span className="view-label">ID:</span>
                  <span className="view-value">{viewingGenre.id}</span>
                </div>
                <div className="view-row">
                  <span className="view-label">Nombre:</span>
                  <span className="view-value">{viewingGenre.name}</span>
                </div>
                <div className="view-row">
                  <span className="view-label">Descripción:</span>
                  <span className="view-value">{viewingGenre.description || 'Sin descripción'}</span>
                </div>
                <div className="view-row">
                  <span className="view-label">Creado:</span>
                  <span className="view-value">{new Date(viewingGenre.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="view-row">
                  <span className="view-label">Actualizado:</span>
                  <span className="view-value">{new Date(viewingGenre.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingGenre && (
        <div className="modal-overlay" onClick={cancelDeleteGenre}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">⚠️ Confirmar Eliminación</h3>
              <button 
                className="modal-close-button"
                onClick={cancelDeleteGenre}
                disabled={deleteLoading}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="delete-modal-content">
                <p className="delete-modal-question">
                  ¿Estás seguro de que deseas eliminar el género:
                </p>
                <div className="delete-modal-item-highlight">
                  "{deletingGenre.name}"
                </div>
                <p className="delete-modal-warning">
                  Esta acción no se puede deshacer.
                </p>
                
                {deleteError && (
                  <div className="delete-modal-error">
                    Error: {deleteError}
                  </div>
                )}
                
                <div className="delete-modal-actions">
                  <button
                    onClick={cancelDeleteGenre}
                    disabled={deleteLoading}
                    className="delete-modal-cancel-btn"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={confirmDeleteGenre}
                    disabled={deleteLoading}
                    className="delete-modal-confirm-btn"
                  >
                    {deleteLoading ? (
                      <>
                        <div className="delete-modal-spinner"></div>
                        Eliminando...
                      </>
                    ) : (
                      <>
                        🗑️ Eliminar Género
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </PageWrapper>
  );
}