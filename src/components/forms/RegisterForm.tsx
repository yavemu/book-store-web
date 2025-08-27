"use client";

import { Form, Input, Button } from "../forms";
import { useAuth } from "@/hooks";
import { RegisterUserDto } from "@/types/auth";

export type RegisterFormData = RegisterUserDto;

type RegisterFormProps = {
  onSuccess?: () => void;
  showTitle?: boolean;
  compact?: boolean;
};

export default function RegisterForm({ onSuccess, showTitle = false, compact = false }: RegisterFormProps) {
  const { register, loading } = useAuth();

  const handleRegister = async (data: RegisterFormData) => {
    try {
      await register(data);

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      // Error is handled by useAuth hook
      console.error("Error en registro:", error);
    }
  };

  return (
    <div className={`border rounded-lg shadow-md ${compact ? "p-3 space-y-3" : "p-6 space-y-6"}`}>
      <Form<RegisterFormData> onSubmit={handleRegister} onSuccess={onSuccess} title={showTitle ? "Registro" : undefined} className="space-y-4">
        <Input label="Nombre de usuario" id="username" name="username" type="text" required />

        <Input label="Correo electrónico" id="email" name="email" type="email" required />

        <Input label="Contraseña" id="password" name="password" type="password" required />

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Registrando..." : "Registrarse"}
        </Button>
      </Form>
    </div>
  );
}
