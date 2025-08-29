import { 
  createGenreSchema, 
  updateGenreSchema, 
  CreateGenreFormData, 
  UpdateGenreFormData 
} from "@/services/validation/schemas/genres";
import { EntityFormConfig, TypedFormField } from "@/types/forms";

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

export const genresFormConfig: EntityFormConfig<CreateGenreFormData, UpdateGenreFormData> = {
  createSchema: createGenreSchema,
  updateSchema: updateGenreSchema,
  createFields: createGenreFields,
  editFields: editGenreFields,
  entityName: "Genre",
  createSubmitText: "Crear Género",
  editSubmitText: "Actualizar Género",
  createLoadingText: "Creando género...",
  editLoadingText: "Actualizando género...",
  createSuccessMessage: "Género creado exitosamente",
  editSuccessMessage: "Género actualizado exitosamente"
};