"use client";

import { useState } from "react";
import { SmartForm, Message } from ".";
import { loginSchema, registerSchema, LoginFormData, RegisterFormData } from "@/services/validation/schemas/auth";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { useAuth } from "@/hooks";
import { loginAsync, clearError } from "@/store/slices/authSlice";

interface AuthFormProps {
  onSuccess?: () => void;
  defaultMode?: "login" | "register";
}

// Tipo genérico para campos tipados con Zod
type TypedFormField<T> = {
  name: keyof T;
  label: string;
  type: "text" | "email" | "password" | "number" | "textarea";
  placeholder?: string;
};

// Fields tipados con Zod schemas
const loginFields: TypedFormField<LoginFormData>[] = [
  { name: "email", label: "Correo electrónico", type: "email" },
  { name: "password", label: "Contraseña", type: "password" }
];

const registerFields: TypedFormField<RegisterFormData>[] = [
  { name: "username", label: "Nombre de usuario", type: "text" },
  { name: "email", label: "Correo electrónico", type: "email" },
  { name: "password", label: "Contraseña", type: "password" }
];

export default function AuthForm({ onSuccess, defaultMode = "login" }: AuthFormProps) {
  const [currentMode, setCurrentMode] = useState(defaultMode);
  
  const dispatch = useAppDispatch();
  const { loading: loginLoading, error: loginError } = useAppSelector(state => state.auth);
  const { register, loading: registerLoading } = useAuth();

  const handleModeChange = (newMode: string) => {
    setCurrentMode(newMode as "login" | "register");
    dispatch(clearError());
  };

  const handleLogin = async (validatedData: LoginFormData) => {
    dispatch(clearError());
    await dispatch(loginAsync(validatedData)).unwrap();
    
    if (onSuccess) onSuccess();
  };

  const handleRegister = async (validatedData: RegisterFormData) => {
    await register(validatedData);
  };

  const handleRegisterSuccess = () => {
    setCurrentMode("login");
  };

  const authModes = {
    login: {
      schema: loginSchema,
      fields: loginFields,
      onSubmit: handleLogin,
      submitText: "Iniciar sesión",
      loadingText: "Ingresando..."
    },
    register: {
      schema: registerSchema,
      fields: registerFields,
      onSubmit: handleRegister,
      submitText: "Registrarse",
      loadingText: "Registrando...",
      autoSuccessMessage: "Usuario registrado exitosamente. Redirigiendo al login...",
      onSuccess: handleRegisterSuccess
    }
  };

  const modeToggleText = {
    login: "¿No tienes una cuenta?",
    register: "¿Ya tienes una cuenta?"
  };

  const topContent = (
    <>
      <Message type="error" show={currentMode === "login" && !!loginError}>
        {loginError}
      </Message>
      <h2>{currentMode === "login" ? "Iniciar sesión" : "Registro"}</h2>
    </>
  );

  return (
    <div className="vertical-form">
      <div className="auth-container">
        <div className="auth-content">
          <SmartForm
            modes={authModes}
            currentMode={currentMode}
            onModeChange={handleModeChange}
            modeToggleText={modeToggleText}
            loading={currentMode === "login" ? loginLoading : registerLoading}
            topProps={topContent}
          />
        </div>
      </div>
    </div>
  );
}
