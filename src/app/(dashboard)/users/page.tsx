'use client';

import UnifiedDashboardPage from '@/components/Dashboard/UnifiedDashboardPage';
import { createUnifiedDashboardProps } from '@/adapters/dashboardConfigAdapter';
import { usersApi } from '@/services/api/entities/users';

const usersConfig = {
  entityName: 'Usuario',
  displayName: 'Gestión de Usuarios',
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
      key: 'username',
      label: 'Usuario',
      sortable: true
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true
    },
    {
      key: 'role',
      label: 'Rol',
      sortable: true,
      render: (value: string) => value === 'admin' ? 'Administrador' : 
                                      value === 'librarian' ? 'Bibliotecario' : 'Usuario'
    },
    {
      key: 'isActive',
      label: 'Estado',
      sortable: true,
      render: (value: boolean) => value ? 'Activo' : 'Inactivo'
    },
    {
      key: 'createdAt',
      label: 'Registro',
      sortable: true,
      render: (value: string) => value ? new Date(value).toLocaleDateString() : '-'
    }
  ],
  searchFields: [
    {
      key: 'username',
      label: 'Usuario',
      type: 'text' as const,
      placeholder: 'Ej: admin'
    },
    {
      key: 'email',
      label: 'Email',
      type: 'text' as const,
      placeholder: 'Ej: admin@demo.com'
    },
    {
      key: 'role',
      label: 'Rol',
      type: 'select' as const,
      options: [
        { value: 'admin', label: 'Administrador' },
        { value: 'librarian', label: 'Bibliotecario' },
        { value: 'user', label: 'Usuario' }
      ]
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
      key: 'username',
      label: 'Usuario',
      type: 'text' as const,
      required: true,
      placeholder: 'Ej: admin'
    },
    {
      key: 'email',
      label: 'Email',
      type: 'email' as const,
      required: true,
      placeholder: 'Ej: admin@demo.com'
    },
    {
      key: 'password',
      label: 'Contraseña',
      type: 'text' as const,
      required: true,
      placeholder: 'Contraseña segura...'
    },
    {
      key: 'role',
      label: 'Rol',
      type: 'select' as const,
      required: true,
      options: [
        { value: 'admin', label: 'Administrador' },
        { value: 'librarian', label: 'Bibliotecario' },
        { value: 'user', label: 'Usuario' }
      ]
    },
    {
      key: 'isActive',
      label: 'Estado',
      type: 'boolean' as const,
      required: false,
      placeholder: 'Activo'
    }
  ]
};

const customHandlers = {
  onAfterCreate: (user: any) => {
    console.log('✅ Usuario creado exitosamente:', user.email);
  },
  onAfterUpdate: (user: any) => {
    console.log('✅ Usuario actualizado:', user.email);
  },
  onAfterDelete: (userId: string) => {
    console.log('🗑️ Usuario eliminado:', userId);
  },
  onDataRefresh: () => {
    console.log('🔄 Datos de usuarios actualizados');
  }
};

export default function UsersPage() {
  const unifiedProps = createUnifiedDashboardProps(
    usersConfig,
    usersApi,
    customHandlers
  );

  return <UnifiedDashboardPage {...unifiedProps} />;
}