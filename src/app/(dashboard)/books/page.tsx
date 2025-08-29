'use client';

import { useEffect, useState } from 'react';
import { useApiRequest } from '@/hooks';
import { booksApi, BookListParams } from '@/services/api/entities/books';
import DynamicTable, { TableColumn, PaginationMeta } from '@/components/DynamicTable';
import PageWrapper from '@/components/PageWrapper';

export default function BooksPage() {
  const [params, setParams] = useState<BookListParams>({ page: 1, limit: 10 });
  const [searchTerm, setSearchTerm] = useState('');

  const { loading, error, data, execute } = useApiRequest({
    endpoint: '/book-catalog',
    method: 'GET',
    onSuccess: (response) => {
      console.log('Books loaded:', response);
    },
    onError: (error) => {
      console.error('Error loading books:', error);
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

  if (error) {
    return (
      <PageWrapper title="Libros" breadcrumbs={['Dashboard', 'Libros']}>
        <div style={{ color: 'red', textAlign: 'center', padding: '20px' }}>
          Error cargando libros: {error}
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper 
      title="Libros" 
      breadcrumbs={['Dashboard', 'Libros']}
      onSearch={handleSearch}
      searchPlaceholder="Buscar libros por título, ISBN..."
    >
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