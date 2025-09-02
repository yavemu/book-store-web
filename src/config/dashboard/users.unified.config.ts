import { EntityUnifiedConfig, UnifiedFieldConfig } from "@/types/dashboard/unified-config";
import { UserResponseDto, CreateUserDto, UpdateUserDto } from "@/types/api/entities";

// Unified fields configuration - single source of truth for both table and search
const usersUnifiedFields: UnifiedFieldConfig[] = [
  {
    key: "email",
    label: "Email",
    type: "email",
    table: {
      sortable: true,
    },
    search: {
      searchable: true,
      placeholder: "Ej: usuario@email.com (mín. 5 caracteres)",
      validation: { minLength: 5 }
    }
  },
  {
    key: "firstName",
    label: "Nombre",
    type: "text",
    table: {
      sortable: true,
    },
    search: {
      searchable: true,
      placeholder: "Ej: Juan (mín. 2 caracteres)",
      validation: { minLength: 2 }
    }
  },
  {
    key: "lastName",
    label: "Apellido",
    type: "text",
    table: {
      sortable: true,
    },
    search: {
      searchable: true,
      placeholder: "Ej: Pérez (mín. 2 caracteres)",
      validation: { minLength: 2 }
    }
  },
  {
    key: "role",
    label: "Rol",
    type: "select",
    table: {
      sortable: true,
    },
    search: {
      searchable: true,
      options: [
        { value: 'ADMIN', label: 'Administrador' },
        { value: 'USER', label: 'Usuario' },
        { value: 'MODERATOR', label: 'Moderador' }
      ]
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

export const usersUnifiedConfig: EntityUnifiedConfig<UserResponseDto, CreateUserDto, UpdateUserDto> = {
  // Basic entity information
  entity: "users",
  displayName: "Gestión de Usuarios",
  entityName: "usuario",
  entityNamePlural: "usuarios",

  // Unified fields - single source of truth
  fields: usersUnifiedFields,

  // Entity capabilities - Full CRUD + all search types + export
  capabilities: {
    crud: ['create', 'read', 'update', 'delete'],
    search: ['auto', 'simple', 'advanced'],
    export: true,
  },

  // API configuration
  api: {
    baseEndpoint: "/users",
    endpoints: {
      list: "/users",
      create: "/users",
      read: "/users/:id",
      update: "/users/:id",
      delete: "/users/:id",
      search: "/users/search",
      filter: "/users/filter",
      export: "/users/export",
    },
  },

  // UI configuration
  ui: {
    defaultSort: { field: "createdAt", direction: "DESC" },
    pageSize: 10,
    autoSearchField: "email",
    autoSearchPlaceholder: "Búsqueda rápida usuarios (mín. 5 caracteres)",
    breadcrumbs: ["Usuarios"],
    csvFilename: "usuarios",
  },

  // Actions configuration
  actions: [
    { key: "view", label: "Ver", variant: "ver", handler: "onView" },
    { key: "edit", label: "Editar", variant: "editar", handler: "onEdit" },
    { key: "delete", label: "Eliminar", variant: "eliminar", handler: "onDelete" },
  ],
};