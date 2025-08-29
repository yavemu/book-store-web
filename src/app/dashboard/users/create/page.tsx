"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Layout } from "@/components";
import { DynamicUserForm } from "@/components/forms";
import { useEntityApi } from "@/hooks/useEntityApi";
import { usersApi } from "@/services/api/entities/users";
import { useAppSelector } from "@/hooks";

export default function CreateUserPage() {
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);
  const [successMessage, setSuccessMessage] = useState<string>('');

  const entityApi = useEntityApi(usersApi, {
    onCreateSuccess: () => {
      setSuccessMessage('¡Usuario creado exitosamente!');
      
      // Esperar un momento antes de redirigir para mostrar el mensaje
      setTimeout(() => {
        router.push("/dashboard?tab=users");
      }, 2000);
    },
    entityName: "usuario"
  });

  const handleCancel = () => {
    router.push("/dashboard?tab=users");
  };

  return (
    <Layout user={user}>
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Crear Nuevo Usuario</h1>
              <p className="mt-2 text-gray-600">
                Completa la información para crear un nuevo usuario en el sistema
              </p>
            </div>
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
            >
              ← Volver a Usuarios
            </button>
          </div>
        </div>

        {/* Mensaje de éxito */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">
                  {successMessage}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <DynamicUserForm
            mode="create"
            onCreateSubmit={entityApi.create}
            createLoading={entityApi.states.create.loading}
            errorMessage={entityApi.states.create.error}
            showErrorMessage={!!entityApi.states.create.error}
          />
          
          {/* Cancel Button */}
          <div className="mt-4 flex justify-start">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}