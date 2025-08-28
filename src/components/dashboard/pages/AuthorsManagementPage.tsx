"use client";

import { useCallback } from "react";
import { Column } from "@/components/ui";
import { authorsApi } from "@/services/api/entities/authors";
import { BookAuthor, AuthorListParams, AuthorFiltersDto } from "@/types/authors";
import { useManagementPage } from "@/hooks/useManagementPage";
import { ManagementPageLayout, ManagementActions } from "../common";
import { formatDate } from "@/utils/dateFormatter";

export default function AuthorsManagementPage() {
  const {
    data: authors,
    meta,
    loading,
    error,
    fetchData: fetchAuthors,
    handlePageChange,
    handleSort,
    handleView: handleViewAuthor,
    handleEdit: handleEditAuthor,
    handleDelete: handleDeleteAuthor,
    modalStates: { showCreateModal, showEditModal, showDeleteModal, showViewModal },
    setShowCreateModal,
    setShowEditModal,
    setShowDeleteModal,
    setShowViewModal,
    selectedItem: selectedAuthor,
    setSelectedItem: setSelectedAuthor,
  } = useManagementPage<BookAuthor, AuthorListParams, AuthorFiltersDto>({
    initialParams: {
      page: 1,
      limit: 10,
      sortBy: "lastName",
      sortOrder: "ASC",
    },
    apiService: authorsApi,
    errorMessage: "Error al cargar los autores",
  });

  const columns: Column<BookAuthor>[] = [
    {
      key: "profileImageUrl",
      label: "Foto",
      className: "w-20",
      render: (author, value) => (
        <div className="w-16 h-16 bg-gray-200 rounded-full overflow-hidden">
          {value && typeof value === 'string' ? (
            <img
              src={value as string}
              alt={`Foto de ${author.firstName} ${author.lastName}`}
              className="w-full h-full object-cover"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
              {author.firstName.charAt(0)}{author.lastName.charAt(0)}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "firstName",
      label: "Nombre",
      sortable: true,
      render: (author, value) => (
        <div className="min-w-48">
          <div className="font-medium text-gray-900">{`${value} ${author.lastName}`}</div>
          <div className="text-sm text-gray-500">{author.nationality || "Sin nacionalidad"}</div>
        </div>
      ),
    },
    { 
      key: "birthDate", 
      label: "Fecha de nacimiento", 
      render: (_, value) => formatDate(value as string), 
      className: "min-w-32" 
    },
    { 
      key: "website", 
      label: "Sitio web", 
      render: (_, value) => value && typeof value === 'string' ? (
        <a href={value as string} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 truncate max-w-32 block">
          {value as string}
        </a>
      ) : "N/A", 
      className: "min-w-32" 
    },
    {
      key: "isActive",
      label: "Activo",
      className: "text-center",
      render: (_, value) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${value ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
          {value ? "Sí" : "No"}
        </span>
      ),
    },
  ];

  const renderActions = useCallback(
    (author: BookAuthor) => (
      <ManagementActions
        item={author}
        onView={handleViewAuthor}
        onEdit={handleEditAuthor}
        onDelete={handleDeleteAuthor}
      />
    ),
    [handleViewAuthor, handleEditAuthor, handleDeleteAuthor],
  );

  return (
    <ManagementPageLayout
      title="Panel Administrativo de Autores"
      data={authors as unknown as Record<string, unknown>[]}
      columns={columns as unknown as Column<Record<string, unknown>>[]}
      meta={meta}
      loading={loading}
      error={error}
      emptyMessage="No se encontraron autores. Crea tu primer autor para comenzar."
      createButtonText="Crear Autor"
      onRefresh={() => fetchAuthors()}
      onCreate={() => setShowCreateModal(true)}
      onPageChange={handlePageChange}
      onSort={handleSort}
      renderActions={renderActions as unknown as (item: Record<string, unknown>) => React.ReactNode}
    />
  );
}