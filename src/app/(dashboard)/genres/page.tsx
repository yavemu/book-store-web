'use client';

import InlineDashboardPage from '@/components/Dashboard/InlineDashboardPage';
import { createUnifiedDashboardProps } from '@/adapters/dashboardConfigAdapter';
import { genresApi } from '@/services/api/entities/genres';

const genresConfig = {
  entityName: 'Género',
  displayName: 'Gestión de Géneros',
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
      key: 'description',
      label: 'Descripción',
      sortable: false,
      width: '400px',
      render: (value: string) => value ? (value.length > 50 ? value.substring(0, 50) + '...' : value) : '-'
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
      render: (value: boolean) => value ? 'Activo' : 'Inactivo'
    }
  ],
  searchFields: [
    {
      key: 'name',
      label: 'Nombre',
      type: 'text' as const,
      placeholder: 'Ej: Ficción'
    },
    {
      key: 'description',
      label: 'Descripción',
      type: 'text' as const,
      placeholder: 'Ej: Novelas de ficción'
    },
    {
      key: 'isActive',
      label: 'Estado',
      type: 'boolean' as const,
      options: [
        { value: true, label: 'Activo' },
        { value: false, label: 'Inactivo' }
      ]
    }
  ],
  formFields: [
    {
      key: 'name',
      label: 'Nombre',
      type: 'text' as const,
      required: true,
      placeholder: 'Ej: Ficción'
    },
    {
      key: 'description',
      label: 'Descripción',
      type: 'textarea' as const,
      required: false,
      placeholder: 'Descripción del género...'
    }
  ]
};

const customHandlers = {
  onAfterCreate: (genre: any) => {
    console.log('✅ Género creado exitosamente:', genre.name);
  },
  onAfterUpdate: (genre: any) => {
    console.log('✅ Género actualizado:', genre.name);
  },
  onAfterDelete: (genreId: string) => {
    console.log('🗑️ Género eliminado:', genreId);
  },
  onDataRefresh: () => {
    console.log('🔄 Datos de géneros actualizados');
  }
};

export default function GenresPage() {
  const unifiedProps = createUnifiedDashboardProps(
    genresConfig,
    genresApi,
    customHandlers
  );

  return <InlineDashboardPage {...unifiedProps} />;
}