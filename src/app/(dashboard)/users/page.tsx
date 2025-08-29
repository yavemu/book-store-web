'use client';

import { useEffect, useState } from 'react';
import { useApiRequest } from '@/hooks';
import { usersApi, UserListParams } from '@/services/api/entities/users';
import DynamicTable, { TableColumn, PaginationMeta } from '@/components/DynamicTable';
import PageWrapper from '@/components/PageWrapper';

export default function UsersPage() {
  const [params, setParams] = useState<UserListParams>({ page: 1, limit: 10 });
  const [searchTerm, setSearchTerm] = useState('');

  const { loading, error, data, execute } = useApiRequest({
    endpoint: '/users',
    method: 'GET',
    onSuccess: (response) => {
      console.log('Users loaded:', response);
    },
    onError: (error) => {
      console.error('Error loading users:', error);
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

  const handleCreateUser = () => {
    console.log('Crear usuario');
  };

  const handleEditUser = (record: any) => {
    console.log('Editar usuario:', record);
  };

  const columns: TableColumn[] = [
    { key: 'id', label: 'ID' },
    { key: 'username', label: 'Usuario' },
    { key: 'email', label: 'Email' },
    { 
      key: 'isActive', 
      label: 'Estado',
      render: (value) => value ? 'Activo' : 'Inactivo'
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
      onClick: handleEditUser
    }
  ];

  if (error) {
    return (
      <PageWrapper title="Usuarios">
        <div>Error: {error}</div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper 
      title="Gestión de Usuarios"
      breadcrumbs={['Dashboard', 'Usuarios']}
      showSearch
      onSearchChange={handleSearchChange}
      searchPlaceholder="Buscar usuarios..."
    >
      <DynamicTable
        data={data?.data || []}
        columns={columns}
        meta={data?.meta as PaginationMeta}
        loading={loading}
        onPageChange={handlePageChange}
        actions={actions}
        showCreateButton
        onCreateClick={handleCreateUser}
        entityName="usuario"
      />
    </PageWrapper>
  );
}