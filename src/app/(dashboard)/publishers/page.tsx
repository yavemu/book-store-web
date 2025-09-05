'use client';

import InlineDashboardPage from '@/components/Dashboard/InlineDashboardPage';
import { createUnifiedDashboardProps } from '@/adapters/dashboardConfigAdapter';
import { publishingHousesApi } from '@/services/api/entities/publishing-houses';
import type { PublishingHouseResponseDto } from '@/types/api/entities';

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
      sortable: true,
      width: '200px'
    },
    {
      key: 'websiteUrl',
      label: 'Website',
      sortable: false,
      width: '250px',
      render: (value: string) => value ? (value.length > 30 ? value.substring(0, 30) + "..." : value) : "-"
    },
    {
      key: 'description',
      label: 'Descripción',
      sortable: false,
      width: '200px',
      render: (value: string) => value ? (value.length > 30 ? value.substring(0, 30) + "..." : value) : "-"
    },
    {
      key: 'booksCount',
      label: 'Libros',
      sortable: false,
      width: '80px',
      align: 'center' as const,
      render: (value: number) => String(value || 0)
    },
    {
      key: 'isActive',
      label: 'Estado',
      sortable: true,
      width: '100px',
      align: 'center' as const,
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
      key: 'websiteUrl',
      label: 'Website',
      type: 'text' as const,
      placeholder: 'Ej: https://www.planeta.com'
    },
    {
      key: 'description',
      label: 'Descripción',
      type: 'text' as const,
      placeholder: 'Ej: Editorial española'
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
      required: false, // country?: string en el DTO
      placeholder: 'Ej: España'
    },
    {
      key: 'websiteUrl',
      label: 'Website',
      type: 'text' as const,
      required: false,
      placeholder: 'Ej: https://www.planeta.com'
    },
    {
      key: 'description',
      label: 'Descripción',
      type: 'textarea' as const,
      required: false,
      placeholder: 'Descripción de la editorial...'
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

  return <InlineDashboardPage {...unifiedProps} />;
}