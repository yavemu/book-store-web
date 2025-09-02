"use client";

import DynamicTable from "@/components/DynamicTable";
import { PaginationMeta, TableColumn } from "@/types/table";
import { BookAuthorResponseDto } from "@/types/api/entities";

export default function AuthorTable({
  data,
  meta,
  loading,
  onPageChange,
}: {
  data: BookAuthorResponseDto[];
  meta?: PaginationMeta;
  loading: boolean;
  onPageChange: (page: number) => void;
}) {
  const columns: TableColumn[] = [
    { key: "firstName", label: "Nombre" },
    { key: "lastName", label: "Apellido" },
    { key: "fullName", label: "Nombre Completo" },
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
      key: "deathDate",
      label: "Fecha Fallecimiento",
      render: (value) => value ? new Date(value).toLocaleDateString() : "-",
    },
    {
      key: "isActive",
      label: "Estado",
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          value 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {value ? 'Activo' : 'Inactivo'}
        </span>
      ),
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