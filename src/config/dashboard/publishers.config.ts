import { DashboardEntityConfig } from "@/types/dashboard/entities";
import { PublisherResponseDto, CreatePublisherDto, UpdatePublisherDto } from "@/types/api/entities";
import { publishingHousesApi } from "@/services/api/entities/publishing-houses";

export const publishersConfig: DashboardEntityConfig<PublisherResponseDto, CreatePublisherDto, UpdatePublisherDto> = {
  // Basic entity information
  entity: "publishers",
  displayName: "Gestión de Editoriales",
  entityName: "editorial",

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

  // Table configuration
  table: {
    columns: [
      { key: "name", label: "Nombre", type: "text", sortable: true },
      { key: "country", label: "País", type: "text", sortable: true },
      { 
        key: "website", 
        label: "Website", 
        type: "text",
        render: (value: string) => value ? (value.length > 30 ? value.substring(0, 30) + "..." : value) : "-"
      },
      { 
        key: "contactEmail", 
        label: "Email", 
        type: "text",
        render: (value: string) => value || "-"
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
        render: (value: boolean) => value ? 'Activa' : 'Inactiva'
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
      placeholder: "Búsqueda rápida editoriales (mín. 2 caracteres)",
    },
    advancedSearch: {
      enabled: true,
      fields: [
        {
          key: 'name',
          label: 'Nombre de la editorial',
          type: 'text',
          placeholder: 'Ej: Penguin, Planeta, Anagrama',
          validation: { minLength: 2 }
        },
        {
          key: 'country',
          label: 'País',
          type: 'text',
          placeholder: 'Ej: España, México, Argentina',
          validation: { minLength: 2 }
        },
        {
          key: 'contactEmail',
          label: 'Email de contacto',
          type: 'text',
          placeholder: 'contacto@editorial.com',
          validation: { minLength: 3 }
        },
        {
          key: 'isActive',
          label: 'Estado de la editorial',
          type: 'boolean',
          options: [
            { value: true, label: 'Activa' },
            { value: false, label: 'Inactiva' }
          ]
        },
        {
          key: 'hasBooks',
          label: 'Con libros',
          type: 'boolean',
          options: [
            { value: true, label: 'Con libros publicados' },
            { value: false, label: 'Sin libros publicados' }
          ]
        }
      ],
    },
  },

  // Forms configuration (will be implemented later)
  forms: {
    // create: { component: CreatePublisherForm, validation: createPublisherSchema },
    // edit: { component: EditPublisherForm, validation: updatePublisherSchema },
    // view: { component: ViewPublisherModal },
    // delete: { component: DeletePublisherDialog },
  },

  // Custom configuration
  customConfig: {
    breadcrumbs: ["Editoriales"],
    autoFilterField: "name", // Field used for auto-search
    csvFilename: "editoriales",
  },
};