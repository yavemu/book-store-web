"use client";

import { CreateEditForm } from ".";
import { 
  createUserSchema, 
  updateUserSchema, 
  CreateUserFormData, 
  UpdateUserFormData 
} from "@/services/validation/schemas/users";

interface UserFormProps {
  mode: "create" | "edit";
  onCreateSubmit?: (validatedData: CreateUserFormData) => Promise<void>;
  onUpdateSubmit?: (validatedData: UpdateUserFormData) => Promise<void>;
  onCreateSuccess?: () => void;
  onEditSuccess?: () => void;
  initialData?: Partial<UpdateUserFormData>;
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

// Fields tipados para crear usuario
const createUserFields: TypedFormField<CreateUserFormData>[] = [
  { name: "username", label: "Nombre de usuario", type: "text", placeholder: "Ej: juan_perez" },
  { name: "email", label: "Correo electrónico", type: "email", placeholder: "usuario@ejemplo.com" },
  { name: "password", label: "Contraseña", type: "password", placeholder: "Mínimo 8 caracteres" },
  { name: "roleId", label: "Rol", type: "text", placeholder: "Seleccionar rol..." }
];

// Fields tipados para editar usuario (sin contraseña obligatoria)
const editUserFields: TypedFormField<UpdateUserFormData>[] = [
  { name: "username", label: "Nombre de usuario", type: "text", placeholder: "Ej: juan_perez" },
  { name: "email", label: "Correo electrónico", type: "email", placeholder: "usuario@ejemplo.com" },
  { name: "password", label: "Nueva contraseña (opcional)", type: "password", placeholder: "Dejar vacío para mantener actual" },
  { name: "roleId", label: "Rol", type: "text", placeholder: "Seleccionar rol..." }
];

export default function UserForm({
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
}: UserFormProps) {
  
  const handleCreateSubmit = async (validatedData: CreateUserFormData) => {
    if (onCreateSubmit) {
      await onCreateSubmit(validatedData);
    }
  };

  const handleUpdateSubmit = async (validatedData: UpdateUserFormData) => {
    if (onUpdateSubmit) {
      await onUpdateSubmit(validatedData);
    }
  };

  return (
    <CreateEditForm
      mode={mode}
      createSchema={createUserSchema}
      updateSchema={updateUserSchema}
      createFields={createUserFields}
      editFields={editUserFields}
      onCreateSubmit={handleCreateSubmit}
      onUpdateSubmit={handleUpdateSubmit}
      createSubmitText="Crear Usuario"
      editSubmitText="Actualizar Usuario"
      createLoadingText="Creando usuario..."
      editLoadingText="Actualizando usuario..."
      createSuccessMessage="Usuario creado exitosamente"
      editSuccessMessage="Usuario actualizado exitosamente"
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