import { DashboardEntityConfig } from "@/types/dashboard/entities";
import { AuditLogResponseDto } from "@/types/api/entities";
import { auditApi } from "@/services/api/entities/audit";
import { auditSearchConfig } from "@/config/search/audit.search";

export const auditConfig: DashboardEntityConfig<AuditLogResponseDto, never, never> = {
  // Basic entity information
  entity: "audit",
  displayName: "Logs de Auditoría",
  entityName: "log",

  // Entity capabilities - READ-ONLY entity with limited search
  capabilities: {
    crud: ['read'], // Only read - no create, update, or delete
    search: ['advanced'], // Only advanced search - no auto-search 
    export: true,
  },

  // API configuration
  api: {
    baseEndpoint: "/audit",
    endpoints: {
      list: "/audit",
      advancedFilter: "/audit/advanced-filter",
      export: "/audit/export",
    },
  },

  // Table configuration
  table: {
    columns: [
      { key: "action", label: "Acción", type: "text", sortable: true },
      { key: "performedBy", label: "Usuario", type: "text", sortable: true },
      { key: "entityType", label: "Entidad", type: "text", sortable: true },
      { 
        key: "details", 
        label: "Detalles", 
        type: "text",
        render: (value: string) => (value ? String(value).substring(0, 50) + "..." : "-")
      },
      { 
        key: "createdAt", 
        label: "Fecha", 
        type: "date", 
        sortable: true,
        render: (value: string) => new Date(value).toLocaleString()
      },
    ],
    // No actions for read-only entity
    actions: [
      { key: "view", label: "Ver", variant: "ver", handler: "onView" },
    ],
    defaultSort: { field: "createdAt", direction: "DESC" },
    pageSize: 10,
  },

  // Search configuration - Only advanced search
  search: {
    // No auto-search for audit logs
    autoSearch: {
      enabled: false,
      minChars: 3,
      debounceMs: 500,
      placeholder: "",
    },
    advancedSearch: {
      enabled: true,
      fields: auditSearchConfig,
    },
  },

  // Forms configuration - No forms for read-only entity
  forms: {
    // view: { component: ViewAuditModal }, // Could add if detailed view is needed
  },

  // Validation schemas - Not needed for read-only entity
  validation: {
    // entity: auditLogSchema,
  },

  // Custom configuration
  customConfig: {
    breadcrumbs: ["Auditoría"],
    autoFilterField: "filter", // Field used for auto-search (although disabled)
    csvFilename: "auditoria",
  },
};