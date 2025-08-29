'use client';

import { useEffect, useState } from 'react';
import { useApiRequest } from '@/hooks';
import { publishingHousesApi, PublishingHouseListParams } from '@/services/api/entities/publishing-houses';
import DynamicTable, { TableColumn, PaginationMeta } from '@/components/DynamicTable';
import PageWrapper from '@/components/PageWrapper';

export default function PublishersPage() {
  const [params, setParams] = useState<PublishingHouseListParams>({ page: 1, limit: 10 });
  const [searchTerm, setSearchTerm] = useState('');

  const { loading, error, data, execute } = useApiRequest({
    endpoint: '/publishing-houses',
    method: 'GET',
    onSuccess: (response) => {
      console.log('Publishers loaded:', response);
    },
    onError: (error) => {
      console.error('Error loading publishers:', error);
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

  const handleCreatePublisher = () => {
    console.log('Crear editorial');
  };

  const handleEditPublisher = (record: any) => {
    console.log('Editar editorial:', record);
  };

  const columns: TableColumn[] = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Nombre' },
    { key: 'country', label: 'País' },
    { key: 'website', label: 'Sitio Web' },
    { 
      key: 'foundedYear', 
      label: 'Año Fundación',
      render: (value) => value || '-'
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
      onClick: handleEditPublisher
    }
  ];

  if (error) {
    return (
      <PageWrapper title="Editoriales">
        <div>Error: {error}</div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper 
      title="Gestión de Editoriales"
      breadcrumbs={['Dashboard', 'Editoriales']}
      showSearch
      onSearchChange={handleSearchChange}
      searchPlaceholder="Buscar editoriales..."
    >
      <DynamicTable
        data={data?.data || []}
        columns={columns}
        meta={data?.meta as PaginationMeta}
        loading={loading}
        onPageChange={handlePageChange}
        actions={actions}
        showCreateButton
        onCreateClick={handleCreatePublisher}
        entityName="editorial"
      />
    </PageWrapper>
  );
}