"use client";

import React from 'react';
import ResponsiveDynamicTable from '@/components/Table/ResponsiveDynamicTable';
import { ResponsiveColumn } from '@/hooks/table/useResponsiveTable';
import { PaginationMeta } from '@/hooks/table/useTablePagination';
import { UserResponseDto } from '@/types/api/entities';

// Componentes de celda especializados
import CompactStatusCell from '@/components/Table/cells/CompactStatusCell';
import CompactDateCell from '@/components/Table/cells/CompactDateCell';
import AdaptiveTextCell from '@/components/Table/cells/AdaptiveTextCell';

interface ResponsiveUserTableProps {
  data: UserResponseDto[];
  meta?: PaginationMeta;
  loading: boolean;
  onPageChange: (page: number) => void;
  onSearchChange?: (value: string) => void;
  onSortChange?: (field: string, direction: 'ASC' | 'DESC') => void;
  onEdit?: (user: UserResponseDto) => void;
  onDelete?: (user: UserResponseDto) => void;
  onView?: (user: UserResponseDto) => void;
  onCreateClick?: () => void;
}

export default function ResponsiveUserTable({
  data,
  meta,
  loading,
  onPageChange,
  onSearchChange,
  onSortChange,
  onEdit,
  onDelete,
  onView,
  onCreateClick
}: ResponsiveUserTableProps) {

  // Definición de columnas con prioridades para responsividad
  const columns: ResponsiveColumn[] = [
    {
      key: 'username',
      label: 'Usuario',
      priority: 'essential', // Siempre visible
      minWidth: 120,
      render: (value) => (
        <AdaptiveTextCell 
          text={value} 
          maxLength={20}
          expandable={false}
        />
      )
    },
    {
      key: 'email',
      label: 'Email',
      priority: 'high', // Visible en sm+
      minWidth: 160,
      render: (value) => (
        <AdaptiveTextCell 
          text={value} 
          maxLength={25}
          expandable={false}
        />
      )
    },
    {
      key: 'role',
      label: 'Rol',
      priority: 'essential', // Siempre visible
      minWidth: 80,
      render: (value) => (
        <AdaptiveTextCell 
          text={value?.name} 
          maxLength={15}
        />
      )
    },
    {
      key: 'isActive',
      label: 'Estado',
      priority: 'high', // Visible en sm+
      minWidth: 80,
      maxWidth: 100,
      render: (value) => (
        <CompactStatusCell
          isActive={value}
          activeLabel="Activo"
          inactiveLabel="Inactivo"
          showText={true} // Se adaptará automáticamente
          size="sm"
        />
      ),
      sortable: false
    },
    {
      key: 'createdAt',
      label: 'Creado',
      priority: 'medium', // Visible en md+
      minWidth: 100,
      render: (value) => (
        <CompactDateCell 
          date={value} 
          format="relative"
        />
      )
    },
    {
      key: 'updatedAt',
      label: 'Actualizado',
      priority: 'low', // Visible en lg+
      minWidth: 100,
      render: (value) => (
        <CompactDateCell 
          date={value} 
          format="relative"
        />
      )
    },
  ];

  return (
    <ResponsiveDynamicTable
      // Datos
      data={data}
      columns={columns}
      meta={meta}
      loading={loading}

      // Paginación y ordenamiento
      onPageChange={onPageChange}
      onSortChange={onSortChange}

      // Búsqueda
      showSearch={true}
      searchPlaceholder="Buscar usuarios..."
      onSearchChange={onSearchChange}

      // Acciones
      onEdit={onEdit}
      onDelete={onDelete}
      onView={onView}

      // Botón de crear
      showCreateButton={true}
      onCreateClick={onCreateClick}

      // Configuración de visualización
      entityName="usuario"
      className="user-table-responsive"
      
      // Configuración responsiva
      enableHorizontalScroll={true}
      showHiddenColumnsButton={true}
    />
  );
}