"use client";

import DynamicTable from "@/components/DynamicTable";
import { TableColumn } from "@/types/table";
import { BookResponseDto, ApiPaginationMeta } from "@/types/api/entities";

export default function BookTable({
  data,
  meta,
  loading,
  onPageChange,
}: {
  data: BookResponseDto[];
  meta?: ApiPaginationMeta;
  loading: boolean;
  onPageChange: (page: number) => void;
}) {
  const columns: TableColumn[] = [
    { key: "title", label: "Título" },
    {
      key: "isbnCode",
      label: "ISBN",
      render: (value) => value || "-",
    },
    {
      key: "authors",
      label: "Autores",
      render: (value) => {
        if (!value || !Array.isArray(value) || value.length === 0) return "-";
        return value.map(author => `${author.firstName} ${author.lastName}`).join(", ");
      },
    },
    {
      key: "genre",
      label: "Género",
      render: (value) => value?.name || "-",
    },
    {
      key: "publisher",
      label: "Editorial",
      render: (value) => value?.name || "-",
    },
    {
      key: "price",
      label: "Precio",
      render: (value) => value ? `$${Number(value).toFixed(2)}` : "-",
    },
    {
      key: "stockQuantity",
      label: "Stock",
      render: (value) => value?.toString() || "0",
    },
    {
      key: "isAvailable",
      label: "Disponible",
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          value 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {value ? 'Sí' : 'No'}
        </span>
      ),
    },
    {
      key: "publicationDate",
      label: "Fecha Publicación",
      render: (value) => value ? new Date(value).toLocaleDateString() : "-",
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
          label: "Ver",
          onClick: (item) => console.log("Ver libro:", item.id),
          variant: "default",
        },
        {
          label: "Editar",
          onClick: (item) => console.log("Editar libro:", item.id),
          variant: "default",
        },
        {
          label: "Eliminar",
          onClick: (item) => console.log("Eliminar libro:", item.id),
          variant: "destructive",
        },
      ]}
      showCreateButton={true}
      entityName="libro"
      onCreateClick={() => console.log("Crear nuevo libro")}
    />
  );
}