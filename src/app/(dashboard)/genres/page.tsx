'use client';

import { useEffect, useState } from 'react';
import { useApiRequest } from '@/hooks';
import { genresApi, GenreListParams } from '@/services/api/entities/genres';
import DynamicTable, { TableColumn, PaginationMeta } from '@/components/DynamicTable';
import PageWrapper from '@/components/PageWrapper';

export default function GenresPage() {
  const [params, setParams] = useState<GenreListParams>({ page: 1, limit: 10 });
  const [searchTerm, setSearchTerm] = useState('');

  const { loading, error, data, execute } = useApiRequest({
    endpoint: '/genres',
    method: 'GET',
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
    // Implementar búsqueda con debounce
  };

  const handleCreateGenre = () => {
    console.log('Crear género');
  };

  const handleEditGenre = (record: any) => {
    console.log('Editar género:', record);
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
      onClick: handleEditGenre
    }
  ];

  if (error) {
    return (
      <PageWrapper title="Géneros">
        <div>Error: {error}</div>
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