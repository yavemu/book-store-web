'use client';

import InlineDashboardPage from '@/components/Dashboard/InlineDashboardPage';
import { createUnifiedDashboardProps } from '@/adapters/dashboardConfigAdapter';
import { authorsApi } from '@/services/api/entities/authors';

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
      key: 'name',
      label: 'Nombre',
      sortable: true,
      width: '250px',
      render: (value: string, record: any) => {
        // Si viene como nombre completo, lo usamos directamente
        // Si vienen firstName y lastName separados, los combinamos
        let fullName = value;
        if (!fullName) {
          fullName = record?.firstName && record?.lastName 
            ? `${record.firstName} ${record.lastName}` 
            : record?.firstName || record?.lastName || '-';
        }
        
        // Truncar texto largo y mostrar tooltip
        if (fullName && fullName.length > 30) {
          return `${fullName.substring(0, 30)}...`;
        }
        return fullName || '-';
      }
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
        // Manejar diferentes formatos de fecha
        const date = new Date(value);
        return isNaN(date.getTime()) ? value : date.toLocaleDateString();
      }
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
      placeholder: 'Ej: Gabriel García Márquez (mín. 3 caracteres)'
    },
    {
      key: 'nationality',
      label: 'Nacionalidad',
      type: 'text' as const,
      placeholder: 'Ej: Colombiana (mín. 3 caracteres)'
    },
    {
      key: 'birthDate',
      label: 'Fecha de Nacimiento',
      type: 'date' as const
    },
    {
      key: 'booksCount',
      label: 'Libros',
      type: 'number' as const,
      placeholder: 'Ej: 5'
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
  onAfterCreate: (author: any) => {
    console.log('✅ Autor creado exitosamente:', author.firstName, author.lastName);
  },
  onAfterUpdate: (author: any) => {
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