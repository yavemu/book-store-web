import { EntityUnifiedConfig, UnifiedFieldConfig } from "@/types/dashboard/unified-config";
import { AuthorResponseDto, CreateAuthorDto, UpdateAuthorDto } from "@/types/api/entities";

// Unified fields configuration - single source of truth for both table and search
const authorsUnifiedFields: UnifiedFieldConfig[] = [
  {
    key: "name",
    label: "Nombre",
    type: "text",
    table: {
      sortable: true,
      width: "250px",
      render: (value: string, record?: any) => {
        // Si viene como nombre completo, lo usamos directamente
        // Si vienen firstName y lastName separados, los combinamos
        let fullName = value;
        if (!fullName) {
          fullName = record?.firstName && record?.lastName 
            ? `${record.firstName} ${record.lastName}` 
            : record?.firstName || record?.lastName || '-';
        }
        
        // Truncar texto largo y mostrar tooltip
        if (fullName.length > 30) {
          return (
            <div className="max-w-[250px] truncate" title={fullName}>
              {fullName}
            </div>
          );
        }
        return fullName;
      }
    },
    search: {
      searchable: true,
      placeholder: "Ej: Gabriel García Márquez (mín. 3 caracteres)",
      validation: { minLength: 3 }
    }
  },
  {
    key: "nationality",
    label: "Nacionalidad",
    type: "text",
    table: {
      sortable: true,
      width: "150px",
    },
    search: {
      searchable: true,
      placeholder: "Ej: Colombiana (mín. 3 caracteres)",
      validation: { minLength: 3 }
    }
  },
  {
    key: "birthDate",
    label: "Fecha de Nacimiento",
    type: "date",
    table: {
      sortable: true,
      width: "150px",
      render: (value: string) => {
        if (!value) return '-';
        // Manejar diferentes formatos de fecha
        const date = new Date(value);
        return isNaN(date.getTime()) ? value : date.toLocaleDateString();
      }
    },
    search: {
      searchable: false, // Las fechas se manejan con rangos
    }
  },
  {
    key: "booksCount",
    label: "Libros",
    type: "number",
    table: {
      sortable: false,
      width: "80px",
      align: "center",
      render: (value: number) => String(value || 0)
    },
    search: {
      searchable: true,
      placeholder: "Ej: 5"
    }
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
          {value ? 'Activo' : 'Inactivo'}
        </span>
      )
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

export const authorsUnifiedConfig: EntityUnifiedConfig<AuthorResponseDto, CreateAuthorDto, UpdateAuthorDto> = {
  // Basic entity information
  entity: "authors",
  displayName: "Gestión de Autores",
  entityName: "autor",
  entityNamePlural: "autores",

  // Unified fields - single source of truth
  fields: authorsUnifiedFields,

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

  // UI configuration
  ui: {
    defaultSort: { field: "createdAt", direction: "DESC" },
    pageSize: 10,
    autoSearchField: "name",
    autoSearchPlaceholder: "Búsqueda rápida autores (mín. 3 caracteres)",
    breadcrumbs: ["Autores"],
    csvFilename: "autores",
  },

  // Actions configuration
  actions: [
    { key: "view", label: "Ver", variant: "ver", handler: "onView" },
    { key: "edit", label: "Editar", variant: "editar", handler: "onEdit" },
    { key: "delete", label: "Eliminar", variant: "eliminar", handler: "onDelete" },
  ],
};