"use client";

import { useState, useEffect, useCallback } from "react";
import { DataTable, Column, ErrorMessage } from "@/components/ui";
import { Button } from "@/components/forms";
import { bookCatalogApi } from "@/services/api";
import { BookCatalog, BookCatalogListParams, BookFiltersDto } from "@/types/domain";
import { PaginationMeta } from "@/types/api";
import { CreateBookModal, EditBookModal, DeleteBookModal, ViewBookModal } from "../modals";
import { BookFilters } from "../components";

export default function BooksManagementPage() {
  // Estados principales
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
    sortBy: "createdAt",
    sortOrder: "DESC",
  });
  const [activeFilters, setActiveFilters] = useState<BookFiltersDto>({});
  const [selectedBook, setSelectedBook] = useState<BookCatalog | null>(null);

  // Modales
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);

  // Columnas de la tabla
  const columns: Column<BookCatalog>[] = [
    {
      key: "coverImageUrl",
      label: "Portada",
      className: "w-20",
      render: (book, value) => (
        <div className="w-16 h-20 bg-gray-200 rounded overflow-hidden">
          {value ? (
            <img
              src={value}
              alt={`Portada de ${book.title}`}
              className="w-full h-full object-cover"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">Sin imagen</div>
          )}
        </div>
      ),
    },
    {
      key: "title",
      label: "Título",
      sortable: true,
      render: (book, value) => (
        <div className="min-w-48">
          <div className="font-medium text-gray-900 truncate">{value}</div>
          <div className="text-sm text-gray-500 truncate">{book.isbnCode}</div>
        </div>
      ),
    },
    { key: "genre", label: "Género", render: (book) => book.genre?.name || "Sin género", className: "min-w-32" },
    { key: "publisher", label: "Editorial", render: (book) => book.publisher?.name || "Sin editorial", className: "min-w-32" },
    { key: "price", label: "Precio", sortable: true, render: (_, value) => `$${Number(value).toFixed(2)}`, className: "text-right" },
    { key: "stockQuantity", label: "Stock", sortable: true, render: (_, value) => value?.toString() || "0", className: "text-center" },
    {
      key: "isAvailable",
      label: "Disponible",
      className: "text-center",
      render: (_, value) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${value ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
          {value ? "Sí" : "No"}
        </span>
      ),
    },
  ];

  // --------------------
  // Funciones de fetch
  // --------------------
  const fetchBooks = useCallback(
    async (searchParams?: BookCatalogListParams, filters?: BookFiltersDto) => {
      setLoading(true);
      setError(null);

      const currentParams = { ...params, ...searchParams };
      const currentFilters = filters ?? activeFilters;

      try {
        const response =
          Object.keys(currentFilters).length > 0 && Object.values(currentFilters).some((v) => v !== undefined)
            ? await bookCatalogApi.filter(currentFilters, currentParams.page, currentParams.limit)
            : await bookCatalogApi.list(currentParams);

        setBooks(response.data);
        setMeta(response.meta);
        setParams(currentParams);

        if (filters) setActiveFilters(currentFilters);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al cargar los libros");
        setBooks([]);
        setMeta({ total: 0, page: 1, limit: 10, totalPages: 0, hasNext: false, hasPrev: false });
      } finally {
        setLoading(false);
      }
    },
    [], // <-- corregido, dependencias vacías para evitar loop
  );

  const handlePageChange = useCallback((page: number) => fetchBooks({ page }), [fetchBooks]);
  const handleSort = useCallback((sortBy: string, sortOrder: "ASC" | "DESC") => fetchBooks({ sortBy, sortOrder, page: 1 }), [fetchBooks]);
  const handleFilter = useCallback((filters: BookFiltersDto) => fetchBooks({ page: 1 }, filters), [fetchBooks]);
  const handleClearFilters = useCallback(() => {
    setActiveFilters({});
    fetchBooks({ page: 1 }, {});
  }, [fetchBooks]);

  // --------------------
  // Handlers de acciones
  // --------------------
  const handleViewBook = useCallback((book: BookCatalog) => {
    setSelectedBook(book);
    setShowViewModal(true);
  }, []);
  const handleEditBook = useCallback((book: BookCatalog) => {
    setSelectedBook(book);
    setShowEditModal(true);
  }, []);
  const handleDeleteBook = useCallback((book: BookCatalog) => {
    setSelectedBook(book);
    setShowDeleteModal(true);
  }, []);

  const renderActions = useCallback(
    (book: BookCatalog) => (
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm" onClick={() => handleViewBook(book)} className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
          Ver
        </Button>
        <Button variant="outline" size="sm" onClick={() => handleEditBook(book)} className="text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50">
          Editar
        </Button>
        <Button variant="outline" size="sm" onClick={() => handleDeleteBook(book)} className="text-red-600 hover:text-red-700 hover:bg-red-50">
          Eliminar
        </Button>
      </div>
    ),
    [handleViewBook, handleEditBook, handleDeleteBook],
  );

  // --------------------
  // Lifecycle
  // --------------------
  useEffect(() => {
    fetchBooks();
  }, []); // solo se ejecuta al montar

  // --------------------
  // Render principal
  // --------------------
  if (error) {
    return (
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Gestión de Libros</h1>
        </div>
        <ErrorMessage error={error} />
        <div className="mt-4">
          <Button onClick={() => fetchBooks()} variant="outline">
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Panel Administrativo de Libros</h1>
        <div className="flex items-center space-x-3">
          <Button onClick={() => fetchBooks()} variant="outline" disabled={loading}>
            Actualizar
          </Button>
          <Button onClick={() => setShowCreateModal(true)} variant="primary">
            Crear Libro
          </Button>
        </div>
      </div>

      <BookFilters onFilter={handleFilter} onClear={handleClearFilters} loading={loading} />

      <DataTable
        data={books}
        columns={columns}
        meta={meta}
        loading={loading}
        onPageChange={handlePageChange}
        onSort={handleSort}
        actions={renderActions}
        emptyMessage="No se encontraron libros. Crea tu primer libro para comenzar."
      />

      <CreateBookModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} onSuccess={() => fetchBooks()} />

      <EditBookModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedBook(null);
        }}
        onSuccess={() => fetchBooks()}
        book={selectedBook}
      />

      <DeleteBookModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedBook(null);
        }}
        onSuccess={() => fetchBooks()}
        book={selectedBook}
      />

      <ViewBookModal
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setSelectedBook(null);
        }}
        onEdit={() => {
          setShowViewModal(false);
          setShowEditModal(true);
        }}
        book={selectedBook}
      />
    </div>
  );
}
