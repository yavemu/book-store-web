"use client";

import React, { useState } from "react";
import { z } from "zod";
import { Input } from "./elements/Input";
import { Button } from "./elements/Button";
import { Message } from "./elements/Message";

interface FormField {
  name: string;
  label: string;
  type?: "text" | "email" | "password" | "number" | "textarea";
  placeholder?: string;
}

interface FormMode<T extends z.ZodSchema> {
  schema: T;
  fields: FormField[];
  onSubmit: (validatedData: z.infer<T>) => Promise<void>;
  submitText: string;
  loadingText: string;
  autoSuccessMessage?: string;
  onSuccess?: () => void;
}

interface SmartFormProps<T extends z.ZodSchema> {
  // ✅ OBLIGATORIO: Schema Zod para validación (modo simple)
  schema?: T;
  // ✅ OBLIGATORIO: Campos del formulario (modo simple)
  fields?: FormField[];
  // ✅ OBLIGATORIO: Handler para submit (modo simple)
  onSubmit?: (validatedData: z.infer<T>) => Promise<void>;
  
  // Opcionales: Multi-modo
  modes?: Record<string, FormMode<z.ZodSchema>>;
  currentMode?: string;
  onModeChange?: (mode: string) => void;
  modeToggleText?: { [key: string]: string };
  
  // Opcionales: Textos y estados
  submitText?: string;
  loadingText?: string;
  loading?: boolean;
  className?: string;
  
  // Opcionales: Contenido adicional
  topProps?: React.ReactNode;
  bottomProps?: React.ReactNode;
  
  // Opcionales: Mensajes de éxito/error externos
  successMessage?: string;
  errorMessage?: string;
  showSuccessMessage?: boolean;
  showErrorMessage?: boolean;
  
  // Opcionales: Manejo automático de éxito
  onSuccess?: () => void;
  autoSuccessMessage?: string;
  autoSuccessDelay?: number;
  
  // Opcionales: Datos iniciales para formularios
  initialData?: Partial<z.infer<T>>;
}

