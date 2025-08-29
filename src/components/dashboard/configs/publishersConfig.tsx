import { Column } from "@/components/ui";
import { publishingHousesApi } from "@/services/api/entities/publishing-houses";
import type { PublishingHouse, PublishingHouseListParams, PublishingHouseFiltersDto } from "@/types/api/entities";

import type { ManagementPageConfig } from "../pages/GenericManagementPage";

export const publishersManagementConfig: ManagementPageConfig<PublishingHouse, PublishingHouseListParams, PublishingHouseFiltersDto> = {
  title: "Panel Administrativo de Editoriales",
  createButtonText: "Crear Editorial",
  createUrl: "/dashboard/publishers/create",
  editUrl: "/dashboard/publishers/edit",
  entityType: "publishers" as const,
  emptyMessage: "No se encontraron editoriales. Crea tu primera editorial para comenzar.",
  errorMessage: "Error al cargar las editoriales",
  initialParams: {
    page: 1,
    limit: 10,
    sortBy: "name",
    sortOrder: "ASC" as const,
  },
  apiService: publishingHousesApi,
  permissions: {
    roles: ["admin"], // Solo admin puede gestionar editoriales
    canCreate: true,
    canEdit: true,
    canDelete: true,
    canView: true,
  },
  columns: [
    {
      key: "logoUrl",
      label: "Logo",
      className: "w-20",
      render: (publisher: PublishingHouse, value: string) => (
        <div className="w-16 h-12 bg-gray-200 rounded overflow-hidden">
          {value ? (
            <img
              src={value}
              alt={`Logo de ${publisher.name}`}
              className="w-full h-full object-cover"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
              {publisher.name.substring(0, 2).toUpperCase()}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "name",
      label: "Nombre",
      sortable: true,
      render: (publisher: PublishingHouse, value: string) => (
        <div className="min-w-48">
          <div className="font-medium text-gray-900">{value}</div>
          <div className="text-sm text-gray-500">{publisher.country || "País no especificado"}</div>
        </div>
      ),
    },
    { 
      key: "city", 
      label: "Ciudad", 
      render: (publisher: PublishingHouse) => publisher.city || "N/A", 
      className: "min-w-32" 
    },
    { 
      key: "foundedYear", 
      label: "Año fundación", 
      render: (_: PublishingHouse, value: number) => value?.toString() || "N/A", 
      className: "text-center min-w-32" 
    },
    { 
      key: "website", 
      label: "Sitio web", 
      render: (_: PublishingHouse, value: string) => value ? (
        <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 truncate max-w-32 block">
          {value}
        </a>
      ) : "N/A", 
      className: "min-w-32" 
    },
    {
      key: "isActive",
      label: "Activa",
      className: "text-center",
      render: (_: PublishingHouse, value: boolean) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${value ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
          {value ? "Sí" : "No"}
        </span>
      ),
    },
  ] as Column<PublishingHouse>[],
};