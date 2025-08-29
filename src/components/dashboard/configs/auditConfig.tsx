import { Column } from "@/components/ui";
import { auditApi } from "@/services/api/entities/audit";
import { AuditLog, AuditListParams, AuditFiltersDto } from "@/types/api/entities";
import { formatDate, formatTime } from "@/utils/dateFormatter";

const getActionColor = (action: string) => {
  const colors = {
    CREATE: 'bg-green-100 text-green-800',
    UPDATE: 'bg-yellow-100 text-yellow-800',
    DELETE: 'bg-red-100 text-red-800',
    LOGIN: 'bg-blue-100 text-blue-800',
    REGISTER: 'bg-purple-100 text-purple-800',
  };
  return colors[action as keyof typeof colors] || 'bg-gray-100 text-gray-800';
};

const getActionText = (action: string) => {
  const texts = {
    CREATE: 'Crear',
    UPDATE: 'Actualizar',
    DELETE: 'Eliminar',
    LOGIN: 'Iniciar Sesión',
    REGISTER: 'Registrarse',
  };
  return texts[action as keyof typeof texts] || action;
};

export const auditManagementConfig = {
  title: "Registros de Auditoría",
  createButtonText: "", // No se puede crear registros de auditoría manualmente
  emptyMessage: "No se encontraron registros de auditoría.",
  errorMessage: "Error al cargar los registros de auditoría",
  initialParams: {
    page: 1,
    limit: 20,
    sortBy: "createdAt",
    sortOrder: "DESC" as const,
  },
  apiService: auditApi,
  permissions: {
    roles: ["admin"], // Solo admin puede ver auditoría
    canCreate: false, // No se puede crear registros manualmente
    canEdit: false,   // No se pueden editar registros
    canDelete: false, // No se pueden borrar registros
    canView: true,    // Solo se pueden ver
  },
  columns: [
    {
      key: "timestamp",
      label: "Fecha/Hora",
      sortable: true,
      render: (_: AuditLog, value: string) => {
        if (!value) return "N/A";
        return (
          <div className="min-w-32">
            <div className="text-sm font-medium text-gray-900">
              {formatDate(value)}
            </div>
            <div className="text-xs text-gray-500">
              {formatTime(value)}
            </div>
          </div>
        );
      },
    },
    {
      key: "action",
      label: "Acción",
      render: (_: AuditLog, value: string) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getActionColor(value)}`}>
          {getActionText(value)}
        </span>
      ),
      className: "text-center min-w-24",
    },
    {
      key: "entityType",
      label: "Entidad",
      render: (_: AuditLog, value: string) => (
        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
          {value}
        </span>
      ),
      className: "text-center min-w-20",
    },
    {
      key: "userEmail",
      label: "Usuario",
      render: (audit: AuditLog, value: string) => (
        <div className="min-w-40">
          <div className="text-sm font-medium text-gray-900">
            {value || "Sistema"}
          </div>
          {audit.ipAddress && (
            <div className="text-xs text-gray-500">{audit.ipAddress}</div>
          )}
        </div>
      ),
    },
    {
      key: "details",
      label: "Detalles",
      render: (_: AuditLog, value: Record<string, unknown>) => (
        <div className="max-w-80">
          <span className="text-xs text-gray-600 line-clamp-2">
            {JSON.stringify(value, null, 2).slice(0, 100)}...
          </span>
        </div>
      ),
    },
  ] as Column<AuditLog>[],
  hideCreateButton: true, // Los registros de auditoría no se crean manualmente
  hideActions: true, // No se pueden editar/eliminar registros de auditoría
};