function SmartForm<T extends z.ZodSchema>({
  schema,
  fields,
  onSubmit,
  modes,
  currentMode,
  onModeChange,
  modeToggleText,
  submitText = "Enviar",
  loadingText = "Enviando...",
  loading: externalLoading,
  className = "form-spacing-normal",
  topProps,
  bottomProps,
  successMessage,
  errorMessage,
  showSuccessMessage = false,
  showErrorMessage = false,
  onSuccess,
  autoSuccessMessage,
  autoSuccessDelay = 2000,
  initialData = {}
}: SmartFormProps<T>) {
  // 🎯 Estados internos del SmartForm
  const [formData, setFormData] = useState<Partial<z.infer<T>>>(initialData);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string>("");
  const [internalSuccessMessage, setInternalSuccessMessage] = useState<string>("");
  
  // 🎯 Determinar modo actual
  const isMultiMode = modes && currentMode;
  const currentModeConfig = isMultiMode ? modes[currentMode] : null;
  
  // 🎯 Resolver valores según modo
  const resolvedSchema = currentModeConfig?.schema || schema;
  const resolvedFields = currentModeConfig?.fields || fields;
  const resolvedOnSubmit = currentModeConfig?.onSubmit || onSubmit;
  const resolvedSubmitText = currentModeConfig?.submitText || submitText;
  const resolvedLoadingText = currentModeConfig?.loadingText || loadingText;
  const resolvedAutoSuccessMessage = currentModeConfig?.autoSuccessMessage || autoSuccessMessage;
  const resolvedOnSuccess = currentModeConfig?.onSuccess || onSuccess;
  
  // Loading state: externo o interno
  const isLoading = externalLoading ?? isSubmitting;

  // 🔄 Limpiar errores al cambiar modo
  const handleModeChange = () => {
    setFieldErrors({});
    setSubmitError("");
    setInternalSuccessMessage("");
    setFormData({});
  };

  // 🔥 Validación en tiempo real con Zod
  const validateField = (fieldName: string, value: string) => {
    try {
      const fieldSchema = resolvedSchema?.shape?.[fieldName];
      if (fieldSchema) {
        fieldSchema.parse(value);
        setFieldErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[fieldName];
          return newErrors;
        });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        try {
          // Verificar que error.errors existe y tiene elementos
          let errorMessage = "Error de validación";
          
          if (error && error.errors && Array.isArray(error.errors) && error.errors.length > 0) {
            const firstError = error.errors[0];
            if (firstError && firstError.message) {
              errorMessage = firstError.message;
            }
          }
          
          setFieldErrors(prev => ({ ...prev, [fieldName]: errorMessage }));
        } catch (nestedError) {
          console.error("❌ Error procesando ZodError:", nestedError, "Original error:", error);
          setFieldErrors(prev => ({ ...prev, [fieldName]: "Error de validación" }));
        }
      }
    }
  };

  // 🚀 Submit con validación completa de Zod
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setSubmitError("");

    if (!resolvedSchema || !resolvedOnSubmit) {
      setSubmitError("Configuración del formulario incompleta");
      return;
    }

    try {
      // ✅ Paso 1: Validación completa con Zod (obligatorio)
      const validatedData = resolvedSchema.parse(formData);
      
      // ✅ Paso 2: Iniciar estado de loading
      if (externalLoading === undefined) {
        setIsSubmitting(true);
      }

      // ✅ Paso 3: Llamar onSubmit con data validada
      await resolvedOnSubmit(validatedData);
      
      // ✅ Paso 4: Manejo automático de éxito
      if (resolvedAutoSuccessMessage) {
        setInternalSuccessMessage(resolvedAutoSuccessMessage);
        
        if (resolvedOnSuccess) {
          setTimeout(() => {
            setInternalSuccessMessage("");
            resolvedOnSuccess();
          }, autoSuccessDelay);
        }
      } else if (resolvedOnSuccess) {
        resolvedOnSuccess();
      }
      
    } catch (error) {
      if (error instanceof z.ZodError) {
        // 🎯 Manejo de errores de validación Zod
        const validationErrors: Record<string, string> = {};
        try {
          if (error && error.errors && Array.isArray(error.errors) && error.errors.length > 0) {
            error.errors.forEach((err) => {
              if (err && err.path && Array.isArray(err.path) && err.message) {
                const fieldPath = err.path.join(".");
                validationErrors[fieldPath] = err.message;
              }
            });
          }
        } catch (nestedError) {
          console.error("❌ Error procesando errores de validación Zod:", nestedError, "Original error:", error);
        }
        setFieldErrors(validationErrors);
      } else {
        // 🎯 Manejo de errores de submit
        console.error("❌ SmartForm submission error:", error);
        setSubmitError("Error al enviar el formulario. Inténtalo de nuevo.");
        throw error; // Re-throw para que el componente padre pueda manejarlo
      }
    } finally {
      // ✅ Paso 4: Finalizar estado de loading
      if (externalLoading === undefined) {
        setIsSubmitting(false);
      }
    }
  };

  // 🎯 Manejo de cambios en inputs con validación en tiempo real
  const handleInputChange = (name: string, value: string) => {
    // Actualizar data del formulario
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Validación en tiempo real (opcional pero útil)
    if (value.trim() !== "") {
      validateField(name, value);
    } else {
      // Limpiar error si el campo se vacía
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  return (
    <>
      {/* 🔝 Contenido superior (fuera del form) */}
      {topProps && <div className="form-top-content">{topProps}</div>}
      
      {/* 📋 Formulario principal con validación Zod */}
      <form onSubmit={handleSubmit} className={className}>
        {/* ✅ Mensajes de éxito externos */}
        <Message type="success" show={showSuccessMessage}>
          {successMessage || "Operación completada exitosamente"}
        </Message>

        {/* ✅ Mensajes de éxito internos automáticos */}
        <Message type="success" show={!!internalSuccessMessage}>
          {internalSuccessMessage}
        </Message>

        {/* ❌ Mensajes de error externos */}
        <Message type="error" show={showErrorMessage}>
          {errorMessage || "Ha ocurrido un error. Inténtalo de nuevo."}
        </Message>

        {/* ❌ Error de submit interno */}
        <Message type="error" show={!!submitError}>
          {submitError}
        </Message>

        {/* 📝 Campos del formulario con validación Zod */}
        {resolvedFields?.map((field) => (
          <Input
            key={field.name}
            id={field.name}
            label={field.label}
            name={field.name}
            type={field.type || "text"}
            required={true} // Siempre requerido, Zod maneja la validación
            value={formData[field.name as keyof z.infer<T>] as string || ""}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            error={fieldErrors[field.name]} // Solo errores de Zod
          />
        ))}

        {/* 🚀 Botón de submit con estado de loading */}
        <Button type="submit" disabled={isLoading}>
          {isLoading ? resolvedLoadingText : resolvedSubmitText}
        </Button>

        {/* 🔄 Botón de cambio de modo */}
        {isMultiMode && onModeChange && modeToggleText && (
          <p style={{ textAlign: "center", fontSize: "0.875rem", color: "var(--color-muted)", marginTop: "1rem" }}>
            {modeToggleText[currentMode]}{" "}
            <button 
              type="button" 
              onClick={() => {
                handleModeChange();
                const nextMode = Object.keys(modes).find(mode => mode !== currentMode) || currentMode;
                onModeChange(nextMode);
              }}
              style={{
                color: "var(--color-primary)",
                fontWeight: "500",
                textDecoration: "none",
                background: "none",
                border: "none",
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--color-primary-hover)";
                e.currentTarget.style.textDecoration = "underline";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--color-primary)";
                e.currentTarget.style.textDecoration = "none";
              }}
            >
              {Object.keys(modes).find(mode => mode !== currentMode)}
            </button>
          </p>
        )}
      </form>

      {/* 🔽 Contenido inferior (fuera del form) */}
      {bottomProps && <div className="form-bottom-content">{bottomProps}</div>}
    </>
  );
}

export default SmartForm;