"use client";

import { useState } from "react";
import { Form, Input, Button } from "../forms";

type RegisterFormData = {
  name: string;
  email: string;
  password: string;
};

type RegisterFormProps = {
  onSuccess?: (data: RegisterFormData) => void;
  showTitle?: boolean;
  compact?: boolean;
};

export default function RegisterForm({ onSuccess, showTitle = false, compact = false }: RegisterFormProps) {
  const [loading, setLoading] = useState(false);

  const handleRegister = async (data: RegisterFormData) => {
    setLoading(true);
    try {
      await new Promise((res) => setTimeout(res, 900));
      console.log("✅ Registro OK", data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`border rounded-lg shadow-md ${compact ? "p-3 space-y-3" : "p-6 space-y-6"}`}>
      <Form<RegisterFormData> onSubmit={handleRegister} onSuccess={onSuccess} title={showTitle ? "Registro" : undefined} className="space-y-4">
        <Input label="Nombre" id="name" name="name" type="text" required />

        <Input label="Correo electrónico" id="email" name="email" type="email" required />

        <Input label="Contraseña" id="password" name="password" type="password" required />

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Registrando..." : "Registrarse"}
        </Button>
      </Form>
      <p className="text-center text-sm text-muted">Ya tienes una cuenta? </p>
    </div>
  );
}
