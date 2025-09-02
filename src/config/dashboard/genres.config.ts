import { DashboardEntityConfig } from "@/types/dashboard/entities";
import { GenreResponseDto, CreateGenreDto, UpdateGenreDto } from "@/types/api/entities";
import { genresApi } from "@/services/api/entities/genres";

export const genresConfig: DashboardEntityConfig<GenreResponseDto, CreateGenreDto, UpdateGenreDto> = {
  // Basic entity information
  entity: "genres",
  displayName: "Gestión de Géneros",
  entityName: "género",

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

  // Table configuration
  table: {
    columns: [
      { key: "name", label: "Nombre", type: "text", sortable: true },
      { 
        key: "description", 
        label: "Descripción", 
        type: "text",
        render: (value: string) => (value ? String(value).substring(0, 100) + (value.length > 100 ? "..." : "") : "-")
      },
      { 
        key: "booksCount", 
        label: "Libros", 
        type: "number",
        render: (value: number) => String(value || 0)
      },
      { 
        key: "isActive", 
        label: "Estado", 
        type: "boolean",
        render: (value: boolean) => value ? 'Activo' : 'Inactivo'
      },
      { 
        key: "createdAt", 
        label: "Creado", 
        type: "date", 
        sortable: true,
        render: (value: string) => new Date(value).toLocaleDateString()
      },
    ],
    actions: [
      { key: "view", label: "Ver", variant: "ver", handler: "onView" },
      { key: "edit", label: "Editar", variant: "editar", handler: "onEdit" },
      { key: "delete", label: "Eliminar", variant: "eliminar", handler: "onDelete" },
    ],
    defaultSort: { field: "name", direction: "ASC" },
    pageSize: 10,
  },

  // Search configuration
  search: {
    autoSearch: {
      enabled: true,
      minChars: 2,
      debounceMs: 400,
      placeholder: "Búsqueda rápida géneros (mín. 2 caracteres)",
    },
    advancedSearch: {
      enabled: true,
      fields: [
        {
          key: 'name',
          label: 'Nombre del género',
          type: 'text',
          placeholder: 'Ej: Ficción, Romance, Thriller',
          validation: { minLength: 2 }
        },
        {
          key: 'description',
          label: 'Descripción',
          type: 'text',
          placeholder: 'Contenido de la descripción',
          validation: { minLength: 3 }
        },
        {
          key: 'isActive',
          label: 'Estado del género',
          type: 'boolean',
          options: [
            { value: true, label: 'Activo' },
            { value: false, label: 'Inactivo' }
          ]
        },
        {
          key: 'hasBooks',
          label: 'Con libros',
          type: 'boolean',
          options: [
            { value: true, label: 'Con libros asociados' },
            { value: false, label: 'Sin libros asociados' }
          ]
        }
      ],
    },
  },

  // Forms configuration (will be implemented later)
  forms: {
    // create: { component: CreateGenreForm, validation: createGenreSchema },
    // edit: { component: EditGenreForm, validation: updateGenreSchema },
    // view: { component: ViewGenreModal },
    // delete: { component: DeleteGenreDialog },
  },

  // Custom configuration
  customConfig: {
    breadcrumbs: ["Géneros"],
    autoFilterField: "name", // Field used for auto-search
    csvFilename: "generos",
  },
};