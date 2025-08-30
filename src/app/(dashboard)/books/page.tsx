'use client';

import { useEffect, useState } from 'react';
import { useApiRequest } from '@/hooks';
import { BookListParams } from '@/services/api/entities/books';
import DynamicTable, { TableColumn } from '@/components/DynamicTable';
import PageWrapper from '@/components/PageWrapper';
import ApiErrorState from '@/components/ErrorStates/ApiErrorState';
import AdvancedSearchForm, { SearchField, SearchFilters } from '@/components/AdvancedSearchForm';
import ActiveFiltersDisplay from '@/components/ActiveFiltersDisplay';

export default function BooksPage() {
  const [params, setParams] = useState<BookListParams>({ page: 1, limit: 10 });
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({});

  const { loading, error, data, execute } = useApiRequest({
    endpoint: '/book-catalog',
    method: 'GET',
    onSuccess: () => {
      // Books loaded successfully
    },
    onError: (error) => {
      const errorMessage = error?.message || error?.error || 'Error desconocido al cargar libros';
      const errorDetails = {
        message: errorMessage,
        statusCode: error?.statusCode || 'unknown',
        timestamp: new Date().toISOString()
      };
      console.error('Error loading books:', errorDetails);
    }
  });

  useEffect(() => {
    execute();
  }, [params]);

  const handlePageChange = (page: number) => {
    setParams({ ...params, page });
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    // TODO: Implement search functionality
  };

  const handleCreate = () => {
    console.log('Create new book');
    // TODO: Implement create functionality
  };

  const handleEdit = (book: any) => {
    console.log('Edit book:', book);
    // TODO: Implement edit functionality
  };

  const handleDelete = (book: any) => {
    console.log('Delete book:', book);
    // TODO: Implement delete functionality
  };

  const handleView = (book: any) => {
    console.log('View book:', book);
    // TODO: Implement view functionality
  };

  // Advanced Search Fields for Books
  const searchFields: SearchField[] = [
    {
      key: 'title',
      label: 'Título',
      type: 'text',
      placeholder: 'Buscar por título...'
    },
    {
      key: 'isbn',
      label: 'ISBN',
      type: 'text',
      placeholder: 'Buscar por ISBN...'
    },
    {
      key: 'price',
      label: 'Precio',
      type: 'number',
      placeholder: 'Precio...'
    },
    {
      key: 'stock',
      label: 'Stock',
      type: 'number',
      placeholder: 'Cantidad en stock...'
    },
    {
      key: 'isAvailable',
      label: 'Disponible',
      type: 'select',
      options: [
        { value: 'true', label: 'Disponible' },
        { value: 'false', label: 'No Disponible' }
      ]
    },
    {
      key: 'genre',
      label: 'Género',
      type: 'text',
      placeholder: 'Buscar por género...'
    },
    {
      key: 'publisher',
      label: 'Editorial',
      type: 'text',
      placeholder: 'Buscar por editorial...'
    }
  ];

  const columns: TableColumn[] = [
    {
      key: 'title',
      label: 'Título',
      sortable: true
    },
    {
      key: 'isbn',
      label: 'ISBN',
      sortable: false
    },
    {
      key: 'price',
      label: 'Precio',
      sortable: true,
      render: (value) => `$${value || '0'}`
    },
    {
      key: 'stock',
      label: 'Stock',
      sortable: true
    },
    {
      key: 'isAvailable',
      label: 'Disponible',
      sortable: true,
      render: (value) => value ? 'Sí' : 'No'
    },
    {
      key: 'genre.name',
      label: 'Género',
      sortable: false,
      render: (value, row) => row?.genre?.name || 'N/A'
    },
    {
      key: 'publisher.name',
      label: 'Editorial',
      sortable: false,
      render: (value, row) => row?.publisher?.name || 'N/A'
    },
    {
      key: 'createdAt',
      label: 'Fecha Creación',
      sortable: true,
      render: (value) => value ? new Date(value).toLocaleDateString() : 'N/A'
    }
  ];

  const actions = [
    {
      label: 'Ver',
      onClick: handleView,
      variant: 'primary' as const
    },
    {
      label: 'Editar',
      onClick: handleEdit,
      variant: 'secondary' as const
    },
    {
      label: 'Eliminar',
      onClick: handleDelete,
      variant: 'danger' as const
    }
  ];

  const handleAdvancedSearch = (filters: SearchFilters) => {
    setSearchFilters(filters);
    console.log('Advanced search filters for books:', filters);
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

  if (error) {
    const canRetry = error.includes('conexión') || error.includes('servidor') || error.includes('NetworkError') || error.includes('Failed to fetch');
    
    return (
      <PageWrapper title="Libros" breadcrumbs={['Libros']}>
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
          title="Error cargando libros"
          description="No se pudieron cargar los libros del sistema."
          showTechnicalDetails={true}
        />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper 
      title="Libros" 
      breadcrumbs={['Libros']}
      onSearch={handleSearch}
      searchPlaceholder="Buscar libros por título, ISBN..."
    >
      {/* Advanced Search Form */}
      <AdvancedSearchForm
        fields={searchFields}
        onSearch={handleAdvancedSearch}
        onClear={handleClearAdvancedSearch}
        loading={loading}
        entityName="libros"
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
        meta={data?.meta}
        loading={loading}
        onPageChange={handlePageChange}
        actions={actions}
        showCreateButton={true}
        onCreateClick={handleCreate}
        createButtonLabel="Nuevo Libro"
        entityName="libro"
      />
    </PageWrapper>
  );
}