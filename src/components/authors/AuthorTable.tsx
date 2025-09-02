"use client";

import DynamicTable from "@/components/DynamicTable";
import { authorsApi } from "@/services/api/entities/authors";
import { ApiPaginationMeta, BookAuthorResponseDto, CreateBookAuthorDto, UpdateBookAuthorDto } from "@/types/api/entities";
import { TableColumn } from "@/types/table";
import { useState } from "react";
import AuthorForm from "./AuthorForm";
import AuthorViewModal from "./AuthorViewModal";
import DeleteAuthorDialog from "./DeleteAuthorDialog";

interface AuthorTableProps {
  data: BookAuthorResponseDto[];
  meta?: ApiPaginationMeta;
  loading: boolean;
  onPageChange: (page: number) => void;
  onDataRefresh: () => void; // Callback to refresh data after CRUD operations
  quickSearchComponent?: React.ReactNode;
}

export default function AuthorTable({ data, meta, loading, onPageChange, onDataRefresh, quickSearchComponent }: AuthorTableProps) {
  // Modal states
  const [showForm, setShowForm] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Current operations
  const [selectedAuthor, setSelectedAuthor] = useState<BookAuthorResponseDto | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [crudLoading, setCrudLoading] = useState(false);

  const columns: TableColumn[] = [
    { key: "firstName", label: "Nombre" },
    { key: "lastName", label: "Apellido" },
    {
      key: "nationality",
      label: "Nacionalidad",
      render: (value) => value || "-",
    },
    {
      key: "birthDate",
      label: "Fecha Nacimiento",
      render: (value) => (value ? new Date(value).toLocaleDateString() : "-"),
    },
  ];

  // CRUD Operations
  const handleCreate = () => {
    setSelectedAuthor(null);
    setIsEditing(false);
    setShowForm(true);
  };

  const handleView = (author: BookAuthorResponseDto) => {
    setSelectedAuthor(author);
    setShowViewModal(true);
  };

  const handleEdit = (author: BookAuthorResponseDto) => {
    setSelectedAuthor(author);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = (author: BookAuthorResponseDto) => {
    setSelectedAuthor(author);
    setShowDeleteDialog(true);
  };

  const handleFormSubmit = async (formData: CreateBookAuthorDto | UpdateBookAuthorDto) => {
    setCrudLoading(true);
    try {
      if (isEditing && selectedAuthor) {
        // Update existing author
        await authorsApi.update(selectedAuthor.id, formData as UpdateBookAuthorDto);
        console.log("Autor actualizado exitosamente");
      } else {
        // Create new author
        await authorsApi.create(formData as CreateBookAuthorDto);
        console.log("Autor creado exitosamente");
      }

      // Close form and refresh data
      setShowForm(false);
      setSelectedAuthor(null);
      setIsEditing(false);
      onDataRefresh();
    } catch (error) {
      console.error("Error al guardar autor:", error);
      // Here you could show a toast notification or error message
    } finally {
      setCrudLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedAuthor) return;

    setCrudLoading(true);
    try {
      await authorsApi.delete(selectedAuthor.id);
      console.log("Autor eliminado exitosamente");

      // Close dialog and refresh data
      setShowDeleteDialog(false);
      setSelectedAuthor(null);
      onDataRefresh();
    } catch (error) {
      console.error("Error al eliminar autor:", error);
      // Here you could show a toast notification or error message
    } finally {
      setCrudLoading(false);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setSelectedAuthor(null);
    setIsEditing(false);
  };

  const handleViewModalClose = () => {
    setShowViewModal(false);
    setSelectedAuthor(null);
  };

  const handleDeleteCancel = () => {
    setShowDeleteDialog(false);
    setSelectedAuthor(null);
  };

  return (
    <>
      <DynamicTable
        data={data}
        columns={columns}
        meta={meta}
        loading={loading}
        onPageChange={onPageChange}
        actions={[
          {
            label: "Ver",
            onClick: handleView,
            variant: "ver", // Uses audit button style as requested
          },
          {
            label: "Editar",
            onClick: handleEdit,
            variant: "editar", // Uses audit button style as requested
          },
          {
            label: "Eliminar",
            onClick: handleDelete,
            variant: "eliminar", // Uses audit button style as requested
          },
        ]}
        showCreateButton={true}
        entityName="autor"
        onCreateClick={handleCreate}
        showForm={showForm}
        formComponent={
          showForm && (
            <AuthorForm author={selectedAuthor} onSubmit={handleFormSubmit} onCancel={handleFormCancel} loading={crudLoading} isEditing={isEditing} />
          )
        }
        onFormToggle={() => setShowForm(!showForm)}
        isEditing={isEditing}
        quickSearchComponent={quickSearchComponent}
      />

      {/* View Modal */}
      {showViewModal && selectedAuthor && <AuthorViewModal author={selectedAuthor} isOpen={showViewModal} onClose={handleViewModalClose} />}

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && selectedAuthor && (
        <DeleteAuthorDialog
          author={selectedAuthor}
          isOpen={showDeleteDialog}
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
          loading={crudLoading}
        />
      )}
    </>
  );
}