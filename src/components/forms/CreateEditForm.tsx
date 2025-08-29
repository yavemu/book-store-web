"use client";

import { z } from "zod";
import { SmartForm, Message } from ".";

interface FormField {
  name: string;
  label: string;
  type?: "text" | "email" | "password" | "number" | "textarea" | "date" | "select";
  placeholder?: string;
  options?: Array<{ value: string; label: string }>;
  step?: string;
  min?: string;
  max?: string;
}

interface CreateEditFormProps<CreateT extends z.ZodSchema, UpdateT extends z.ZodSchema> {
  // ✅ OBLIGATORIO: Modo del formulario
  mode: "create" | "edit";
  
  // ✅ OBLIGATORIO: Configuraciones de schemas
  createSchema: CreateT;
  updateSchema: UpdateT;
  
  // ✅ OBLIGATORIO: Campos del formulario
  createFields: FormField[];
  editFields: FormField[];
  
  // ✅ OBLIGATORIO: Handlers de submit
  onCreateSubmit: (validatedData: z.infer<CreateT>) => Promise<void>;
  onUpdateSubmit: (validatedData: z.infer<UpdateT>) => Promise<void>;
  
  // Opcionales: Textos específicos
  createSubmitText?: string;
  editSubmitText?: string;
  createLoadingText?: string;
  editLoadingText?: string;
  
  // Opcionales: Estados de loading externos
  createLoading?: boolean;
  editLoading?: boolean;
  
  // Opcionales: Mensajes de éxito
  createSuccessMessage?: string;
  editSuccessMessage?: string;
  
  // Opcionales: Callbacks de éxito
  onCreateSuccess?: () => void;
  onEditSuccess?: () => void;
  
  // Opcionales: Datos iniciales para edición
  initialData?: Partial<z.infer<UpdateT>>;
  
  // Opcionales: Contenido adicional
  topProps?: React.ReactNode;
  bottomProps?: React.ReactNode;
  className?: string;
  
  // Opcionales: Mensajes de error externos
  errorMessage?: string;
  showErrorMessage?: boolean;
}

function CreateEditForm<CreateT extends z.ZodSchema, UpdateT extends z.ZodSchema>({
  mode,
  createSchema,
  updateSchema,
  createFields,
  editFields,
  onCreateSubmit,
  onUpdateSubmit,
  createSubmitText = "Crear",
  editSubmitText = "Actualizar",
  createLoadingText = "Creando...",
  editLoadingText = "Actualizando...",
  createLoading = false,
  editLoading = false,
  createSuccessMessage = "Elemento creado exitosamente",
  editSuccessMessage = "Elemento actualizado exitosamente",
  onCreateSuccess,
  onEditSuccess,
  initialData = {},
  topProps,
  bottomProps,
  className = "form-spacing-normal",
  errorMessage,
  showErrorMessage = false
}: CreateEditFormProps<CreateT, UpdateT>) {
  
  const isCreateMode = mode === "create";
  
  // 🎯 Resolver valores según modo
  const currentSchema = isCreateMode ? createSchema : updateSchema;
  const currentFields = isCreateMode ? createFields : editFields;
  const currentSubmitHandler = isCreateMode ? onCreateSubmit : onUpdateSubmit;
  const currentSubmitText = isCreateMode ? createSubmitText : editSubmitText;
  const currentLoadingText = isCreateMode ? createLoadingText : editLoadingText;
  const currentLoading = isCreateMode ? createLoading : editLoading;
  const currentSuccessMessage = isCreateMode ? createSuccessMessage : editSuccessMessage;
  const currentOnSuccess = isCreateMode ? onCreateSuccess : onEditSuccess;
  
  const topContent = (
    <>
      <Message type="error" show={showErrorMessage && !!errorMessage}>
        {errorMessage}
      </Message>
      
      {topProps && <div>{topProps}</div>}
      
      <h2>{isCreateMode ? "Crear" : "Editar"}</h2>
    </>
  );

  return (
    <div className="vertical-form">
      <div className="form-container">
        <div className="form-content">
          <SmartForm
            schema={currentSchema}
            fields={currentFields}
            onSubmit={currentSubmitHandler}
            submitText={currentSubmitText}
            loadingText={currentLoadingText}
            loading={currentLoading}
            autoSuccessMessage={currentSuccessMessage}
            onSuccess={currentOnSuccess}
            initialData={mode === "edit" ? initialData : {}}
            className={className}
            topProps={topContent}
            bottomProps={bottomProps}
          />
        </div>
      </div>
    </div>
  );
}

export default CreateEditForm;