"use client";

import DynamicTable from "@/components/DynamicTable";
import { TableColumn } from "@/types/table";
import { InventoryMovementResponseDto, ApiPaginationMeta } from "@/types/api/entities";

export default function InventoryMovementTable({
  data,
  meta,
  loading,
  onPageChange,
}: {
  data: InventoryMovementResponseDto[];
  meta?: ApiPaginationMeta;
  loading: boolean;
  onPageChange: (page: number) => void;
}) {
  const getMovementTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'PURCHASE': 'Compra',
      'SALE': 'Venta',
      'DISCOUNT': 'Descuento',
      'INCREASE': 'Aumento',
      'OUT_OF_STOCK': 'Sin Stock',
      'ARCHIVED': 'Archivado'
    };
    return labels[type] || type;
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'PENDING': 'Pendiente',
      'COMPLETED': 'Completado',
      'ERROR': 'Error'
    };
    return labels[status] || status;
  };

  const columns: TableColumn[] = [
    {
      key: "entityType",
      label: "Tipo Entidad",
      render: (value) => value || "-",
    },
    {
      key: "entityId",
      label: "ID Entidad",
      render: (value) => value?.substring(0, 8) + "..." || "-",
    },
    {
      key: "movementType",
      label: "Tipo Movimiento",
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          ['PURCHASE', 'INCREASE'].includes(value)
            ? 'bg-green-100 text-green-800' 
            : ['SALE', 'DISCOUNT', 'OUT_OF_STOCK'].includes(value)
            ? 'bg-red-100 text-red-800'
            : 'bg-gray-100 text-gray-800'
        }`}>
          {getMovementTypeLabel(value)}
        </span>
      ),
    },
    {
      key: "status",
      label: "Estado",
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 'COMPLETED'
            ? 'bg-green-100 text-green-800'
            : value === 'ERROR'
            ? 'bg-red-100 text-red-800'
            : 'bg-yellow-100 text-yellow-800'
        }`}>
          {getStatusLabel(value)}
        </span>
      ),
    },
    {
      key: "userId",
      label: "Usuario",
      render: (value) => value?.substring(0, 8) + "..." || "-",
    },
    {
      key: "userRole",
      label: "Rol Usuario",
      render: (value) => value || "-",
    },
    {
      key: "priceBefore",
      label: "Precio Antes",
      render: (value) => value ? `$${Number(value).toFixed(2)}` : "-",
    },
    {
      key: "priceAfter",
      label: "Precio Después",
      render: (value) => value ? `$${Number(value).toFixed(2)}` : "-",
    },
    {
      key: "quantityBefore",
      label: "Cantidad Antes",
      render: (value) => value?.toString() || "0",
    },
    {
      key: "quantityAfter",
      label: "Cantidad Después",
      render: (value) => value?.toString() || "0",
    },
    {
      key: "notes",
      label: "Notas",
      render: (value) => value ? (
        <span title={value} className="truncate max-w-xs block">
          {value.length > 30 ? `${value.substring(0, 30)}...` : value}
        </span>
      ) : "-",
    },
    {
      key: "createdAt",
      label: "Fecha Creación",
      render: (value) => new Date(value).toLocaleString(),
    },
  ];

  return (
    <DynamicTable
      data={data}
      columns={columns}
      meta={meta}
      loading={loading}
      onPageChange={onPageChange}
      actions={[
        {
          label: "Ver Detalles",
          onClick: (item) => console.log("Ver movimiento:", item.id),
          variant: "default",
        },
      ]}
      showCreateButton={true}
      entityName="movimiento de inventario"
      onCreateClick={() => console.log("Crear nuevo movimiento")}
    />
  );
}