"use client";

import { useState } from "react";
import { Modal } from "@/components/ui";
import { 
  AuthorForm, 
  GenreForm, 
  PublisherForm, 
  BookForm, 
  UserForm 
} from "@/components/forms";
import { 
  CreateAuthorFormData,
  CreateGenreFormData,
  CreatePublishingHouseFormData,
  CreateBookFormData,
  CreateUserFormData
} from "@/services/validation/schemas";
import { authorsApi } from "@/services/api/entities/authors";
import { genresApi } from "@/services/api/entities/genres";
import { publishingHousesApi } from "@/services/api/entities/publishing-houses";
import { bookCatalogApi } from "@/services/api/entities/book-catalog";
import { usersApi } from "@/services/api/entities/users";

type EntityType = "authors" | "genres" | "publishers" | "books" | "users";

interface CreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  entityType: EntityType;
}

export default function CreateModal({ 
  isOpen, 
  onClose, 
  onSuccess,
  entityType 
}: CreateModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const handleClose = () => {
    if (!loading) {
      setError("");
      onClose();
    }
  };

  const handleSuccess = () => {
    setError("");
    onSuccess();
    onClose();
  };

  // API mapping
  const apiMap = {
    authors: authorsApi,
    genres: genresApi,
    publishers: publishingHousesApi,
    books: bookCatalogApi,
    users: usersApi
  };

  // Title mapping
  const titleMap = {
    authors: "Crear Nuevo Autor",
    genres: "Crear Nuevo Género", 
    publishers: "Crear Nueva Editorial",
    books: "Crear Nuevo Libro",
    users: "Crear Nuevo Usuario"
  };

  // Create handlers
  const handleCreateAuthor = async (validatedData: CreateAuthorFormData) => {
    try {
      setLoading(true);
      setError("");
      await apiMap.authors.create(validatedData);
      handleSuccess();
    } catch (err: unknown) {
      setError((err as Error)?.message || "Error al crear el autor");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGenre = async (validatedData: CreateGenreFormData) => {
    try {
      setLoading(true);
      setError("");
      await apiMap.genres.create(validatedData);
      handleSuccess();
    } catch (err: unknown) {
      setError((err as Error)?.message || "Error al crear el género");
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePublisher = async (validatedData: CreatePublishingHouseFormData) => {
    try {
      setLoading(true);
      setError("");
      await apiMap.publishers.create(validatedData);
      handleSuccess();
    } catch (err: unknown) {
      setError((err as Error)?.message || "Error al crear la editorial");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBook = async (validatedData: CreateBookFormData) => {
    try {
      setLoading(true);
      setError("");
      await apiMap.books.create(validatedData);
      handleSuccess();
    } catch (err: unknown) {
      setError((err as Error)?.message || "Error al crear el libro");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (validatedData: CreateUserFormData) => {
    try {
      setLoading(true);
      setError("");
      await apiMap.users.create(validatedData);
      handleSuccess();
    } catch (err: unknown) {
      setError((err as Error)?.message || "Error al crear el usuario");
    } finally {
      setLoading(false);
    }
  };

  const renderForm = () => {
    switch (entityType) {
      case "authors":
        return (
          <AuthorForm
            mode="create"
            onCreateSubmit={handleCreateAuthor}
            createLoading={loading}
            errorMessage={error}
            showErrorMessage={!!error}
          />
        );

      case "genres":
        return (
          <GenreForm
            mode="create"
            onCreateSubmit={handleCreateGenre}
            createLoading={loading}
            errorMessage={error}
            showErrorMessage={!!error}
          />
        );

      case "publishers":
        return (
          <PublisherForm
            mode="create"
            onCreateSubmit={handleCreatePublisher}
            createLoading={loading}
            errorMessage={error}
            showErrorMessage={!!error}
          />
        );

      case "books":
        return (
          <BookForm
            mode="create"
            onCreateSubmit={handleCreateBook}
            createLoading={loading}
            errorMessage={error}
            showErrorMessage={!!error}
          />
        );

      case "users":
        return (
          <UserForm
            mode="create"
            onCreateSubmit={handleCreateUser}
            createLoading={loading}
            errorMessage={error}
            showErrorMessage={!!error}
          />
        );

      default:
        return <div>Tipo de entidad no soportado</div>;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={titleMap[entityType]}
      size="lg"
    >
      {renderForm()}
    </Modal>
  );
}