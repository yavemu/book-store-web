"use client";

import { CreateEditForm } from ".";
import { 
  createBookSchema, 
  updateBookSchema, 
  CreateBookFormData, 
  UpdateBookFormData 
} from "@/services/validation/schemas/books";

interface BookFormProps {
  mode: "create" | "edit";
  onCreateSubmit?: (validatedData: CreateBookFormData) => Promise<void>;
  onUpdateSubmit?: (validatedData: UpdateBookFormData) => Promise<void>;
  onCreateSuccess?: () => void;
  onEditSuccess?: () => void;
  initialData?: Partial<UpdateBookFormData>;
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

// Fields tipados para crear libro
const createBookFields: TypedFormField<CreateBookFormData>[] = [
  { name: "title", label: "Título", type: "text", placeholder: "Ej: Cien años de soledad" },
  { name: "isbnCode", label: "Código ISBN", type: "text", placeholder: "9780307474728" },
  { name: "price", label: "Precio", type: "number", placeholder: "25.99" },
  { name: "stockQuantity", label: "Cantidad en stock", type: "number", placeholder: "100" },
  { name: "pageCount", label: "Número de páginas", type: "number", placeholder: "432" },
  { name: "publicationDate", label: "Fecha de publicación", type: "text", placeholder: "YYYY-MM-DD" },
  { name: "coverImageUrl", label: "URL de portada", type: "text", placeholder: "https://ejemplo.com/portada.jpg" },
  { name: "summary", label: "Resumen", type: "textarea", placeholder: "Breve descripción del libro..." },
  { name: "genreId", label: "Género", type: "text", placeholder: "Seleccionar género..." },
  { name: "publisherId", label: "Editorial", type: "text", placeholder: "Seleccionar editorial..." }
];

// Fields tipados para editar libro (mismos campos)
const editBookFields: TypedFormField<UpdateBookFormData>[] = [
  { name: "title", label: "Título", type: "text", placeholder: "Ej: Cien años de soledad" },
  { name: "isbnCode", label: "Código ISBN", type: "text", placeholder: "9780307474728" },
  { name: "price", label: "Precio", type: "number", placeholder: "25.99" },
  { name: "stockQuantity", label: "Cantidad en stock", type: "number", placeholder: "100" },
  { name: "pageCount", label: "Número de páginas", type: "number", placeholder: "432" },
  { name: "publicationDate", label: "Fecha de publicación", type: "text", placeholder: "YYYY-MM-DD" },
  { name: "coverImageUrl", label: "URL de portada", type: "text", placeholder: "https://ejemplo.com/portada.jpg" },
  { name: "summary", label: "Resumen", type: "textarea", placeholder: "Breve descripción del libro..." },
  { name: "genreId", label: "Género", type: "text", placeholder: "Seleccionar género..." },
  { name: "publisherId", label: "Editorial", type: "text", placeholder: "Seleccionar editorial..." }
];

export default function BookForm({
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
}: BookFormProps) {
  
  const handleCreateSubmit = async (validatedData: CreateBookFormData) => {
    if (onCreateSubmit) {
      await onCreateSubmit(validatedData);
    }
  };

  const handleUpdateSubmit = async (validatedData: UpdateBookFormData) => {
    if (onUpdateSubmit) {
      await onUpdateSubmit(validatedData);
    }
  };

  return (
    <CreateEditForm
      mode={mode}
      createSchema={createBookSchema}
      updateSchema={updateBookSchema}
      createFields={createBookFields}
      editFields={editBookFields}
      onCreateSubmit={handleCreateSubmit}
      onUpdateSubmit={handleUpdateSubmit}
      createSubmitText="Crear Libro"
      editSubmitText="Actualizar Libro"
      createLoadingText="Creando libro..."
      editLoadingText="Actualizando libro..."
      createSuccessMessage="Libro creado exitosamente"
      editSuccessMessage="Libro actualizado exitosamente"
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