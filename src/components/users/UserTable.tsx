"use client";

import DynamicTable from "@/components/DynamicTable";
import { PaginationMeta, TableColumn } from "@/types/table";
import { UserResponseDto } from "@/types/api/entities";

export default function UserTable({
  data,
  meta,
  loading,
  onPageChange,
}: {
  data: UserResponseDto[];
  meta?: PaginationMeta;
  loading: boolean;
  onPageChange: (page: number) => void;
}) {
  const columns: TableColumn[] = [
    { key: "username", label: "Usuario" },
    { key: "email", label: "Email" },
    {
      key: "role",
      label: "Rol",
      render: (value) => value?.name || "-",
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
          onClick: (item) => console.log("Editar usuario:", item.id),
          variant: "default",
        },
        {
          label: "Eliminar",
          onClick: (item) => console.log("Eliminar usuario:", item.id),
          variant: "destructive",
        },
      ]}
      showCreateButton={true}
      entityName="usuario"
      onCreateClick={() => console.log("Crear nuevo usuario")}
    />
  );
}
