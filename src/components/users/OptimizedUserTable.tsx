"use client";

import React from 'react';
import OptimizedDynamicTable, { TableColumn } from '@/components/Table/OptimizedDynamicTable';
import { PaginationMeta } from '@/hooks/table/useTablePagination';
import { useTable } from '@/hooks/table/useTable';
import { UserResponseDto } from '@/types/api/entities';

// Componentes de celda especializados
import StatusCell from '@/components/Table/cells/StatusCell';
import DateCell from '@/components/Table/cells/DateCell';
import TextCell from '@/components/Table/cells/TextCell';

interface OptimizedUserTableProps {
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

export default function OptimizedUserTable({
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
}: OptimizedUserTableProps) {

  // Hook compuesto que maneja toda la lógica de la tabla
  const table = useTable({
    entityName: 'usuario',
    onPageChange,
    onSortChange,
    onSearchChange,
    onEdit,
    onDelete,
    onView,
    searchPlaceholder: 'Buscar usuarios...',
    searchDebounce: 300
  });

  // Definición de columnas con componentes especializados
  const columns: TableColumn[] = [
    {
      key: 'username',
      label: 'Usuario',
      render: (value) => <TextCell text={value} />
    },
    {
      key: 'email',
      label: 'Email',
      render: (value) => <TextCell text={value} />
    },
    {
      key: 'role',
      label: 'Rol',
      render: (value) => <TextCell text={value?.name} />
    },
    {
      key: 'isActive',
      label: 'Estado',
      render: (value) => (
        <StatusCell
          isActive={value}
          activeLabel="Activo"
          inactiveLabel="Inactivo"
        />
      ),
      sortable: false
    },
    {
      key: 'createdAt',
      label: 'Fecha Creación',
      render: (value) => <DateCell date={value} format="datetime" />
    },
    {
      key: 'updatedAt',
      label: 'Última Actualización',
      render: (value) => <DateCell date={value} format="datetime" />
    }
  ];

  return (
    <OptimizedDynamicTable
      // Datos
      data={data}
      columns={columns}
      meta={meta}
      loading={loading}

      // Configuración de la tabla desde el hook
      onPageChange={table.handlePageChange}
      sortConfig={table.sortConfig}
      onSortChange={table.handleSort}

      // Búsqueda
      showSearch={true}
      searchPlaceholder={table.placeholder}
      onSearchChange={table.handleSearchChange}

      // Acciones
      actions={table.actions}
      onEdit={table.handleEdit}
      onDelete={onDelete}
      onView={onView}

      // Botón de crear
      showCreateButton={true}
      onCreateClick={onCreateClick || table.handleCreate}

      // Configuración de visualización
      entityName="usuario"
      showStats={true}
      className="user-table"
    />
  );
}