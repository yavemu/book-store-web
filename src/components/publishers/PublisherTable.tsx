"use client";

import DynamicTable from "@/components/DynamicTable";
import { TableColumn } from "@/types/table";
import { PublishingHouseResponseDto, ApiPaginationMeta } from "@/types/api/entities";

export default function PublisherTable({
  data,
  meta,
  loading,
  onPageChange,
}: {
  data: PublishingHouseResponseDto[];
  meta?: ApiPaginationMeta;
  loading: boolean;
  onPageChange: (page: number) => void;
}) {
  const columns: TableColumn[] = [
    { key: "name", label: "Nombre" },
    {
      key: "country",
      label: "País",
      render: (value) => value || "-",
    },
    {
      key: "foundedYear",
      label: "Año Fundación",
      render: (value) => value || "-",
    },
    {
      key: "websiteUrl",
      label: "Sitio Web",
      render: (value) => value ? (
        <a 
          href={value.startsWith('http') ? value : `https://${value}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          {value}
        </a>
      ) : "-",
    },
    {
      key: "description",
      label: "Descripción",
      render: (value) => value ? (value.length > 50 ? value.substring(0, 50) + "..." : value) : "-",
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
          onClick: (item) => console.log("Editar editorial:", item.id),
          variant: "default",
        },
        {
          label: "Eliminar",
          onClick: (item) => console.log("Eliminar editorial:", item.id),
          variant: "destructive",
        },
      ]}
      showCreateButton={true}
      entityName="editorial"
      onCreateClick={() => console.log("Crear nueva editorial")}
    />
  );
}