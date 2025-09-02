import { DashboardEntityConfig } from "@/types/dashboard/entities";
import { AuthorResponseDto, CreateAuthorDto, UpdateAuthorDto } from "@/types/api/entities";
import { authorsApi } from "@/services/api/entities/authors";
import { authorsSearchConfig } from "@/config/search/authors.search";

export const authorsConfig: DashboardEntityConfig<AuthorResponseDto, CreateAuthorDto, UpdateAuthorDto> = {
  // Basic entity information
  entity: "authors",
  displayName: "Gestión de Autores",
  entityName: "autor",

  // Entity capabilities - Full CRUD + all search types + export
  capabilities: {
    crud: ['create', 'read', 'update', 'delete'],
    search: ['auto', 'simple', 'advanced'],
    export: true,
  },

  // API configuration
  api: {
    baseEndpoint: "/authors",
    endpoints: {
      list: "/authors",
      create: "/authors",
      read: "/authors/:id",
      update: "/authors/:id",
      delete: "/authors/:id",
      search: "/authors/search",
      filter: "/authors/filter",
      export: "/authors/export",
    },
  },

  // Table configuration
  table: {
    columns: [
      { key: "name", label: "Nombre", type: "text", sortable: true },
      { key: "nationality", label: "Nacionalidad", type: "text", sortable: true },
      { key: "birthYear", label: "Año Nac.", type: "number", sortable: true },
      { 
        key: "isActive", 
        label: "Estado", 
        type: "boolean",
        render: (value: boolean) => value ? 'Activo' : 'Inactivo'
      },
    ],
    actions: [
      { key: "view", label: "Ver", variant: "ver", handler: "onView" },
      { key: "edit", label: "Editar", variant: "editar", handler: "onEdit" },
      { key: "delete", label: "Eliminar", variant: "eliminar", handler: "onDelete" },
    ],
    defaultSort: { field: "createdAt", direction: "DESC" },
    pageSize: 10,
  },

  // Search configuration
  search: {
    autoSearch: {
      enabled: true,
      minChars: 3,
      debounceMs: 500,
      placeholder: "Búsqueda rápida autores (mín. 3 caracteres)",
    },
    advancedSearch: {
      enabled: true,
      fields: authorsSearchConfig,
    },
  },

  // Forms configuration (will be implemented later)
  forms: {
    // create: { component: CreateAuthorForm, validation: createAuthorSchema },
    // edit: { component: EditAuthorForm, validation: updateAuthorSchema },
    // view: { component: ViewAuthorModal },
    // delete: { component: DeleteAuthorDialog },
  },

  // Validation schemas (will be implemented later)
  validation: {
    // entity: authorSchema,
    // create: createAuthorSchema,
    // update: updateAuthorSchema,
  },

  // Custom configuration
  customConfig: {
    breadcrumbs: ["Autores"],
    autoFilterField: "name", // Field used for auto-search
    csvFilename: "autores",
  },
};