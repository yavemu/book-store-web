'use client';

import InlineDashboardPage from '@/components/Dashboard/InlineDashboardPage';
import { createUnifiedDashboardProps } from '@/adapters/dashboardConfigAdapter';
import { authorsApi } from '@/services/api/entities/authors';
import type { BookAuthorResponseDto } from '@/types/api/entities';

const authorsConfig = {
  entityName: 'Autor',
  displayName: 'Gestión de Autores',
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
      key: 'firstName',
      label: 'Nombre',
      sortable: true,
      width: '150px'
    },
    {
      key: 'lastName',
      label: 'Apellido',
      sortable: true,
      width: '150px'
    },
    {
      key: 'nationality',
      label: 'Nacionalidad',
      sortable: true,
      width: '150px'
    },
    {
      key: 'birthDate',
      label: 'Fecha de Nacimiento',
      sortable: true,
      width: '150px',
      render: (value: string) => {
        if (!value) return '-';
        const date = new Date(value);
        return isNaN(date.getTime()) ? value : date.toLocaleDateString();
      }
    },
    {
      key: 'createdAt',
      label: 'Fecha de Registro',
      sortable: true,
      width: '150px',
      align: 'center' as const,
      render: (value: string) => value ? new Date(value).toLocaleDateString() : '-'
    },
    {
      key: 'updatedAt',
      label: 'Última Actualización',
      sortable: true,
      width: '150px',
      align: 'center' as const,
      render: (value: string) => value ? new Date(value).toLocaleDateString() : '-'
    }
  ],
  searchFields: [
    {
      key: 'firstName',
      label: 'Nombre',
      type: 'text' as const,
      placeholder: 'Ej: Gabriel (mín. 3 caracteres)'
    },
    {
      key: 'lastName',
      label: 'Apellido',
      type: 'text' as const,
      placeholder: 'Ej: García Márquez (mín. 3 caracteres)'
    },
    {
      key: 'nationality',
      label: 'Nacionalidad',
      type: 'text' as const,
      placeholder: 'Ej: Colombiana'
    },
    {
      key: 'birthYear',
      label: 'Año de Nacimiento',
      type: 'number' as const,
      placeholder: 'Ej: 1927'
    }
  ],
  formFields: [
    {
      key: 'firstName',
      label: 'Nombre',
      type: 'text' as const,
      required: true,
      placeholder: 'Ej: Gabriel'
    },
    {
      key: 'lastName',
      label: 'Apellido',
      type: 'text' as const,
      required: true,
      placeholder: 'Ej: García Márquez'
    },
    {
      key: 'nationality',
      label: 'Nacionalidad',
      type: 'text' as const,
      required: false, // nationality?: string en el DTO
      placeholder: 'Ej: Colombiana'
    },
    {
      key: 'birthDate',
      label: 'Fecha de Nacimiento',
      type: 'date' as const,
      required: false
    },
    {
      key: 'biography',
      label: 'Biografía',
      type: 'textarea' as const,
      required: false,
      placeholder: 'Descripción breve del autor...'
    }
  ]
};

const customHandlers = {
  onAfterCreate: (author: BookAuthorResponseDto) => {
    console.log('✅ Autor creado exitosamente:', author.firstName, author.lastName);
  },
  onAfterUpdate: (author: BookAuthorResponseDto) => {
    console.log('✅ Autor actualizado:', author.firstName, author.lastName);
  },
  onAfterDelete: (authorId: string) => {
    console.log('🗑️ Autor eliminado:', authorId);
  },
  onDataRefresh: () => {
    console.log('🔄 Datos de autores actualizados');
  }
};

export default function AuthorsPage() {
  const unifiedProps = createUnifiedDashboardProps(
    authorsConfig,
    authorsApi,
    customHandlers
  );

  return <InlineDashboardPage {...unifiedProps} />;
}