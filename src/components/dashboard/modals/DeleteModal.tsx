"use client";

import { DeleteModalOptimized } from ".";
import { authorsApi } from "@/services/api/entities/authors";
import { genresApi } from "@/services/api/entities/genres";
import { publishingHousesApi } from "@/services/api/entities/publishing-houses";
import { bookCatalogApi } from "@/services/api/entities/book-catalog";
import { usersApi } from "@/services/api/entities/users";

type EntityType = "authors" | "genres" | "publishers" | "books" | "users";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  entityType: EntityType;
  entityId: string;
  entityName?: string;
}

const apiMap = {
  authors: authorsApi,
  genres: genresApi,
  publishers: publishingHousesApi,
  books: bookCatalogApi,
  users: usersApi
};

export default function DeleteModal({
  entityType,
  ...props
}: DeleteModalProps) {
  const apiService = apiMap[entityType];
  
  return (
    <DeleteModalOptimized
      {...props}
      entityType={entityType}
      apiService={apiService}
    />
  );
}