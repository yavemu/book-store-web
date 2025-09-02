import { EntityUnifiedConfig, UnifiedFieldConfig } from "@/types/dashboard/unified-config";
import { PublisherResponseDto, CreatePublisherDto, UpdatePublisherDto } from "@/types/api/entities";

// Unified fields configuration - single source of truth for both table and search
const publishersUnifiedFields: UnifiedFieldConfig[] = [
  {
    key: "name",
    label: "Nombre",
    type: "text",
    table: {
      sortable: true,
    },
    search: {
      searchable: true,
      placeholder: "Ej: Editorial Planeta (mín. 3 caracteres)",
      validation: { minLength: 3 }
    }
  },
  {
    key: "country",
    label: "País",
    type: "text",
    table: {
      sortable: true,
    },
    search: {
      searchable: true,
      placeholder: "Ej: España (mín. 3 caracteres)",
      validation: { minLength: 3 }
    }
  },
  {
    key: "foundedYear",
    label: "Año Fundación",
    type: "number",
    table: {
      sortable: true,
    },
    search: {
      searchable: true,
      placeholder: "Ej: 1949"
    }
  },
  {
    key: "website",
    label: "Sitio Web",
    type: "text",
    table: {
      sortable: false,
      render: (value: string) => value ? (
        <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
          {value.length > 30 ? `${value.substring(0, 30)}...` : value}
        </a>
      ) : '-'
    },
    search: {
      searchable: true,
      placeholder: "Ej: www.editorial.com",
      validation: { minLength: 5 }
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

export const publishersUnifiedConfig: EntityUnifiedConfig<PublisherResponseDto, CreatePublisherDto, UpdatePublisherDto> = {
  // Basic entity information
  entity: "publishers",
  displayName: "Gestión de Editoriales",
  entityName: "editorial",
  entityNamePlural: "editoriales",

  // Unified fields - single source of truth
  fields: publishersUnifiedFields,

  // Entity capabilities - Full CRUD + all search types + export
  capabilities: {
    crud: ['create', 'read', 'update', 'delete'],
    search: ['auto', 'simple', 'advanced'],
    export: true,
  },

  // API configuration
  api: {
    baseEndpoint: "/publishers",
    endpoints: {
      list: "/publishers",
      create: "/publishers",
      read: "/publishers/:id",
      update: "/publishers/:id",
      delete: "/publishers/:id",
      search: "/publishers/search",
      filter: "/publishers/filter",
      export: "/publishers/export",
    },
  },

  // UI configuration
  ui: {
    defaultSort: { field: "createdAt", direction: "DESC" },
    pageSize: 10,
    autoSearchField: "name",
    autoSearchPlaceholder: "Búsqueda rápida editoriales (mín. 3 caracteres)",
    breadcrumbs: ["Editoriales"],
    csvFilename: "editoriales",
  },

  // Actions configuration
  actions: [
    { key: "view", label: "Ver", variant: "ver", handler: "onView" },
    { key: "edit", label: "Editar", variant: "editar", handler: "onEdit" },
    { key: "delete", label: "Eliminar", variant: "eliminar", handler: "onDelete" },
  ],
};