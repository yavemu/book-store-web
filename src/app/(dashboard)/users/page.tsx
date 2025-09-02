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
      sortable: true,
      width: '150px'
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true,
      width: '250px'
    },
    {
      key: 'role',
      label: 'Rol',
      sortable: true,
      width: '120px',
      align: 'center' as const,
      render: (value: string) => value === 'admin' ? 'Administrador' : 
                                      value === 'librarian' ? 'Bibliotecario' : 'Usuario'
    },
    {
      key: 'isActive',
      label: 'Estado',
      sortable: true,
      width: '100px',
      align: 'center' as const,
      render: (value: boolean) => value ? 'Activo' : 'Inactivo'
    },
    {
      key: 'createdAt',
      label: 'Registro',
      sortable: true,
      width: '120px',
      align: 'center' as const,
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
      key: 'roleId',
      label: 'Rol',
      type: 'select' as const,
      options: [], // Se debe llenar dinámicamente
      placeholder: 'Seleccionar rol'
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
      key: 'roleId',
      label: 'Rol',
      type: 'select' as const,
      required: true,
      options: [], // Se debe llenar dinámicamente desde el API de roles
      placeholder: 'Seleccionar rol'
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

  // Use custom form component for users
  const customComponents = {
    form: () => import('@/components/users/UserForm').then(mod => mod.default)
  };

  return <UnifiedDashboardPage {...unifiedProps} customComponents={customComponents} />;
}