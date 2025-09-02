"use client";

import DynamicTable from "@/components/DynamicTable";
import { PaginationMeta, TableColumn } from "@/types/table";
import { InventoryMovementResponseDto } from "@/types/api/entities";

export default function InventoryMovementTable({
  data,
  meta,
  loading,
  onPageChange,
}: {
  data: InventoryMovementResponseDto[];
  meta?: PaginationMeta;
  loading: boolean;
  onPageChange: (page: number) => void;
}) {
  const columns: TableColumn[] = [
    {
      key: "book",
      label: "Libro",
      render: (value) => value?.title || "-",
    },
    {
      key: "movementType",
      label: "Tipo Movimiento",
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 'IN' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {value === 'IN' ? 'Entrada' : 'Salida'}
        </span>
      ),
    },
    {
      key: "quantity",
      label: "Cantidad",
      render: (value) => value?.toString() || "0",
    },
    {
      key: "notes",
      label: "Notas",
      render: (value) => value ? (
        <span title={value} className="truncate max-w-xs block">
          {value.length > 50 ? `${value.substring(0, 50)}...` : value}
        </span>
      ) : "-",
    },
    {
      key: "createdAt",
      label: "Fecha Creación",
      render: (value) => new Date(value).toLocaleString(),
    },
    {
      key: "updatedAt",
      label: "Última Actualización",
      render: (value) => value ? new Date(value).toLocaleString() : "-",
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