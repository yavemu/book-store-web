import { EntityUnifiedConfig, UnifiedFieldConfig } from "@/types/dashboard/unified-config";
import { InventoryMovementResponseDto, CreateInventoryMovementDto, UpdateInventoryMovementDto } from "@/types/api/entities";

// Unified fields configuration - single source of truth for both table and search
const inventoryMovementsUnifiedFields: UnifiedFieldConfig[] = [
  {
    key: "movementType",
    label: "Tipo Movimiento",
    type: "select",
    table: {
      sortable: true,
      width: "150px",
      render: (value: string) => {
        const typeLabels = {
          'PURCHASE': 'Compra',
          'SALE': 'Venta',
          'DISCOUNT': 'Descuento',
          'INCREASE': 'Incremento',
          'OUT_OF_STOCK': 'Sin Stock',
          'ARCHIVED': 'Archivado'
        };
        return typeLabels[value as keyof typeof typeLabels] || value;
      }
    },
    search: {
      searchable: true,
      options: [
        { value: 'PURCHASE', label: 'Compra' },
        { value: 'SALE', label: 'Venta' },
        { value: 'DISCOUNT', label: 'Descuento' },
        { value: 'INCREASE', label: 'Incremento' },
        { value: 'OUT_OF_STOCK', label: 'Sin Stock' },
        { value: 'ARCHIVED', label: 'Archivado' }
      ]
    }
  },
  {
    key: "status",
    label: "Estado",
    type: "select",
    table: {
      sortable: true,
      width: "120px",
      render: (value: string) => {
        const statusLabels = {
          'PENDING': 'Pendiente',
          'COMPLETED': 'Completado',
          'ERROR': 'Error'
        };
        return statusLabels[value as keyof typeof statusLabels] || value;
      }
    },
    search: {
      searchable: true,
      options: [
        { value: 'PENDING', label: 'Pendiente' },
        { value: 'COMPLETED', label: 'Completado' },
        { value: 'ERROR', label: 'Error' }
      ]
    }
  },
  {
    key: "entityType",
    label: "Tipo Entidad",
    type: "text",
    table: {
      sortable: true,
      width: "120px"
    },
    search: {
      searchable: true,
      placeholder: "Ej: book"
    }
  },
  {
    key: "quantityBefore",
    label: "Cantidad Anterior",
    type: "number",
    table: {
      sortable: true,
      width: "120px",
      align: "right" as const
    },
    search: {
      searchable: true,
      placeholder: "Ej: 10"
    }
  },
  {
    key: "quantityAfter",
    label: "Cantidad Nueva",
    type: "number",
    table: {
      sortable: true,
      width: "120px",
      align: "right" as const
    },
    search: {
      searchable: true,
      placeholder: "Ej: 15"
    }
  },
  {
    key: "priceBefore",
    label: "Precio Anterior",
    type: "number",
    table: {
      sortable: true,
      width: "120px",
      align: "right" as const,
      render: (value: number) => value ? `$${value.toFixed(2)}` : '-'
    },
    search: {
      searchable: true,
      placeholder: "Ej: 25.99"
    }
  },
  {
    key: "priceAfter",
    label: "Precio Nuevo",
    type: "number",
    table: {
      sortable: true,
      width: "120px",
      align: "right" as const,
      render: (value: number) => value ? `$${value.toFixed(2)}` : '-'
    },
    search: {
      searchable: true,
      placeholder: "Ej: 29.99"
    }
  },
  {
    key: "notes",
    label: "Notas",
    type: "text",
    table: {
      sortable: false,
      width: "200px",
      render: (value: string) => {
        if (!value) return '-';
        if (value.length > 50) {
          return (
            <div className="max-w-[200px] truncate" title={value}>
              {value}
            </div>
          );
        }
        return value;
      }
    },
    search: {
      searchable: true,
      placeholder: "Buscar en notas...",
      validation: { minLength: 3 }
    }
  },
  {
    key: "createdAt",
    label: "Fecha Creación",
    type: "date",
    table: {
      sortable: true,
      width: "150px",
      render: (value: string) => new Date(value).toLocaleDateString()
    },
    search: {
      searchable: false
    }
  }
];

export const inventoryMovementsUnifiedConfig: EntityUnifiedConfig<InventoryMovementResponseDto, CreateInventoryMovementDto, UpdateInventoryMovementDto> = {
  // Basic entity information
  entity: "inventory-movements",
  displayName: "Gestión de Movimientos de Inventario",
  entityName: "movimiento",
  entityNamePlural: "movimientos",

  // Unified fields - single source of truth
  fields: inventoryMovementsUnifiedFields,

  // Entity capabilities - Full CRUD + all search types + export
  capabilities: {
    crud: ['create', 'read', 'update', 'delete'],
    search: ['auto', 'simple', 'advanced'],
    export: true,
  },

  // API configuration
  api: {
    baseEndpoint: "/inventory_movements",
    endpoints: {
      list: "/inventory_movements",
      create: "/inventory_movements",
      read: "/inventory_movements/:id",
      update: "/inventory_movements/:id",
      delete: "/inventory_movements/:id",
      search: "/inventory_movements/search",
      filter: "/inventory_movements/filter",
      export: "/inventory_movements/export",
    },
  },

  // UI configuration
  ui: {
    defaultSort: { field: "createdAt", direction: "DESC" },
    pageSize: 10,
    autoSearchField: "notes",
    autoSearchPlaceholder: "Búsqueda rápida movimientos (mín. 3 caracteres)",
    breadcrumbs: ["Inventario", "Movimientos"],
    csvFilename: "movimientos-inventario",
  },

  // Actions configuration
  actions: [
    { key: "view", label: "Ver", variant: "ver", handler: "onView" },
    { key: "edit", label: "Editar", variant: "editar", handler: "onEdit" },
    { key: "delete", label: "Eliminar", variant: "eliminar", handler: "onDelete" },
  ],
};