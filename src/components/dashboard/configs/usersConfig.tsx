import { Column } from "@/components/ui";
import { usersApi } from "@/services/api/entities/users";
import { User, UserListParams, UserFiltersDto } from "@/types/api/entities";
import { formatDate } from "@/utils/dateFormatter";

export const usersManagementConfig = {
  title: "Panel Administrativo de Usuarios",
  createButtonText: "Crear Usuario",
  createUrl: "/dashboard/users/create",
  entityType: "users" as const,
  emptyMessage: "No se encontraron usuarios. Crea tu primer usuario para comenzar.",
  errorMessage: "Error al cargar los usuarios",
  initialParams: {
    page: 1,
    limit: 10,
    sortBy: "username",
    sortOrder: "ASC" as const,
  },
  apiService: usersApi,
  permissions: {
    roles: ["admin"], // Solo admin puede gestionar usuarios
    canCreate: true,
    canEdit: true,
    canDelete: true,
    canView: true,
  },
  columns: [
    {
      key: "username",
      label: "Usuario",
      sortable: true,
      render: (user: User, value: string) => (
        <div className="min-w-48">
          <div className="font-medium text-gray-900">{value}</div>
          <div className="text-sm text-gray-500">{user.email}</div>
        </div>
      ),
    },
    {
      key: "role",
      label: "Rol",
      render: (user: User) => {
        const roleName = user.role?.name?.toLowerCase() || "usuario";
        return (
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${
              roleName === "admin" ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"
            }`}
          >
            {roleName === "admin" ? "Administrador" : "Usuario"}
          </span>
        );
      },
      className: "text-center min-w-32",
    },
    {
      key: "role",
      label: "Estado del rol",
      className: "text-center",
      render: (user: User) => {
        const isActive = user.role?.isActive ?? false;
        return (
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
          >
            {isActive ? "Activo" : "Inactivo"}
          </span>
        );
      },
    },
    {
      key: "createdAt",
      label: "Fecha de creación",
      sortable: true,
      render: (_: User, value: string) => formatDate(value),
      className: "min-w-32 text-center",
    },
    {
      key: "updatedAt",
      label: "Última actualización",
      render: (_: User, value: string) => formatDate(value),
      className: "min-w-32 text-center",
    },
  ] as Column<User>[],
};
