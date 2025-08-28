"use client";

import { useState, useEffect } from "react";
import { DataTable, Column, ErrorMessage } from "@/components/ui";
import { Button } from "@/components/forms";
import { bookCatalogApi } from "@/services/api";
import { BookCatalog, BookCatalogListParams } from "@/types/domain";
import { PaginationMeta } from "@/types/api";
import { ViewBookModal } from "../modals";

export default function CatalogPage() {
  const [books, setBooks] = useState<BookCatalog[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState<BookCatalogListParams>({
    page: 1,
    limit: 10,
    sortBy: "title",
    sortOrder: "ASC",
  });
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState<BookCatalog | null>(null);

  const columns: Column<BookCatalog>[] = [
    {
      key: "coverImageUrl",
      label: "Portada",
      render: (book, value) => (
        <div className="w-16 h-20 bg-gray-200 rounded overflow-hidden">
          {value ? (
            <img
              src={value}
              alt={`Portada de ${book.title}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">Sin imagen</div>
          )}
        </div>
      ),
      className: "w-20",
    },
    {
      key: "title",
      label: "Título",
      sortable: true,
      render: (book, value) => (
        <div className="min-w-48">
          <div className="font-medium text-gray-900 truncate">{value}</div>
          <div className="text-sm text-gray-500 truncate">{book.isbnCode}</div>
          {book.summary && <div className="text-xs text-gray-400 truncate mt-1">{book.summary.substring(0, 80)}...</div>}
        </div>
      ),
    },
    {
      key: "genre",
      label: "Género",
      render: (book) => book.genre?.name || "Sin género",
      className: "min-w-32",
    },
    {
      key: "publisher",
      label: "Editorial",
      render: (book) => (
        <div>
          <div>{book.publisher?.name || "Sin editorial"}</div>
          {book.publisher?.country && <div className="text-xs text-gray-500">{book.publisher.country}</div>}
        </div>
      ),
      className: "min-w-32",
    },
    {
      key: "price",
      label: "Precio",
      sortable: true,
      render: (_, value) => <span className="text-green-600 font-semibold">${Number(value).toFixed(2)}</span>,
      className: "text-right",
    },
    {
      key: "stockQuantity",
      label: "Disponible",
      render: (book) => (
        <div className="text-center">
          {book.isAvailable && book.stockQuantity > 0 ? (
            <div>
              <span className="text-green-600 font-medium">{book.stockQuantity}</span>
              <div className="text-xs text-gray-500">en stock</div>
            </div>
          ) : (
            <span className="text-red-500 text-sm">Agotado</span>
          )}
        </div>
      ),
      className: "text-center",
    },
  ];

  const fetchBooks = async (searchParams?: BookCatalogListParams) => {
    try {
      setLoading(true);
      setError(null);
      const currentParams = { ...params, ...searchParams };

      console.log("CatalogPage: fetchBooks iniciado con params:", currentParams);

      // Para el catálogo público, usar el endpoint base con paginación
      const response = await bookCatalogApi.list(currentParams);

      console.log("CatalogPage: respuesta recibida:", response);

      setBooks(response.data);
      setMeta(response.meta);
      setParams(currentParams);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar el catálogo");
      setBooks([]);
      setMeta({
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
        hasNext: false,
        hasPrev: false,
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    fetchBooks({ page });
  };

  const handleSort = (sortBy: string, sortOrder: "ASC" | "DESC") => {
    fetchBooks({ sortBy, sortOrder, page: 1 });
  };

  const handleViewBook = (book: BookCatalog) => {
    setSelectedBook(book);
    setShowViewModal(true);
  };

  const renderActions = (book: BookCatalog) => (
    <div className="flex items-center justify-center">
      <Button
        onClick={() => handleViewBook(book)}
        className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 transition-colors"
      >
        Ver Detalles
      </Button>
    </div>
  );

  useEffect(() => {
    console.log("CatalogPage: useEffect ejecutándose, iniciando fetchBooks...");
    fetchBooks();
  }, []);

  if (error) {
    return (
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Catálogo de Libros</h1>
        </div>
        <ErrorMessage error={error} />
        <div className="mt-4">
          <Button onClick={() => fetchBooks()} className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Catálogo de Libros</h1>
          <p className="text-gray-600 mt-1">Explora nuestra colección de {meta.total} libros disponibles</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            onClick={() => fetchBooks()}
            disabled={loading}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            Actualizar
          </Button>
        </div>
      </div>

      <DataTable
        data={books}
        columns={columns}
        meta={meta}
        loading={loading}
        onPageChange={handlePageChange}
        onSort={handleSort}
        actions={renderActions}
        emptyMessage="No hay libros disponibles en este momento."
      />

      <ViewBookModal
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setSelectedBook(null);
        }}
        book={selectedBook}
      />
    </div>
  );
}
