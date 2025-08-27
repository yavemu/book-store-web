"use client";

import { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import { useAuth } from "@/hooks";
import { ErrorMessage } from "@/components/ui";

interface AuthFormProps {
  onSuccess?: () => void;
  defaultMode?: "login" | "register";
}

export default function AuthForm({ onSuccess, defaultMode = "login" }: AuthFormProps) {
  const [mode, setMode] = useState<"login" | "register">(defaultMode);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const { error, clearError } = useAuth();

  const handleToggleMode = () => {
    setMode(mode === "login" ? "register" : "login");
    clearError();
    setShowSuccessMessage(false);
  };

  const handleLoginSuccess = () => {
    setShowSuccessMessage(false);
    if (onSuccess) {
      onSuccess();
    }
  };

  const handleRegisterSuccess = () => {
    setSuccessMessage("Usuario registrado exitosamente");
    setShowSuccessMessage(true);

    // Auto switch to login mode after successful registration
    setTimeout(() => {
      setMode("login");
      setShowSuccessMessage(false);
    }, 2000);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Form content */}
        <div className="p-6">
          {/* Success message */}
          {showSuccessMessage && <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">{successMessage}</div>}

          {/* Error message */}
          {error && (
            <div className="mb-4">
              <ErrorMessage error={error} />
            </div>
          )}

          {/* Form based on current mode */}
          {mode === "login" ? (
            <>
              <LoginForm onSuccess={handleLoginSuccess} showTitle={false} compact={true} />
              <p className="text-center text-sm text-gray-600 mt-4">
                ¿No tienes una cuenta?{" "}
                <button onClick={handleToggleMode} className="text-primary hover:underline font-medium">
                  Regístrate aquí
                </button>
              </p>
            </>
          ) : (
            <>
              <RegisterForm onSuccess={handleRegisterSuccess} showTitle={false} compact={true} />
              <p className="text-center text-sm text-gray-600 mt-4">
                ¿Ya tienes una cuenta?{" "}
                <button onClick={handleToggleMode} className="text-primary hover:underline font-medium">
                  Inicia sesión aquí
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
