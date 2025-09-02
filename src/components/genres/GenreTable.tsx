"use client";

import DynamicTable from "@/components/DynamicTable";
import { TableColumn } from "@/types/table";
import { BookGenreResponseDto, ApiPaginationMeta } from "@/types/api/entities";

export default function GenreTable({
  data,
  meta,
  loading,
  onPageChange,
}: {
  data: BookGenreResponseDto[];
  meta?: ApiPaginationMeta;
  loading: boolean;
  onPageChange: (page: number) => void;
}) {
  const columns: TableColumn[] = [
    { key: "name", label: "Nombre" },
    {
      key: "description",
      label: "Descripción",
      render: (value) => value || "-",
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
          onClick: (item) => console.log("Editar género:", item.id),
          variant: "default",
        },
        {
          label: "Eliminar",
          onClick: (item) => console.log("Eliminar género:", item.id),
          variant: "destructive",
        },
      ]}
      showCreateButton={true}
      entityName="género"
      onCreateClick={() => console.log("Crear nuevo género")}
    />
  );
}