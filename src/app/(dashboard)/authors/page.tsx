'use client';

import DynamicTable, { PaginationMeta, TableColumn } from "@/components/DynamicTable";
import PageWrapper from "@/components/PageWrapper";
import ApiErrorState from '@/components/ErrorStates/ApiErrorState';
import AdvancedSearchForm, { SearchField, SearchFilters } from '@/components/AdvancedSearchForm';
import ActiveFiltersDisplay from '@/components/ActiveFiltersDisplay';
import { useApiRequest } from "@/hooks";
import { AuthorListParams } from "@/services/api/entities/authors";
import { useEffect, useState } from "react";

export default function AuthorsPage() {
  const [params, setParams] = useState<AuthorListParams>({ page: 1, limit: 10 });
  const [searchTerm, setSearchTerm] = useState('');
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({});

  const { loading, error, data, execute } = useApiRequest({
    endpoint: '/book-authors',
    method: 'GET',
    onSuccess: (response) => {
      console.log('Authors loaded:', response);
    },
    onError: (error) => {
      console.error('Error loading authors:', error);
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
    // Implementar búsqueda con debounce
  };

  const handleCreateAuthor = () => {
    console.log('Crear autor');
  };

  const handleEditAuthor = (record: any) => {
    console.log('Editar autor:', record);
  };

  // Advanced Search Fields for Authors
  const searchFields: SearchField[] = [
    {
      key: 'firstName',
      label: 'Nombre',
      type: 'text',
      placeholder: 'Buscar por nombre...'
    },
    {
      key: 'lastName',
      label: 'Apellido',
      type: 'text',
      placeholder: 'Buscar por apellido...'
    },
    {
      key: 'nationality',
      label: 'Nacionalidad',
      type: 'text',
      placeholder: 'Buscar por nacionalidad...'
    },
    {
      key: 'birthDate',
      label: 'Fecha Nacimiento',
      type: 'date',
      placeholder: 'Fecha de nacimiento...'
    }
  ];

  const handleAdvancedSearch = (filters: SearchFilters) => {
    setSearchFilters(filters);
    console.log('Advanced search filters for authors:', filters);
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
    { key: 'firstName', label: 'Nombre' },
    { key: 'lastName', label: 'Apellido' },
    { key: 'nationality', label: 'Nacionalidad' },
    { 
      key: 'birthDate', 
      label: 'Fecha Nacimiento',
      render: (value) => value ? new Date(value).toLocaleDateString() : '-'
    },
    { 
      key: 'createdAt', 
      label: 'Creado',
      render: (value) => new Date(value).toLocaleDateString()
    }
  ];

  const actions = [
    {
      label: 'Editar',
      onClick: handleEditAuthor,
      variant: 'secondary' as const
    }
  ];

  if (error) {
    const canRetry = error.includes('conexión') || error.includes('servidor') || error.includes('NetworkError') || error.includes('Failed to fetch');
    
    return (
      <PageWrapper title="Autores">
        <ApiErrorState
          error={error}
          canRetry={canRetry}
          isRetrying={loading}
          onRetry={() => execute()}
          onReset={() => {
            setParams({ page: 1, limit: 10 });
            setSearchTerm('');
            execute();
          }}
          title="Error cargando autores"
          description="No se pudieron cargar los autores del sistema."
          showTechnicalDetails={true}
        />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper 
      title="Gestión de Autores"
      breadcrumbs={['Autores']}
      showSearch
      onSearchChange={handleSearchChange}
      searchPlaceholder="Buscar autores..."
    >
      {/* Advanced Search Form */}
      <AdvancedSearchForm
        fields={searchFields}
        onSearch={handleAdvancedSearch}
        onClear={handleClearAdvancedSearch}
        loading={loading}
        entityName="autores"
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
        onCreateClick={handleCreateAuthor}
        entityName="autor"
      />
    </PageWrapper>
  );
}