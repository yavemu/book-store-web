"use client";

import { CreateEditForm } from ".";
import { 
  createAuthorSchema, 
  updateAuthorSchema, 
  CreateAuthorFormData, 
  UpdateAuthorFormData 
} from "@/services/validation/schemas/authors";

interface AuthorFormProps {
  mode: "create" | "edit";
  onCreateSubmit?: (validatedData: CreateAuthorFormData) => Promise<void>;
  onUpdateSubmit?: (validatedData: UpdateAuthorFormData) => Promise<void>;
  onCreateSuccess?: () => void;
  onEditSuccess?: () => void;
  initialData?: Partial<UpdateAuthorFormData>;
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

// Fields tipados para crear autor
const createAuthorFields: TypedFormField<CreateAuthorFormData>[] = [
  { name: "firstName", label: "Nombre", type: "text", placeholder: "Ej: Gabriel" },
  { name: "lastName", label: "Apellidos", type: "text", placeholder: "Ej: García Márquez" },
  { name: "nationality", label: "Nacionalidad", type: "text", placeholder: "Ej: Colombiana" },
  { name: "birthDate", label: "Fecha de nacimiento", type: "text", placeholder: "YYYY-MM-DD" },
  { name: "biography", label: "Biografía", type: "textarea", placeholder: "Información sobre el autor..." }
];

// Fields tipados para editar autor (mismos campos)
const editAuthorFields: TypedFormField<UpdateAuthorFormData>[] = [
  { name: "firstName", label: "Nombre", type: "text", placeholder: "Ej: Gabriel" },
  { name: "lastName", label: "Apellidos", type: "text", placeholder: "Ej: García Márquez" },
  { name: "nationality", label: "Nacionalidad", type: "text", placeholder: "Ej: Colombiana" },
  { name: "birthDate", label: "Fecha de nacimiento", type: "text", placeholder: "YYYY-MM-DD" },
  { name: "biography", label: "Biografía", type: "textarea", placeholder: "Información sobre el autor..." }
];

export default function AuthorForm({
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
}: AuthorFormProps) {
  
  const handleCreateSubmit = async (validatedData: CreateAuthorFormData) => {
    if (onCreateSubmit) {
      await onCreateSubmit(validatedData);
    }
  };

  const handleUpdateSubmit = async (validatedData: UpdateAuthorFormData) => {
    if (onUpdateSubmit) {
      await onUpdateSubmit(validatedData);
    }
  };

  return (
    <CreateEditForm
      mode={mode}
      createSchema={createAuthorSchema}
      updateSchema={updateAuthorSchema}
      createFields={createAuthorFields}
      editFields={editAuthorFields}
      onCreateSubmit={handleCreateSubmit}
      onUpdateSubmit={handleUpdateSubmit}
      createSubmitText="Crear Autor"
      editSubmitText="Actualizar Autor"
      createLoadingText="Creando autor..."
      editLoadingText="Actualizando autor..."
      createSuccessMessage="Autor creado exitosamente"
      editSuccessMessage="Autor actualizado exitosamente"
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