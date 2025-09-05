'use client';

import InlineDashboardPage from '@/components/Dashboard/InlineDashboardPage';
import { createUnifiedDashboardProps } from '@/adapters/dashboardConfigAdapter';
import { usersApi } from '@/services/api/entities/users';
import type { UserResponseDto } from '@/types/api/entities';

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
      key: 'role.name',
      label: 'Rol',
      sortable: true,
      width: '120px',
      align: 'center' as const,
      render: (value: string) => value === 'admin' ? 'Administrador' : 'Usuario'
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
  onAfterCreate: (user: UserResponseDto) => {
    console.log('✅ Usuario creado exitosamente:', user.email);
  },
  onAfterUpdate: (user: UserResponseDto) => {
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

  return <InlineDashboardPage {...unifiedProps} customComponents={customComponents} />;
}