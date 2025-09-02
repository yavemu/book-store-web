"use client";

import DynamicTable from "@/components/DynamicTable";
import { ApiPaginationMeta, AuditLogResponseDto } from "@/types/api/entities";
import { TableColumn } from "@/types/table";

export default function AuditTable({
  data,
  meta,
  loading,
  onPageChange,
  quickSearchComponent,
}: {
  data: AuditLogResponseDto[];
  meta?: ApiPaginationMeta;
  loading: boolean;
  onPageChange: (page: number) => void;
  quickSearchComponent?: React.ReactNode;
}) {
  const columns: TableColumn[] = [
    { key: "action", label: "Acción" },
    { key: "performedBy", label: "Usuario" },
    {
      key: "details",
      label: "Detalles",
      render: (value) => (value ? String(value).substring(0, 50) + "..." : "-"),
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
      quickSearchComponent={quickSearchComponent}
    />
  );
}
