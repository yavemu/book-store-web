'use client';

import { useEffect, useState } from 'react';
import { useApiRequest } from '@/hooks';
import { bookCatalogApi } from '@/services/api/entities/book-catalog';
import { BookCatalogListParams } from '@/types/domain';
import DynamicTable, { TableColumn } from '@/components/DynamicTable';
import PageWrapper from '@/components/PageWrapper';
import ApiErrorState from '@/components/ErrorStates/ApiErrorState';
import AdvancedSearchForm, { SearchField, SearchFilters } from '@/components/AdvancedSearchForm';
import ActiveFiltersDisplay from '@/components/ActiveFiltersDisplay';
import BookMovementsModal from '@/components/BookMovementsModal';

export default function BooksPage() {
  const [params, setParams] = useState<BookCatalogListParams>({ page: 1, limit: 10 });
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({});
  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [isMovementsModalOpen, setIsMovementsModalOpen] = useState(false);
  const [hasActiveFilters, setHasActiveFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const { loading, error, data, execute } = useApiRequest({
    apiFunction: () => bookCatalogApi.list(params),
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
    
    // Check if any filters are active
    const hasSearch = term && term.trim() !== '';
    const hasFilters = Object.values(searchFilters).some(filterValue => filterValue && filterValue !== '');
    setHasActiveFilters(hasSearch || hasFilters);
    
    // TODO: Implement search functionality
    console.log('Search term:', term);
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

  const handleViewMovements = (book: any) => {
    setSelectedBook(book);
    setIsMovementsModalOpen(true);
  };

  const handleCloseMovementsModal = () => {
    setIsMovementsModalOpen(false);
    setSelectedBook(null);
  };

  const handleDownloadCSV = () => {
    if (!hasActiveFilters) return;
    
    // Create query parameters from current filters and search
    const queryParams = new URLSearchParams();
    
    // Add search filters
    Object.entries(searchFilters).forEach(([key, value]) => {
      if (value && value !== '') {
        queryParams.append(key, value.toString());
      }
    });

    // Add search term if exists
    if (searchTerm && searchTerm.trim() !== '') {
      queryParams.append('search', searchTerm.trim());
    }

    // Call CSV export endpoint
    const csvEndpoint = `/book-catalog/export/csv?${queryParams.toString()}`;
    console.log('Downloading CSV with filters:', csvEndpoint);
    
    // TODO: Implement actual CSV download
    // This would typically trigger a download via the API
    alert(`CSV download would be triggered for: ${csvEndpoint}`);
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
      label: 'Ver Movimientos',
      onClick: handleViewMovements,
      variant: 'secondary' as const
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
    
    // Check if any filters are active
    const hasFilters = Object.values(filters).some(value => value && value !== '');
    const hasSearch = searchTerm && searchTerm.trim() !== '';
    setHasActiveFilters(hasFilters || hasSearch);
    
    // TODO: Add filters to API request
  };

  const handleClearAdvancedSearch = () => {
    setSearchFilters({});
    setSearchTerm('');
    setParams({ page: 1, limit: 10 });
    setHasActiveFilters(false);
    // TODO: Clear filters from API request
  };

  const handleRemoveFilter = (key: string) => {
    const newFilters = { ...searchFilters };
    delete newFilters[key];
    setSearchFilters(newFilters);
    
    // Check if any filters are still active
    const hasFilters = Object.values(newFilters).some(value => value && value !== '');
    const hasSearch = searchTerm && searchTerm.trim() !== '';
    setHasActiveFilters(hasFilters || hasSearch);
    
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
      showCsvDownload
      onCsvDownload={handleDownloadCSV}
      csvDownloadEnabled={hasActiveFilters}
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

      {/* Modal de Movimientos de Inventario */}
      <BookMovementsModal
        isOpen={isMovementsModalOpen}
        onClose={handleCloseMovementsModal}
        book={selectedBook}
      />
    </PageWrapper>
  );
}