import { EntityUnifiedConfig, UnifiedFieldConfig } from "@/types/dashboard/unified-config";
import { AuditLogResponseDto } from "@/types/api/entities";

// Unified fields configuration - single source of truth for both table and search
const auditUnifiedFields: UnifiedFieldConfig[] = [
  {
    key: "action",
    label: "Acción",
    type: "select",
    table: {
      sortable: true,
      render: (value: string) => {
        const actionLabels = {
          'CREATE': 'Crear',
          'UPDATE': 'Actualizar',
          'DELETE': 'Eliminar',
          'LOGIN': 'Inicio Sesión',
          'LOGOUT': 'Cerrar Sesión'
        };
        return actionLabels[value as keyof typeof actionLabels] || value;
      }
    },
    search: {
      searchable: true,
      options: [
        { value: 'CREATE', label: 'Crear' },
        { value: 'UPDATE', label: 'Actualizar' },
        { value: 'DELETE', label: 'Eliminar' },
        { value: 'LOGIN', label: 'Inicio Sesión' },
        { value: 'LOGOUT', label: 'Cerrar Sesión' }
      ]
    }
  },
  {
    key: "entityType",
    label: "Tipo Entidad",
    type: "select",
    table: {
      sortable: true,
    },
    search: {
      searchable: true,
      options: [
        { value: 'User', label: 'Usuario' },
        { value: 'Book', label: 'Libro' },
        { value: 'Author', label: 'Autor' },
        { value: 'Genre', label: 'Género' },
        { value: 'Publisher', label: 'Editorial' },
        { value: 'InventoryMovement', label: 'Movimiento Inventario' }
      ]
    }
  },
  {
    key: "entityId",
    label: "ID Entidad",
    type: "text",
    table: {
      sortable: true,
    },
    search: {
      searchable: true,
      placeholder: "Ej: 123"
    }
  },
  {
    key: "userEmail",
    label: "Usuario",
    type: "email",
    table: {
      sortable: true,
    },
    search: {
      searchable: true,
      placeholder: "Ej: admin@email.com",
      validation: { minLength: 5 }
    }
  },
  {
    key: "timestamp",
    label: "Fecha/Hora",
    type: "date",
    table: {
      sortable: true,
      render: (value: string) => new Date(value).toLocaleString()
    },
    search: {
      searchable: false, // Dates are handled separately as date ranges
    }
  },
  {
    key: "details",
    label: "Detalles",
    type: "text",
    table: {
      sortable: false,
      render: (value: string) => value?.length > 50 ? `${value.substring(0, 50)}...` : value
    },
    search: {
      searchable: true,
      placeholder: "Ej: Descripción de la acción (mín. 3 caracteres)",
      validation: { minLength: 3 }
    }
  }
];

export const auditUnifiedConfig: EntityUnifiedConfig<AuditLogResponseDto> = {
  // Basic entity information
  entity: "audit",
  displayName: "Registro de Auditoría",
  entityName: "registro",
  entityNamePlural: "registros",

  // Unified fields - single source of truth
  fields: auditUnifiedFields,

  // Entity capabilities - Read-only for audit logs
  capabilities: {
    crud: ['read'], // Audit logs are typically read-only
    search: ['auto', 'simple', 'advanced'],
    export: true,
  },

  // API configuration
  api: {
    baseEndpoint: "/audit",
    endpoints: {
      list: "/audit",
      create: "", // Not applicable for audit logs
      read: "/audit/:id",
      update: "", // Not applicable for audit logs
      delete: "", // Not applicable for audit logs
      search: "/audit/search",
      filter: "/audit/filter",
      export: "/audit/export",
    },
  },

  // UI configuration
  ui: {
    defaultSort: { field: "timestamp", direction: "DESC" },
    pageSize: 20, // More entries per page for audit logs
    autoSearchField: "userEmail",
    autoSearchPlaceholder: "Búsqueda rápida registros (mín. 5 caracteres)",
    breadcrumbs: ["Auditoría"],
    csvFilename: "auditoria",
  },

  // Actions configuration - Only view for audit logs
  actions: [
    { key: "view", label: "Ver Detalles", variant: "ver", handler: "onView" },
  ],
};