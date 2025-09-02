'use client';

import InlineDashboardPage from '@/components/Dashboard/InlineDashboardPage';
import { createUnifiedDashboardProps } from '@/adapters/dashboardConfigAdapter';
import { auditApi } from '@/services/api/entities/audit';

const auditConfig = {
  entityName: 'Log de Auditoría',
  displayName: 'Auditoría del Sistema',
  defaultPageSize: 10,
  defaultSort: {
    field: 'createdAt',
    direction: 'DESC' as const
  },
  capabilities: {
    crud: ['read'], // Solo lectura
    search: ['auto', 'simple', 'advanced'],
    export: true
  },
  columns: [
    {
      key: 'action',
      label: 'Acción',
      sortable: true
    },
    {
      key: 'entity',
      label: 'Entidad',
      sortable: true
    },
    {
      key: 'entityId',
      label: 'ID Entidad',
      sortable: false,
      render: (value: string) => value ? `#${value.substring(0, 8)}...` : '-'
    },
    {
      key: 'username',
      label: 'Usuario',
      sortable: true,
      render: (value: string, record: any) => record.user?.username || value || 'Sistema'
    },
    {
      key: 'ipAddress',
      label: 'IP',
      sortable: false
    },
    {
      key: 'createdAt',
      label: 'Fecha/Hora',
      sortable: true,
      render: (value: string) => value ? new Date(value).toLocaleString() : '-'
    }
  ],
  searchFields: [
    {
      key: 'action',
      label: 'Acción',
      type: 'select' as const,
      options: [
        { value: 'CREATE', label: 'Crear' },
        { value: 'UPDATE', label: 'Actualizar' },
        { value: 'DELETE', label: 'Eliminar' },
        { value: 'LOGIN', label: 'Login' },
        { value: 'LOGOUT', label: 'Logout' }
      ]
    },
    {
      key: 'entity',
      label: 'Entidad',
      type: 'select' as const,
      options: [
        { value: 'USER', label: 'Usuario' },
        { value: 'BOOK', label: 'Libro' },
        { value: 'AUTHOR', label: 'Autor' },
        { value: 'GENRE', label: 'Género' },
        { value: 'PUBLISHER', label: 'Editorial' }
      ]
    },
    {
      key: 'username',
      label: 'Usuario',
      type: 'text' as const,
      placeholder: 'Ej: admin'
    },
    {
      key: 'ipAddress',
      label: 'Dirección IP',
      type: 'text' as const,
      placeholder: 'Ej: 192.168.1.1'
    },
    {
      key: 'createdAt',
      label: 'Fecha',
      type: 'date' as const
    }
  ]
};

const customHandlers = {
  onDataRefresh: () => {
    console.log('🔄 Datos de auditoría actualizados');
  }
};

export default function AuditPage() {
  const unifiedProps = createUnifiedDashboardProps(
    auditConfig,
    auditApi,
    customHandlers
  );

  return <InlineDashboardPage {...unifiedProps} />;
}