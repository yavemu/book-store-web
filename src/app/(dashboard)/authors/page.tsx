'use client';

import { useEffect, useState } from 'react';
import { useApiRequest } from '@/hooks';
import { authorsApi, AuthorListParams } from '@/services/api/entities/authors';
import DynamicTable, { TableColumn, PaginationMeta } from '@/components/DynamicTable';
import PageWrapper from '@/components/PageWrapper';

export default function AuthorsPage() {
  const [params, setParams] = useState<AuthorListParams>({ page: 1, limit: 10 });
  const [searchTerm, setSearchTerm] = useState('');

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
      onClick: handleEditAuthor
    }
  ];

  if (error) {
    return (
      <PageWrapper title="Autores">
        <div>Error: {error}</div>
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