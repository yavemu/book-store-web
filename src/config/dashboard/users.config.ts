import { DashboardEntityConfig } from "@/types/dashboard/entities";
import { UserResponseDto, CreateUserDto, UpdateUserDto } from "@/types/api/entities";
import { usersApi } from "@/services/api/entities/users";

export const usersConfig: DashboardEntityConfig<UserResponseDto, CreateUserDto, UpdateUserDto> = {
  // Basic entity information
  entity: "users",
  displayName: "Gestión de Usuarios",
  entityName: "usuario",

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

  // Table configuration
  table: {
    columns: [
      { key: "email", label: "Email", type: "text", sortable: true },
      { key: "firstName", label: "Nombre", type: "text", sortable: true },
      { key: "lastName", label: "Apellido", type: "text", sortable: true },
      { 
        key: "role", 
        label: "Rol", 
        type: "text",
        render: (value: string) => value === 'admin' ? 'Administrador' : 
                                      value === 'librarian' ? 'Bibliotecario' : 'Usuario'
      },
      { 
        key: "isActive", 
        label: "Estado", 
        type: "boolean",
        render: (value: boolean) => value ? 'Activo' : 'Inactivo'
      },
      { 
        key: "createdAt", 
        label: "Registro", 
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
    defaultSort: { field: "createdAt", direction: "DESC" },
    pageSize: 10,
  },

  // Search configuration
  search: {
    autoSearch: {
      enabled: true,
      minChars: 3,
      debounceMs: 500,
      placeholder: "Búsqueda rápida usuarios (mín. 3 caracteres)",
    },
    advancedSearch: {
      enabled: true,
      fields: [
        {
          key: 'email',
          label: 'Email',
          type: 'text',
          placeholder: 'usuario@ejemplo.com',
          validation: { minLength: 3 }
        },
        {
          key: 'firstName',
          label: 'Nombre',
          type: 'text',
          placeholder: 'Juan',
          validation: { minLength: 2 }
        },
        {
          key: 'lastName',
          label: 'Apellido',
          type: 'text',
          placeholder: 'Pérez',
          validation: { minLength: 2 }
        },
        {
          key: 'role',
          label: 'Rol',
          type: 'select',
          options: [
            { value: 'admin', label: 'Administrador' },
            { value: 'librarian', label: 'Bibliotecario' },
            { value: 'user', label: 'Usuario' }
          ]
        },
        {
          key: 'isActive',
          label: 'Estado',
          type: 'boolean',
          options: [
            { value: true, label: 'Activo' },
            { value: false, label: 'Inactivo' }
          ]
        }
      ],
    },
  },

  // Forms configuration (will be implemented later)
  forms: {
    // create: { component: CreateUserForm, validation: createUserSchema },
    // edit: { component: EditUserForm, validation: updateUserSchema },
    // view: { component: ViewUserModal },
    // delete: { component: DeleteUserDialog },
  },

  // Custom configuration
  customConfig: {
    breadcrumbs: ["Usuarios"],
    autoFilterField: "email", // Field used for auto-search
    csvFilename: "usuarios",
  },
};