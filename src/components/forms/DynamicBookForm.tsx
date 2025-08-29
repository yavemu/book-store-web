"use client";

import { EntityForm } from ".";
import { booksFormConfig } from "@/config/forms";
import { useGenres } from "@/hooks/useGenres";
import { usePublishers } from "@/hooks/usePublishers";
import { BaseEntityFormProps } from "@/types/forms";
import { CreateBookFormData, UpdateBookFormData } from "@/services/validation/schemas/books";

type DynamicBookFormProps = BaseEntityFormProps<CreateBookFormData, UpdateBookFormData>;

export function DynamicBookForm(props: DynamicBookFormProps) {
  const { genres, loading: genresLoading } = useGenres();
  const { publishers, loading: publishersLoading } = usePublishers();

  // Crear configuración dinámica con géneros y editoriales actualizados
  const dynamicConfig = {
    ...booksFormConfig,
    createFields: booksFormConfig.createFields.map(field => {
      if (field.name === 'genreId') {
        return { ...field, type: "select" as const, options: genres };
      }
      if (field.name === 'publisherId') {
        return { ...field, type: "select" as const, options: publishers };
      }
      return field;
    }),
    editFields: booksFormConfig.editFields.map(field => {
      if (field.name === 'genreId') {
        return { ...field, type: "select" as const, options: genres };
      }
      if (field.name === 'publisherId') {
        return { ...field, type: "select" as const, options: publishers };
      }
      return field;
    }),
  };

  if (genresLoading || publishersLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="text-gray-600">Cargando formulario...</div>
      </div>
    );
  }

  return (
    <EntityForm
      {...props}
      config={dynamicConfig}
    />
  );
}