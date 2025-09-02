'use client';

import UnifiedDashboardPage from '@/components/Dashboard/UnifiedDashboardPage';
import { createUnifiedDashboardProps } from '@/adapters/dashboardConfigAdapter';
import { inventoryMovementsApi } from '@/services/api/entities/inventory-movements';

const inventoryConfig = {
  entityName: 'Movimiento',
  displayName: 'Gestión de Inventario',
  defaultPageSize: 10,
  defaultSort: {
    field: 'createdAt',
    direction: 'DESC' as const
  },
  capabilities: {
    crud: ['create', 'read', 'update'],
    search: ['auto', 'simple', 'advanced'],
    export: true
  },
  columns: [
    {
      key: 'bookTitle',
      label: 'Libro',
      sortable: true,
      render: (value: string, record: any) => `${value || record.book?.title || 'N/A'} - ISBN: ${record.book?.isbn || 'N/A'}`
    },
    {
      key: 'movementType',
      label: 'Tipo',
      sortable: true,
      render: (value: string) => value === 'IN' ? 'Entrada' : value === 'OUT' ? 'Salida' : 'Ajuste'
    },
    {
      key: 'quantity',
      label: 'Cantidad',
      sortable: true,
      render: (value: number, record: any) => {
        const prefix = record.movementType === 'IN' ? '+' : record.movementType === 'OUT' ? '-' : '±';
        return `${prefix}${value}`;
      }
    },
    {
      key: 'currentStock',
      label: 'Stock Actual',
      sortable: false,
      render: (value: number) => String(value || 0)
    },
    {
      key: 'reason',
      label: 'Motivo',
      sortable: false,
      render: (value: string) => value ? (value.length > 30 ? value.substring(0, 30) + '...' : value) : '-'
    },
    {
      key: 'createdAt',
      label: 'Fecha/Hora',
      sortable: true,
      render: (value: string) => value ? new Date(value).toLocaleString() : '-'
    }
  ],
  searchFields: [
    {
      key: 'bookTitle',
      label: 'Libro',
      type: 'text' as const,
      placeholder: 'Ej: Cien años de soledad'
    },
    {
      key: 'movementType',
      label: 'Tipo de Movimiento',
      type: 'select' as const,
      options: [
        { value: 'IN', label: 'Entrada' },
        { value: 'OUT', label: 'Salida' },
        { value: 'ADJUSTMENT', label: 'Ajuste' }
      ]
    },
    {
      key: 'quantity',
      label: 'Cantidad',
      type: 'number' as const,
      placeholder: 'Ej: 10'
    },
    {
      key: 'reason',
      label: 'Motivo',
      type: 'text' as const,
      placeholder: 'Ej: Compra, Venta, Ajuste'
    },
    {
      key: 'createdAt',
      label: 'Fecha',
      type: 'date' as const
    }
  ]
};

const customHandlers = {
  onAfterCreate: (movement: any) => {
    console.log('✅ Movimiento de inventario creado:', movement.id);
  },
  onAfterUpdate: (movement: any) => {
    console.log('✅ Movimiento actualizado:', movement.id);
  },
  onDataRefresh: () => {
    console.log('🔄 Datos de inventario actualizados');
  }
};

export default function InventoryMovementsPage() {
  const unifiedProps = createUnifiedDashboardProps(
    inventoryConfig,
    inventoryMovementsApi,
    customHandlers
  );

  return <UnifiedDashboardPage {...unifiedProps} />;
}