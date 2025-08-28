"use client";

import { useCallback } from "react";
import { Column } from "@/components/ui";
import { bookCatalogApi } from "@/services/api";
import { BookCatalog, BookCatalogListParams, BookFiltersDto } from "@/types/domain";
import { useManagementPage } from "@/hooks/useManagementPage";
import { ManagementPageLayout, ManagementActions } from "../common";
import { CreateBookModal, EditBookModal, DeleteBookModal, ViewBookModal } from "../modals";
import { BookFilters } from "../components";

export default function BooksManagementPage() {
  const {
    data: books,
    meta,
    loading,
    error,
    fetchData: fetchBooks,
    handlePageChange,
    handleSort,
    handleFilter,
    handleClearFilters,
    handleView: handleViewBook,
    handleEdit: handleEditBook,
    handleDelete: handleDeleteBook,
    modalStates: { showCreateModal, showEditModal, showDeleteModal, showViewModal },
    setShowCreateModal,
    setShowEditModal,
    setShowDeleteModal,
    setShowViewModal,
    selectedItem: selectedBook,
    setSelectedItem: setSelectedBook,
  } = useManagementPage<BookCatalog, BookCatalogListParams, BookFiltersDto>({
    initialParams: {
      page: 1,
      limit: 10,
      sortBy: "createdAt",
      sortOrder: "DESC",
    },
    apiService: bookCatalogApi,
    errorMessage: "Error al cargar los libros",
  });

  const columns: Column<BookCatalog>[] = [
    {
      key: "coverImageUrl",
      label: "Portada",
      className: "w-20",
      render: (book, value) => (
        <div className="w-16 h-20 bg-gray-200 rounded overflow-hidden">
          {value && typeof value === 'string' ? (
            <img
              src={value as string}
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
          <div className="font-medium text-gray-900 truncate">{value as string}</div>
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


  const renderActions = useCallback(
    (book: BookCatalog) => (
      <ManagementActions
        item={book}
        onView={handleViewBook}
        onEdit={handleEditBook}
        onDelete={handleDeleteBook}
      />
    ),
    [handleViewBook, handleEditBook, handleDeleteBook],
  );


  return (
    <>
      <ManagementPageLayout
        title="Panel Administrativo de Libros"
        data={books as unknown as Record<string, unknown>[]}
        columns={columns as unknown as Column<Record<string, unknown>>[]}
        meta={meta}
        loading={loading}
        error={error}
        emptyMessage="No se encontraron libros. Crea tu primer libro para comenzar."
        createButtonText="Crear Libro"
        onRefresh={() => fetchBooks()}
        onCreate={() => setShowCreateModal(true)}
        onPageChange={handlePageChange}
        onSort={handleSort}
        renderActions={renderActions as unknown as (item: Record<string, unknown>) => React.ReactNode}
        filters={<BookFilters onFilter={handleFilter} onClear={handleClearFilters} loading={loading} />}
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
    </>
  );
}
