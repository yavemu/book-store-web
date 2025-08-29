import { 
  createAuthorSchema, 
  updateAuthorSchema, 
  CreateAuthorFormData, 
  UpdateAuthorFormData 
} from "@/services/validation/schemas/authors";
import { EntityFormConfig, TypedFormField } from "@/types/forms";

// Fields tipados para crear autor
const createAuthorFields: TypedFormField<CreateAuthorFormData>[] = [
  { name: "firstName", label: "Nombre", type: "text", placeholder: "Ej: Gabriel" },
  { name: "lastName", label: "Apellidos", type: "text", placeholder: "Ej: García Márquez" },
  { name: "nationality", label: "Nacionalidad", type: "text", placeholder: "Ej: Colombiana" },
  { name: "birthDate", label: "Fecha de nacimiento", type: "date", placeholder: "YYYY-MM-DD" },
  { name: "biography", label: "Biografía", type: "textarea", placeholder: "Información sobre el autor..." }
];

// Fields tipados para editar autor (mismos campos)
const editAuthorFields: TypedFormField<UpdateAuthorFormData>[] = [
  { name: "firstName", label: "Nombre", type: "text", placeholder: "Ej: Gabriel" },
  { name: "lastName", label: "Apellidos", type: "text", placeholder: "Ej: García Márquez" },
  { name: "nationality", label: "Nacionalidad", type: "text", placeholder: "Ej: Colombiana" },
  { name: "birthDate", label: "Fecha de nacimiento", type: "date", placeholder: "YYYY-MM-DD" },
  { name: "biography", label: "Biografía", type: "textarea", placeholder: "Información sobre el autor..." }
];

export const authorsFormConfig: EntityFormConfig<CreateAuthorFormData, UpdateAuthorFormData> = {
  createSchema: createAuthorSchema,
  updateSchema: updateAuthorSchema,
  createFields: createAuthorFields,
  editFields: editAuthorFields,
  entityName: "Author",
  createSubmitText: "Guardar",
  editSubmitText: "Actualizar Autor",
  createLoadingText: "Creando autor...",
  editLoadingText: "Actualizando autor...",
  createSuccessMessage: "Autor creado exitosamente",
  editSuccessMessage: "Autor actualizado exitosamente"
};