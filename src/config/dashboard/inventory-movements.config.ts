import { DashboardEntityConfig } from "@/types/dashboard/entities";
import { InventoryMovementResponseDto, CreateInventoryMovementDto, UpdateInventoryMovementDto } from "@/types/api/entities";
import { inventoryMovementsApi } from "@/services/api/entities/inventory-movements";

export const inventoryMovementsConfig: DashboardEntityConfig<InventoryMovementResponseDto, CreateInventoryMovementDto, UpdateInventoryMovementDto> = {
  // Basic entity information
  entity: "inventory-movements",
  displayName: "Movimientos de Movimientos",
  entityName: "movimiento",

  // Entity capabilities - Read + limited updates (stock adjustments)
  capabilities: {
    crud: ["create", "read"], // Create for stock adjustments, no edit/delete
    search: ["auto", "advanced"], // No simple search
    export: true,
  },

  // API configuration
  api: {
    baseEndpoint: "/inventory-movements",
    endpoints: {
      list: "/inventory-movements",
      create: "/inventory-movements", // For stock adjustments
      read: "/inventory-movements/:id",
      search: "/inventory-movements/search",
      filter: "/inventory-movements/filter",
      advancedFilter: "/inventory-movements/advanced-filter",
      export: "/inventory-movements/export",
    },
  },

  // Table configuration
  table: {
    columns: [
      {
        key: "bookTitle",
        label: "Libro",
        type: "text",
        sortable: true,
        render: (value: string, record: any) => `${value || record.book?.title || "N/A"} - ISBN: ${record.book?.isbn || "N/A"}`,
      },
      {
        key: "movementType",
        label: "Tipo",
        type: "text",
        sortable: true,
        render: (value: string) => (value === "IN" ? "Entrada" : value === "OUT" ? "Salida" : "Ajuste"),
      },
      {
        key: "quantity",
        label: "Cantidad",
        type: "number",
        sortable: true,
        render: (value: number, record: any) => {
          const prefix = record.movementType === "IN" ? "+" : record.movementType === "OUT" ? "-" : "±";
          return `${prefix}${value}`;
        },
      },
      {
        key: "currentStock",
        label: "Stock Actual",
        type: "number",
        render: (value: number) => String(value || 0),
      },
      {
        key: "reason",
        label: "Motivo",
        type: "text",
        render: (value: string) => (value ? String(value).substring(0, 40) + (value.length > 40 ? "..." : "") : "-"),
      },
      {
        key: "performedBy",
        label: "Realizado por",
        type: "text",
        render: (value: string) => value || "Sistema",
      },
      {
        key: "createdAt",
        label: "Fecha",
        type: "date",
        sortable: true,
        render: (value: string) => new Date(value).toLocaleString(),
      },
    ],
    actions: [
      { key: "view", label: "Ver", variant: "ver", handler: "onView" },
      {
        key: "adjust",
        label: "Ajustar Stock",
        variant: "editar",
        handler: "onEdit",
        condition: (record: any) => record.book?.id, // Only if has book ID
      },
    ],
    defaultSort: { field: "createdAt", direction: "DESC" },
    pageSize: 15,
  },

  // Search configuration
  search: {
    autoSearch: {
      enabled: true,
      minChars: 3,
      debounceMs: 500,
      placeholder: "Búsqueda rápida por libro o motivo (mín. 3 caracteres)",
    },
    advancedSearch: {
      enabled: true,
      fields: [
        {
          key: "bookTitle",
          label: "Título del libro",
          type: "text",
          placeholder: "Nombre del libro",
          validation: { minLength: 3 },
        },
        {
          key: "bookIsbn",
          label: "ISBN del libro",
          type: "text",
          placeholder: "ISBN-10 o ISBN-13",
          validation: { minLength: 10 },
        },
        {
          key: "movementType",
          label: "Tipo de movimiento",
          type: "select",
          options: [
            { value: "IN", label: "Entrada" },
            { value: "OUT", label: "Salida" },
            { value: "ADJUSTMENT", label: "Ajuste" },
          ],
        },
        {
          key: "performedBy",
          label: "Realizado por",
          type: "text",
          placeholder: "Usuario que realizó el movimiento",
          validation: { minLength: 2 },
        },
        {
          key: "reason",
          label: "Motivo",
          type: "text",
          placeholder: "Razón del movimiento",
          validation: { minLength: 3 },
        },
        {
          key: "startDate",
          label: "Fecha desde",
          type: "date",
        },
        {
          key: "endDate",
          label: "Fecha hasta",
          type: "date",
        },
        {
          key: "minQuantity",
          label: "Cantidad mínima",
          type: "number",
        },
        {
          key: "maxQuantity",
          label: "Cantidad máxima",
          type: "number",
        },
        {
          key: "lowStock",
          label: "Stock bajo",
          type: "boolean",
          options: [
            { value: true, label: "Mostrar solo stock bajo (≤5)" },
            { value: false, label: "Mostrar todos los niveles" },
          ],
        },
      ],
    },
  },

  // Forms configuration (will be implemented later)
  forms: {
    // create: { component: StockAdjustmentForm, validation: stockAdjustmentSchema },
    // view: { component: ViewInventoryMovementModal },
  },

  // Custom configuration
  customConfig: {
    breadcrumbs: ["Movimientos", "Movimientos"],
    autoFilterField: "bookTitle", // Field used for auto-search
    csvFilename: "movimientos_inventario",

    // Inventory-specific settings
    stockAlerts: {
      lowStock: 5,
      criticalStock: 1,
    },

    // Movement types configuration
    movementTypes: {
      IN: { label: "Entrada", color: "green", icon: "↗️" },
      OUT: { label: "Salida", color: "red", icon: "↘️" },
      ADJUSTMENT: { label: "Ajuste", color: "yellow", icon: "⚖️" },
    },
  },
};