"use client";

import { Form, Input, Button } from "../forms";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { loginAsync, clearError } from "@/store/slices/authSlice";
import { LoginDto } from "@/types/auth";

export type LoginFormData = LoginDto;

interface LoginFormProps {
  onSuccess?: () => void;
  showTitle?: boolean;
  compact?: boolean;
}

export default function LoginForm({ onSuccess, showTitle = true, compact = false }: LoginFormProps) {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector(state => state.auth);

  const handleLogin = async (data: LoginFormData) => {
    console.log('🚀 LoginForm: Iniciando login con datos:', data);
    
    // Clear any previous errors
    dispatch(clearError());
    
    try {
      const result = await dispatch(loginAsync(data)).unwrap();
      console.log('✅ LoginForm: Login exitoso, resultado:', result);

      if (onSuccess) {
        console.log('📋 LoginForm: Llamando onSuccess callback');
        onSuccess();
      }
    } catch (error) {
      // Error is handled by Redux slice
      console.error("❌ LoginForm: Error en login:", error);
    }
  };

  return (
    <div className={`border rounded-lg shadow-md ${compact ? "p-3 space-y-3" : "p-6 space-y-6"}`}>
      {showTitle && <h2 className="text-xl font-bold text-center">Iniciar sesión</h2>}

      {error && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
          {error}
        </div>
      )}

      <Form<LoginFormData> onSubmit={handleLogin} className="space-y-4">
        <Input label="Correo electrónico" id="email" name="email" type="email" required />

        <Input label="Contraseña" id="password" name="password" type="password" required />

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Ingresando..." : "Iniciar sesión"}
        </Button>
      </Form>
    </div>
  );
}
