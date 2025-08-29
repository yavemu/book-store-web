"use client";

import { CreateEditForm } from ".";
import { 
  createPublishingHouseSchema, 
  updatePublishingHouseSchema, 
  CreatePublishingHouseFormData, 
  UpdatePublishingHouseFormData 
} from "@/services/validation/schemas/publishing-houses";

interface PublisherFormProps {
  mode: "create" | "edit";
  onCreateSubmit?: (validatedData: CreatePublishingHouseFormData) => Promise<void>;
  onUpdateSubmit?: (validatedData: UpdatePublishingHouseFormData) => Promise<void>;
  onCreateSuccess?: () => void;
  onEditSuccess?: () => void;
  initialData?: Partial<UpdatePublishingHouseFormData>;
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

// Fields tipados para crear editorial
const createPublisherFields: TypedFormField<CreatePublishingHouseFormData>[] = [
  { name: "name", label: "Nombre de la editorial", type: "text", placeholder: "Ej: Editorial Planeta" },
  { name: "country", label: "País", type: "text", placeholder: "Ej: España" },
  { name: "websiteUrl", label: "Sitio web", type: "text", placeholder: "https://www.editorial.com" }
];

// Fields tipados para editar editorial (mismos campos)
const editPublisherFields: TypedFormField<UpdatePublishingHouseFormData>[] = [
  { name: "name", label: "Nombre de la editorial", type: "text", placeholder: "Ej: Editorial Planeta" },
  { name: "country", label: "País", type: "text", placeholder: "Ej: España" },
  { name: "websiteUrl", label: "Sitio web", type: "text", placeholder: "https://www.editorial.com" }
];

export default function PublisherForm({
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
}: PublisherFormProps) {
  
  const handleCreateSubmit = async (validatedData: CreatePublishingHouseFormData) => {
    if (onCreateSubmit) {
      await onCreateSubmit(validatedData);
    }
  };

  const handleUpdateSubmit = async (validatedData: UpdatePublishingHouseFormData) => {
    if (onUpdateSubmit) {
      await onUpdateSubmit(validatedData);
    }
  };

  return (
    <CreateEditForm
      mode={mode}
      createSchema={createPublishingHouseSchema}
      updateSchema={updatePublishingHouseSchema}
      createFields={createPublisherFields}
      editFields={editPublisherFields}
      onCreateSubmit={handleCreateSubmit}
      onUpdateSubmit={handleUpdateSubmit}
      createSubmitText="Crear Editorial"
      editSubmitText="Actualizar Editorial"
      createLoadingText="Creando editorial..."
      editLoadingText="Actualizando editorial..."
      createSuccessMessage="Editorial creada exitosamente"
      editSuccessMessage="Editorial actualizada exitosamente"
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