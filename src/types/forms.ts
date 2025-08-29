import { z } from 'zod';

// Tipo genérico para campos de formulario tipados con Zod
export type TypedFormField<T> = {
  name: keyof T;
  label: string;
  type?: "text" | "email" | "password" | "number" | "textarea" | "select" | "date";
  placeholder?: string;
  options?: Array<{ value: string; label: string }>;
  step?: string;
  min?: string;
  max?: string;
};

// Interfaz base para formularios de entidad
export interface BaseEntityFormProps<CreateT, UpdateT> {
  mode: "create" | "edit";
  onCreateSubmit?: (validatedData: CreateT) => Promise<void>;
  onUpdateSubmit?: (validatedData: UpdateT) => Promise<void>;
  onCreateSuccess?: () => void;
  onEditSuccess?: () => void;
  initialData?: Partial<UpdateT>;
  createLoading?: boolean;
  editLoading?: boolean;
  errorMessage?: string;
  showErrorMessage?: boolean;
}

// Configuración para formularios de entidad
export interface EntityFormConfig<CreateT, UpdateT> {
  createSchema: z.ZodSchema<CreateT>;
  updateSchema: z.ZodSchema<UpdateT>;
  createFields: TypedFormField<CreateT>[];
  editFields: TypedFormField<UpdateT>[];
  entityName: string;
  createSubmitText: string;
  editSubmitText: string;
  createLoadingText: string;
  editLoadingText: string;
  createSuccessMessage: string;
  editSuccessMessage: string;
}