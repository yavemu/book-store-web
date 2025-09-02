"use client";

import { PaginationMeta } from "@/hooks/table/useTablePagination";

interface TablePaginationProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}

export default function TablePagination({ meta, onPageChange, disabled = false }: TablePaginationProps) {
  const { currentPage, totalPages, hasPrevPage, hasNextPage } = meta;

  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages + 2) {
      // Si hay pocas páginas, mostrar todas
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Ajustar startPage si endPage está en el límite
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  const pages = generatePageNumbers();

  // Calculate if we need to show start/end ellipsis
  const showStart = pages.length > 0 && pages[0] > 1;
  const showEnd = pages.length > 0 && pages[pages.length - 1] < totalPages;

  return (
    <>
      <div className="simple-pagination">
        {/* Botón Anterior */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!hasPrevPage || disabled}
          className={`pagination-btn prev ${!hasPrevPage || disabled ? "disabled" : ""}`}
        >
          ← Anterior
        </button>

        {/* Primera página con ellipsis */}
        {showStart && (
          <>
            <button onClick={() => onPageChange(1)} disabled={disabled} className="pagination-btn">
              1
            </button>
            {pages[0] > 2 && <span className="pagination-ellipsis">...</span>}
          </>
        )}

        {/* Páginas principales */}
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            disabled={disabled}
            className={`pagination-btn ${page === currentPage ? "active" : ""} ${disabled ? "disabled" : ""}`}
          >
            {page}
          </button>
        ))}

        {/* Última página con ellipsis */}
        {showEnd && (
          <>
            {pages[pages.length - 1] < totalPages - 1 && <span className="pagination-ellipsis">...</span>}
            <button onClick={() => onPageChange(totalPages)} disabled={disabled} className="pagination-btn">
              {totalPages}
            </button>
          </>
        )}

        {/* Botón Siguiente */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasNextPage || disabled}
          className={`pagination-btn next ${!hasNextPage || disabled ? "disabled" : ""}`}
        >
          Siguiente →
        </button>
      </div>

      {/* Información de registros */}
      <div className="pagination-info">
        {meta.totalItems > 0
          ? `Mostrando ${(currentPage - 1) * meta.itemsPerPage + 1} - ${Math.min(currentPage * meta.itemsPerPage, meta.totalItems)} de ${
              meta.totalItems
            } registros`
          : `Mostrando 0 - 0 de 0 registros`}
      </div>
    </>
  );
}
