"use client";

import { PaginationMeta } from "@/hooks/table/useTablePagination";

interface TableInfoProps {
  meta: PaginationMeta;
}

export default function TableInfo({ meta }: TableInfoProps) {
  const { totalItems, currentPage, itemsPerPage } = meta;

  if (totalItems === 0) {
    return <div className="pagination-info">Mostrando 0 - 0 de 0 registros</div>;
  }

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="pagination-info">
      Mostrando {startItem} - {endItem} de {totalItems} registros
    </div>
  );
}
