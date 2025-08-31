'use client';

import { useEffect, useState } from 'react';
import { useApiRequest } from '@/hooks';
import { genresApi, GenreListParams } from '@/services/api/entities/genres';
import DynamicTable, { TableColumn, PaginationMeta } from '@/components/DynamicTable';
import PageWrapper from '@/components/PageWrapper';
import ApiErrorState from '@/components/ErrorStates/ApiErrorState';
import AdvancedSearchForm, { SearchField, SearchFilters } from '@/components/AdvancedSearchForm';
import ActiveFiltersDisplay from '@/components/ActiveFiltersDisplay';

export default function GenresPage() {
  const [params, setParams] = useState<GenreListParams>({ page: 1, limit: 10 });
  const [searchTerm, setSearchTerm] = useState('');
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({});

  const { loading, error, data, execute } = useApiRequest({
    apiFunction: () => genresApi.list(params),
    onSuccess: (response) => {
      console.log('Genres loaded:', response);
    },
    onError: (error) => {
      console.error('Error loading genres:', error);
    }
  });

  useEffect(() => {
    execute();
  }, [params]);

  const handlePageChange = (page: number) => {
    setParams({ ...params, page });
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    
    // Implementar búsqueda con debounce si hay texto
    if (value && value.trim().length >= 3) {
      // Use quick filter for real-time search
      genresApi.filter({ filter: value.trim(), page: 1, limit: params.limit }).then(response => {
        console.log('Quick filter response:', response);
      }).catch(error => {
        console.error('Quick filter error:', error);
      });
    }
  };

  const handleCreateGenre = () => {
    console.log('Crear género');
  };

  const handleEditGenre = (record: any) => {
    console.log('Editar género:', record);
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

  const handleAdvancedSearch = (filters: SearchFilters) => {
    setSearchFilters(filters);
    console.log('Advanced search filters for genres:', filters);
    setParams({ ...params, page: 1 });
    // TODO: Add filters to API request
  };

  const handleClearAdvancedSearch = () => {
    setSearchFilters({});
    setParams({ page: 1, limit: 10 });
    // TODO: Clear filters from API request
  };

  const handleRemoveFilter = (key: string) => {
    const newFilters = { ...searchFilters };
    delete newFilters[key];
    setSearchFilters(newFilters);
    // TODO: Update API request without this filter
  };

  const columns: TableColumn[] = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Nombre' },
    { key: 'description', label: 'Descripción' },
    { 
      key: 'createdAt', 
      label: 'Creado',
      render: (value) => new Date(value).toLocaleDateString()
    },
    { 
      key: 'updatedAt', 
      label: 'Actualizado',
      render: (value) => new Date(value).toLocaleDateString()
    }
  ];

  const actions = [
    {
      label: 'Editar',
      onClick: handleEditGenre,
      variant: 'secondary' as const
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

  return (
    <PageWrapper 
      title="Gestión de Géneros"
      breadcrumbs={['Géneros']}
      showSearch
      onSearchChange={handleSearchChange}
      searchPlaceholder="Buscar géneros..."
    >
      {/* Advanced Search Form */}
      <AdvancedSearchForm
        fields={searchFields}
        onSearch={handleAdvancedSearch}
        onClear={handleClearAdvancedSearch}
        loading={loading}
        entityName="géneros"
        initialFilters={searchFilters}
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
        data={data?.data || []}
        columns={columns}
        meta={data?.meta as PaginationMeta}
        loading={loading}
        onPageChange={handlePageChange}
        actions={actions}
        showCreateButton
        onCreateClick={handleCreateGenre}
        entityName="género"
      />
    </PageWrapper>
  );
}