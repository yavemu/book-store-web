"use client";

import { Modal } from "@/components/ui";
import { EntityForm } from "@/components/forms";
import { useEntityApi } from "@/hooks/useEntityApi";
import { 
  authorsFormConfig,
  genresFormConfig,
  publishersFormConfig,
  booksFormConfig,
  usersFormConfig
} from "@/config/forms";
import { authorsApi } from "@/services/api/entities/authors";
import { genresApi } from "@/services/api/entities/genres";
import { publishingHousesApi } from "@/services/api/entities/publishing-houses";
import { bookCatalogApi } from "@/services/api/entities/book-catalog";
import { usersApi } from "@/services/api/entities/users";

type EntityType = "authors" | "genres" | "publishers" | "books" | "users";

interface CreateModalOptimizedProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  entityType: EntityType;
}

export default function CreateModalOptimized({ 
  isOpen, 
  onClose, 
  onSuccess,
  entityType 
}: CreateModalOptimizedProps) {

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

  // Form config mapping
  const formConfigMap = {
    authors: authorsFormConfig,
    genres: genresFormConfig,
    publishers: publishersFormConfig,
    books: booksFormConfig,
    users: usersFormConfig
  };

  const handleClose = () => {
    onClose();
  };

  const handleSuccess = () => {
    onSuccess();
    onClose();
  };

  // Entity name mapping for user feedback
  const entityNameMap = {
    authors: 'autor',
    genres: 'género',
    publishers: 'editorial',
    books: 'libro',
    users: 'usuario'
  };

  // Single generic entity API hook
  const entityApi = useEntityApi(apiMap[entityType], {
    onCreateSuccess: handleSuccess,
    entityName: entityNameMap[entityType]
  });

  const renderOptimizedForm = () => {
    const config = formConfigMap[entityType];
    
    if (!config) {
      return <div>Configuración no encontrada para: {entityType}</div>;
    }

    return (
      <EntityForm
        mode="create"
        config={config}
        onCreateSubmit={entityApi.create}
        createLoading={entityApi.states.create.loading}
        errorMessage={entityApi.states.create.error}
        showErrorMessage={!!entityApi.states.create.error}
      />
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={titleMap[entityType]}
      size="lg"
    >
      {renderOptimizedForm()}
    </Modal>
  );
}