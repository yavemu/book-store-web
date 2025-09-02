"use client";

import DynamicTable from "@/components/DynamicTable";
import { PaginationMeta, TableColumn } from "@/types/table";

export default function AuditTable({
  data,
  meta,
  loading,
  onPageChange,
}: {
  data: any[];
  meta?: PaginationMeta;
  loading: boolean;
  onPageChange: (page: number) => void;
}) {
  const columns: TableColumn[] = [
    { key: "action", label: "Acción" },
    { key: "entityType", label: "Tipo Entidad" },
    {
      key: "details",
      label: "Detalles",
      render: (value) => (value ? JSON.stringify(value).substring(0, 50) + "..." : "-"),
    },
    {
      key: "createdAt",
      label: "Fecha",
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
      actions={[]} // Auditoría no tiene acciones de edición
      showCreateButton={false}
      entityName="log"
    />
  );
}
