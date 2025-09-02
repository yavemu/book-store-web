'use client';

import UnifiedDashboardPage from '@/components/Dashboard/UnifiedDashboardPage';
import { createUnifiedDashboardProps } from '@/adapters/dashboardConfigAdapter';
import { authorsApi } from '@/services/api/entities/authors';

// Configuration for Authors module using unified system
const authorsUnifiedConfig = {
  entityName: 'Autor',
  displayName: 'Gestión de Autores',
  defaultPageSize: 10,
  defaultSort: {
    field: 'createdAt',
    direction: 'DESC' as const
  },
  capabilities: {
    crud: ['create', 'read', 'update', 'delete'],
    search: ['simple', 'advanced'],
    export: true
  },
  columns: [
    {
      key: 'firstName',
      label: 'Nombre',
      sortable: true,
      render: (value: string, record: any) => `${value} ${record.lastName || ''}`
    },
    {
      key: 'nationality',
      label: 'Nacionalidad',
      sortable: true
    },
    {
      key: 'birthDate',
      label: 'Fecha de Nacimiento',
      sortable: true,
      render: (value: string) => value ? new Date(value).toLocaleDateString() : '-'
    },
    {
      key: 'booksCount',
      label: 'Libros',
      sortable: false,
      render: (value: number) => value || 0
    },
    {
      key: 'isActive',
      label: 'Estado',
      sortable: true,
      render: (value: boolean) => value ? 'Activo' : 'Inactivo'
    }
  ],
  searchFields: [
    {
      key: 'firstName',
      label: 'Nombre',
      type: 'text' as const,
      placeholder: 'Ej: Gabriel'
    },
    {
      key: 'lastName',
      label: 'Apellido',
      type: 'text' as const,
      placeholder: 'Ej: García Márquez'
    },
    {
      key: 'nationality',
      label: 'Nacionalidad',
      type: 'text' as const,
      placeholder: 'Ej: Colombiana'
    },
    {
      key: 'birthDate',
      label: 'Fecha de Nacimiento',
      type: 'date' as const
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
  ]
};

// Custom handlers for Authors
const customHandlers = {
  onAfterCreate: (author: any) => {
    console.log('✅ Autor creado exitosamente:', author.firstName, author.lastName);
    // Here you could show a toast notification, track analytics, etc.
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

// Main Authors Page Component using Unified System
export default function AuthorsUnifiedPage() {
  // Create unified props from existing configuration
  const unifiedProps = createUnifiedDashboardProps(
    authorsUnifiedConfig,
    authorsApi,
    customHandlers
  );

  return (
    <div className="authors-page">
      <UnifiedDashboardPage {...unifiedProps} />
      
      {/* Debug Panel - Remove in production */}
      <div className="debug-panel" style={{ 
        position: 'fixed', 
        bottom: '20px', 
        right: '20px', 
        background: '#f0f0f0', 
        padding: '10px', 
        borderRadius: '5px',
        fontSize: '12px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        maxWidth: '300px'
      }}>
        <strong>🔧 Unified System Debug</strong>
        <br />
        <em>Sistema unificado de dashboard activo</em>
        <br />
        <small>
          • Estado compartido entre endpoints<br />
          • Paginación persistente<br />
          • Ordenamiento mantenido<br />
          • Operaciones tracked: list/search/filter/advanced
        </small>
      </div>
    </div>
  );
}