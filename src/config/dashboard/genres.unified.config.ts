import { EntityUnifiedConfig, UnifiedFieldConfig } from "@/types/dashboard/unified-config";
import { GenreResponseDto, CreateGenreDto, UpdateGenreDto } from "@/types/api/entities";

// Unified fields configuration - single source of truth for both table and search
const genresUnifiedFields: UnifiedFieldConfig[] = [
  {
    key: "name",
    label: "Nombre",
    type: "text",
    table: {
      sortable: true,
    },
    search: {
      searchable: true,
      placeholder: "Ej: Realismo Mágico (mín. 3 caracteres)",
      validation: { minLength: 3 }
    }
  },
  {
    key: "description",
    label: "Descripción",
    type: "text",
    table: {
      sortable: false,
      render: (value: string) => value?.length > 50 ? `${value.substring(0, 50)}...` : value
    },
    search: {
      searchable: true,
      placeholder: "Ej: Género literario (mín. 3 caracteres)",
      validation: { minLength: 3 }
    }
  },
  {
    key: "isActive",
    label: "Estado",
    type: "boolean",
    table: {
      sortable: false,
      render: (value: boolean) => value ? 'Activo' : 'Inactivo'
    },
    search: {
      searchable: true,
      options: [
        { value: true, label: 'Activo' },
        { value: false, label: 'Inactivo' }
      ]
    }
  }
];

export const genresUnifiedConfig: EntityUnifiedConfig<GenreResponseDto, CreateGenreDto, UpdateGenreDto> = {
  // Basic entity information
  entity: "genres",
  displayName: "Gestión de Géneros",
  entityName: "género",
  entityNamePlural: "géneros",

  // Unified fields - single source of truth
  fields: genresUnifiedFields,

  // Entity capabilities - Full CRUD + all search types + export
  capabilities: {
    crud: ['create', 'read', 'update', 'delete'],
    search: ['auto', 'simple', 'advanced'],
    export: true,
  },

  // API configuration
  api: {
    baseEndpoint: "/genres",
    endpoints: {
      list: "/genres",
      create: "/genres",
      read: "/genres/:id",
      update: "/genres/:id",
      delete: "/genres/:id",
      search: "/genres/search",
      filter: "/genres/filter",
      export: "/genres/export",
    },
  },

  // UI configuration
  ui: {
    defaultSort: { field: "createdAt", direction: "DESC" },
    pageSize: 10,
    autoSearchField: "name",
    autoSearchPlaceholder: "Búsqueda rápida géneros (mín. 3 caracteres)",
    breadcrumbs: ["Géneros"],
    csvFilename: "generos",
  },

  // Actions configuration
  actions: [
    { key: "view", label: "Ver", variant: "ver", handler: "onView" },
    { key: "edit", label: "Editar", variant: "editar", handler: "onEdit" },
    { key: "delete", label: "Eliminar", variant: "eliminar", handler: "onDelete" },
  ],
};