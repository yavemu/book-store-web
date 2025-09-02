"use client";

import DynamicTable from "@/components/DynamicTable";
import { TableColumn } from "@/types/table";
import { BookAuthorResponseDto, ApiPaginationMeta } from "@/types/api/entities";

export default function AuthorTable({
  data,
  meta,
  loading,
  onPageChange,
}: {
  data: BookAuthorResponseDto[];
  meta?: ApiPaginationMeta;
  loading: boolean;
  onPageChange: (page: number) => void;
}) {
  const columns: TableColumn[] = [
    { key: "firstName", label: "Nombre" },
    { key: "lastName", label: "Apellido" },
    {
      key: "nationality",
      label: "Nacionalidad",
      render: (value) => value || "-",
    },
    {
      key: "birthDate",
      label: "Fecha Nacimiento",
      render: (value) => value ? new Date(value).toLocaleDateString() : "-",
    },
    {
      key: "biography",
      label: "Biografía",
      render: (value) => value ? (value.length > 50 ? value.substring(0, 50) + "..." : value) : "-",
    },
    {
      key: "createdAt",
      label: "Fecha Creación",
      render: (value) => new Date(value).toLocaleString(),
    },
    {
      key: "updatedAt",
      label: "Última Actualización",
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
          label: "Editar",
          onClick: (item) => console.log("Editar autor:", item.id),
          variant: "default",
        },
        {
          label: "Eliminar",
          onClick: (item) => console.log("Eliminar autor:", item.id),
          variant: "destructive",
        },
      ]}
      showCreateButton={true}
      entityName="autor"
      onCreateClick={() => console.log("Crear nuevo autor")}
    />
  );
}