import { Column } from "@/components/ui";
import { genresApi } from "@/services/api/entities/genres";
import { BookGenre, GenreListParams, GenreFiltersDto } from "@/types/genres";
import { formatDate } from "@/utils/dateFormatter";

export const genresManagementConfig = {
  title: "Panel Administrativo de Géneros",
  createButtonText: "Crear Género",
  emptyMessage: "No se encontraron géneros. Crea tu primer género para comenzar.",
  errorMessage: "Error al cargar los géneros",
  initialParams: {
    page: 1,
    limit: 10,
    sortBy: "name",
    sortOrder: "ASC" as const,
  },
  apiService: genresApi,
  permissions: {
    roles: ["admin"], // Solo admin puede gestionar géneros
    canCreate: true,
    canEdit: true,
    canDelete: true,
    canView: true,
  },
  columns: [
    {
      key: "name",
      label: "Nombre",
      sortable: true,
      render: (genre: BookGenre, value: string) => (
        <div className="min-w-48">
          <div className="font-medium text-gray-900">{value}</div>
          {genre.description && (
            <div className="text-sm text-gray-500 truncate max-w-64">{genre.description}</div>
          )}
        </div>
      ),
    },
    {
      key: "description",
      label: "Descripción",
      render: (_: BookGenre, value: string) => (
        <div className="max-w-80">
          <span className="text-gray-700 line-clamp-2">
            {value || "Sin descripción"}
          </span>
        </div>
      ),
    },
    {
      key: "createdAt",
      label: "Fecha de creación",
      sortable: true,
      render: (_: BookGenre, value: string) => formatDate(value),
      className: "min-w-32",
    },
    {
      key: "isActive",
      label: "Activo",
      className: "text-center",
      render: (_: BookGenre, value: boolean) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${value ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
          {value ? "Sí" : "No"}
        </span>
      ),
    },
  ] as Column<BookGenre>[],
};