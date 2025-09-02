import { BookResponseDto, CreateBookDto, UpdateBookDto } from "@/types/api/entities";
import { EntityUnifiedConfig, UnifiedFieldConfig } from "@/types/dashboard/unified-config";

// Unified fields configuration - single source of truth for both table and search
const booksUnifiedFields: UnifiedFieldConfig[] = [
  {
    key: "title",
    label: "Título",
    type: "text",
    table: {
      sortable: true,
      width: "280px",
      render: (value: string) => {
        if (!value) return '-';
        // Truncar títulos largos y mostrar tooltip
        if (value.length > 40) {
          return (
            <div className="max-w-[280px] truncate" title={value}>
              {value}
            </div>
          );
        }
        return value;
      }
    },
    search: {
      searchable: true,
      placeholder: "Ej: Cien años de soledad (mín. 3 caracteres)",
      validation: { minLength: 3 },
    },
  },
  {
    key: "isbnCode",
    label: "ISBN",
    type: "text",
    table: {
      sortable: true,
      width: "140px",
      render: (value: string) => {
        if (!value) return '-';
        // Truncar ISBNs muy largos
        if (value.length > 17) {
          return (
            <div className="max-w-[140px] truncate" title={value}>
              {value}
            </div>
          );
        }
        return value;
      }
    },
    search: {
      searchable: true,
      placeholder: "Ej: 978-3-16-148410-0",
      validation: { minLength: 10 },
    },
  },
  {
    key: "publicationDate",
    label: "Fecha Publicación",
    type: "date",
    table: {
      sortable: true,
      width: "130px",
      render: (value: string) => {
        if (!value) return '-';
        const date = new Date(value);
        return isNaN(date.getTime()) ? value : date.toLocaleDateString();
      }
    },
    search: {
      searchable: false, // Dates are handled separately as date ranges
    },
  },
  {
    key: "price",
    label: "Precio",
    type: "number",
    table: {
      sortable: true,
      width: "100px",
      align: "right",
      render: (value: number) => value ? `$${value.toFixed(2)}` : '-',
    },
    search: {
      searchable: true,
      placeholder: "Ej: 25.99",
    },
  },
  {
    key: "authorName",
    label: "Autor",
    type: "text",
    table: {
      sortable: true,
      width: "200px",
      render: (value: string) => {
        if (!value) return '-';
        // Truncar nombres de autor largos
        if (value.length > 25) {
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
      placeholder: "Ej: Gabriel García Márquez",
      validation: { minLength: 3 },
    },
  },
  {
    key: "genreName",
    label: "Género",
    type: "text",
    table: {
      sortable: true,
      width: "150px",
      render: (value: string) => {
        if (!value) return '-';
        // Truncar nombres de género largos
        if (value.length > 20) {
          return (
            <div className="max-w-[150px] truncate" title={value}>
              {value}
            </div>
          );
        }
        return value;
      }
    },
    search: {
      searchable: true,
      placeholder: "Ej: Realismo Mágico",
      validation: { minLength: 3 },
    },
  },
  {
    key: "stock",
    label: "Stock",
    type: "number",
    table: {
      sortable: true,
      width: "80px",
      align: "center",
      render: (value: number) => String(value || 0)
    },
    search: {
      searchable: true,
      placeholder: "Ej: 50",
    },
  },
  {
    key: "isActive",
    label: "Estado",
    type: "boolean",
    table: {
      sortable: false,
      width: "100px",
      align: "center",
      render: (value: boolean) => (
        <span className={`px-2 py-1 text-xs rounded-full ${
          value 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {value ? "Activo" : "Inactivo"}
        </span>
      )
    },
    search: {
      searchable: true,
      options: [
        { value: true, label: "Activo" },
        { value: false, label: "Inactivo" },
      ],
    },
  },
];

export const booksUnifiedConfig: EntityUnifiedConfig<BookResponseDto, CreateBookDto, UpdateBookDto> = {
  // Basic entity information
  entity: "books",
  displayName: "Gestión de Libros",
  entityName: "libro",
  entityNamePlural: "libros",

  // Unified fields - single source of truth
  fields: booksUnifiedFields,

  // Entity capabilities - Full CRUD + all search types + export
  capabilities: {
    crud: ["create", "read", "update", "delete"],
    search: ["auto", "simple", "advanced"],
    export: true,
  },

  // API configuration
  api: {
    baseEndpoint: "/books",
    endpoints: {
      list: "/books",
      create: "/books",
      read: "/books/:id",
      update: "/books/:id",
      delete: "/books/:id",
      search: "/books/search",
      filter: "/books/filter",
      export: "/books/export",
    },
  },

  // UI configuration
  ui: {
    defaultSort: { field: "createdAt", direction: "DESC" },
    pageSize: 10,
    autoSearchField: "title",
    autoSearchPlaceholder: "Búsqueda rápida libros (mín. 3 caracteres)",
    breadcrumbs: ["Libros"],
    csvFilename: "libros",
  },

  // Actions configuration
  actions: [
    { key: "view", label: "Ver", variant: "ver", handler: "onView" },
    { key: "edit", label: "Editar", variant: "editar", handler: "onEdit" },
    { key: "delete", label: "Eliminar", variant: "eliminar", handler: "onDelete" },
  ],
};
