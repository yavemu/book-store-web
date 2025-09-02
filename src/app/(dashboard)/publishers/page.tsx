'use client';

import UnifiedDashboardPage from '@/components/Dashboard/UnifiedDashboardPage';
import { createUnifiedDashboardProps } from '@/adapters/dashboardConfigAdapter';
import { publishingHousesApi } from '@/services/api/entities/publishing-houses';

const publishersConfig = {
  entityName: 'Editorial',
  displayName: 'Gestión de Editoriales',
  defaultPageSize: 10,
  defaultSort: {
    field: 'createdAt',
    direction: 'DESC' as const
  },
  capabilities: {
    crud: ['create', 'read', 'update', 'delete'],
    search: ['auto', 'simple', 'advanced'],
    export: true
  },
  columns: [
    {
      key: 'name',
      label: 'Nombre',
      sortable: true
    },
    {
      key: 'website',
      label: 'Website',
      sortable: false,
      render: (value: string) => value ? (value.length > 30 ? value.substring(0, 30) + "..." : value) : "-"
    },
    {
      key: 'contactEmail',
      label: 'Email',
      sortable: false,
      render: (value: string) => value || "-"
    },
    {
      key: 'booksCount',
      label: 'Libros',
      sortable: false,
      render: (value: number) => String(value || 0)
    },
    {
      key: 'isActive',
      label: 'Estado',
      sortable: true,
      render: (value: boolean) => value ? 'Activa' : 'Inactiva'
    }
  ],
  searchFields: [
    {
      key: 'name',
      label: 'Nombre',
      type: 'text' as const,
      placeholder: 'Ej: Planeta'
    },
    {
      key: 'website',
      label: 'Website',
      type: 'text' as const,
      placeholder: 'Ej: www.planeta.com'
    },
    {
      key: 'contactEmail',
      label: 'Email de Contacto',
      type: 'text' as const,
      placeholder: 'Ej: info@planeta.com'
    },
    {
      key: 'isActive',
      label: 'Estado',
      type: 'boolean' as const,
      options: [
        { value: true, label: 'Activa' },
        { value: false, label: 'Inactiva' }
      ]
    }
  ],
  formFields: [
    {
      key: 'name',
      label: 'Nombre',
      type: 'text' as const,
      required: true,
      placeholder: 'Ej: Planeta'
    },
    {
      key: 'country',
      label: 'País',
      type: 'text' as const,
      required: true,
      placeholder: 'Ej: España'
    },
    {
      key: 'website',
      label: 'Website',
      type: 'text' as const,
      required: false,
      placeholder: 'Ej: www.planeta.com'
    },
    {
      key: 'contactEmail',
      label: 'Email de Contacto',
      type: 'email' as const,
      required: false,
      placeholder: 'Ej: info@planeta.com'
    },
    {
      key: 'isActive',
      label: 'Estado',
      type: 'boolean' as const,
      required: false,
      placeholder: 'Activa'
    }
  ]
};

const customHandlers = {
  onAfterCreate: (publisher: any) => {
    console.log('✅ Editorial creada exitosamente:', publisher.name);
  },
  onAfterUpdate: (publisher: any) => {
    console.log('✅ Editorial actualizada:', publisher.name);
  },
  onAfterDelete: (publisherId: string) => {
    console.log('🗑️ Editorial eliminada:', publisherId);
  },
  onDataRefresh: () => {
    console.log('🔄 Datos de editoriales actualizados');
  }
};

export default function PublishersPage() {
  const unifiedProps = createUnifiedDashboardProps(
    publishersConfig,
    publishingHousesApi,
    customHandlers
  );

  return <UnifiedDashboardPage {...unifiedProps} />;
}