"use client";

import { CreateEditForm } from ".";
import { 
  createGenreSchema, 
  updateGenreSchema, 
  CreateGenreFormData, 
  UpdateGenreFormData 
} from "@/services/validation/schemas/genres";

interface GenreFormProps {
  mode: "create" | "edit";
  onCreateSubmit?: (validatedData: CreateGenreFormData) => Promise<void>;
  onUpdateSubmit?: (validatedData: UpdateGenreFormData) => Promise<void>;
  onCreateSuccess?: () => void;
  onEditSuccess?: () => void;
  initialData?: Partial<UpdateGenreFormData>;
  createLoading?: boolean;
  editLoading?: boolean;
  errorMessage?: string;
  showErrorMessage?: boolean;
}

// Tipo para campos tipados con Zod
type TypedFormField<T> = {
  name: keyof T;
  label: string;
  type?: "text" | "email" | "password" | "number" | "textarea";
  placeholder?: string;
};

// Fields tipados para crear género
const createGenreFields: TypedFormField<CreateGenreFormData>[] = [
  { name: "name", label: "Nombre del género", type: "text", placeholder: "Ej: Ciencia ficción" },
  { name: "description", label: "Descripción", type: "textarea", placeholder: "Descripción del género..." }
];

// Fields tipados para editar género (mismos campos)
const editGenreFields: TypedFormField<UpdateGenreFormData>[] = [
  { name: "name", label: "Nombre del género", type: "text", placeholder: "Ej: Ciencia ficción" },
  { name: "description", label: "Descripción", type: "textarea", placeholder: "Descripción del género..." }
];

export default function GenreForm({
  mode,
  onCreateSubmit,
  onUpdateSubmit,
  onCreateSuccess,
  onEditSuccess,
  initialData = {},
  createLoading = false,
  editLoading = false,
  errorMessage,
  showErrorMessage = false
}: GenreFormProps) {
  
  const handleCreateSubmit = async (validatedData: CreateGenreFormData) => {
    if (onCreateSubmit) {
      await onCreateSubmit(validatedData);
    }
  };

  const handleUpdateSubmit = async (validatedData: UpdateGenreFormData) => {
    if (onUpdateSubmit) {
      await onUpdateSubmit(validatedData);
    }
  };

  return (
    <CreateEditForm
      mode={mode}
      createSchema={createGenreSchema}
      updateSchema={updateGenreSchema}
      createFields={createGenreFields}
      editFields={editGenreFields}
      onCreateSubmit={handleCreateSubmit}
      onUpdateSubmit={handleUpdateSubmit}
      createSubmitText="Crear Género"
      editSubmitText="Actualizar Género"
      createLoadingText="Creando género..."
      editLoadingText="Actualizando género..."
      createSuccessMessage="Género creado exitosamente"
      editSuccessMessage="Género actualizado exitosamente"
      onCreateSuccess={onCreateSuccess}
      onEditSuccess={onEditSuccess}
      initialData={initialData}
      createLoading={createLoading}
      editLoading={editLoading}
      errorMessage={errorMessage}
      showErrorMessage={showErrorMessage}
    />
  );
}