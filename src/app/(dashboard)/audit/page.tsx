'use client';

import { useEffect, useState } from 'react';
import { useApiRequest } from '@/hooks';
import { auditApi, AuditListParams } from '@/services/api/entities/audit';
import DynamicTable, { TableColumn, PaginationMeta } from '@/components/DynamicTable';
import PageWrapper from '@/components/PageWrapper';

export default function AuditPage() {
  const [params, setParams] = useState<AuditListParams>({ page: 1, limit: 10 });
  const [searchTerm, setSearchTerm] = useState('');

  const { loading, error, data, execute } = useApiRequest({
    endpoint: '/audit',
    method: 'GET',
    onSuccess: (response) => {
      console.log('Audit logs loaded:', response);
    },
    onError: (error) => {
      console.error('Error loading audit logs:', error);
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

  const columns: TableColumn[] = [
    { key: 'id', label: 'ID' },
    { key: 'action', label: 'Acción' },
    { key: 'entityType', label: 'Tipo Entidad' },
    { key: 'entityId', label: 'ID Entidad' },
    { key: 'userId', label: 'Usuario ID' },
    { 
      key: 'details', 
      label: 'Detalles',
      render: (value) => value ? JSON.stringify(value).substring(0, 50) + '...' : '-'
    },
    { 
      key: 'createdAt', 
      label: 'Fecha',
      render: (value) => new Date(value).toLocaleString()
    }
  ];

  if (error) {
    return (
      <PageWrapper title="Auditoría">
        <div>Error: {error}</div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper 
      title="Logs de Auditoría"
      breadcrumbs={['Auditoría']}
      showSearch
      onSearchChange={handleSearchChange}
      searchPlaceholder="Buscar en logs..."
    >
      <DynamicTable
        data={data?.data || []}
        columns={columns}
        meta={data?.meta as PaginationMeta}
        loading={loading}
        onPageChange={handlePageChange}
        actions={[]} // Sin acciones de editar/crear para logs de auditoría
        showCreateButton={false}
        entityName="log"
      />
    </PageWrapper>
  );
}