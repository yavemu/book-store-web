"use client";

import { Form, Input, Button } from "../forms";
import { useAuth } from "@/hooks";
import { LoginDto } from "@/types/auth";

export type LoginFormData = LoginDto;

interface LoginFormProps {
  onSuccess?: () => void;
  showTitle?: boolean;
  compact?: boolean;
}

export default function LoginForm({ onSuccess, showTitle = true, compact = false }: LoginFormProps) {
  const { login, loading } = useAuth();

  const handleLogin = async (data: LoginFormData) => {
    try {
      await login(data);

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      // Error is handled by useAuth hook
      console.error("Error en login:", error);
    }
  };

  return (
    <div className={`border rounded-lg shadow-md ${compact ? "p-3 space-y-3" : "p-6 space-y-6"}`}>
      {showTitle && <h2 className="text-xl font-bold text-center">Iniciar sesión</h2>}

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
