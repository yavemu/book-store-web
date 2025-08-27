"use client";

import { useState } from "react";
import { Form, Input, Button } from "../forms";

export interface LoginFormData {
  email: string;
  password: string;
}

interface LoginFormProps {
  onSuccess?: () => void;
  showTitle?: boolean;
  compact?: boolean;
}

export default function LoginForm({ onSuccess, showTitle = true, compact = false }: LoginFormProps) {
  const [loading, setLoading] = useState(false);

  const handleLogin = async (data: LoginFormData) => {
    setLoading(true);
    try {
      // 👉 lógica original (simulación de petición)
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Usuario logueado:", data);

      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error en login:", error);
    } finally {
      setLoading(false);
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
      <p className="text-center text-sm text-muted">No tienes una cuenta? </p>
    </div>
  );
}
