import { Column } from "@/components/ui";
import { authorsApi } from "@/services/api/entities/authors";
import { BookAuthor, AuthorListParams, AuthorFiltersDto } from "@/types/api/entities";
import { formatDate } from "@/utils/dateFormatter";

export const authorsManagementConfig = {
  title: "Panel Administrativo de Autores",
  createButtonText: "Crear Autor",
  createUrl: "/dashboard/authors/create",
  editUrl: "/dashboard/authors/edit",
  entityType: "authors" as const,
  emptyMessage: "No se encontraron autores. Crea tu primer autor para comenzar.",
  errorMessage: "Error al cargar los autores",
  initialParams: {
    page: 1,
    limit: 10,
    sortBy: "lastName",
    sortOrder: "ASC" as const,
  },
  apiService: authorsApi,
  permissions: {
    roles: ["admin"], // Solo admin puede gestionar autores
    canCreate: true,
    canEdit: true,
    canDelete: true,
    canView: true,
  },
  columns: [
    {
      key: "profileImageUrl",
      label: "Foto",
      className: "w-20",
      render: (author: BookAuthor, value: string) => (
        <div className="w-16 h-16 bg-gray-200 rounded-full overflow-hidden">
          {value ? (
            <img
              src={value}
              alt={`Foto de ${author.firstName} ${author.lastName}`}
              className="w-full h-full object-cover"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
              {author.firstName.charAt(0)}{author.lastName.charAt(0)}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "firstName",
      label: "Nombre",
      sortable: true,
      render: (author: BookAuthor, value: string) => (
        <div className="min-w-48">
          <div className="font-medium text-gray-900">{`${value} ${author.lastName}`}</div>
          <div className="text-sm text-gray-500">{author.nationality || "Sin nacionalidad"}</div>
        </div>
      ),
    },
    { 
      key: "birthDate", 
      label: "Fecha de nacimiento", 
      render: (_: BookAuthor, value: string) => formatDate(value), 
      className: "min-w-32" 
    },
    { 
      key: "website", 
      label: "Sitio web", 
      render: (_: BookAuthor, value: string) => value ? (
        <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 truncate max-w-32 block">
          {value}
        </a>
      ) : "N/A", 
      className: "min-w-32" 
    },
    {
      key: "isActive",
      label: "Activo",
      className: "text-center",
      render: (_: BookAuthor, value: boolean) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${value ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
          {value ? "Sí" : "No"}
        </span>
      ),
    },
  ] as Column<BookAuthor>[],
};