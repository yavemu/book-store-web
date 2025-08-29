"use client";

import { useRouter } from "next/navigation";
import { Layout } from "@/components";
import { EntityForm } from "@/components/forms";
import { useEntityApi } from "@/hooks/useEntityApi";
import { authorsFormConfig } from "@/config/forms";
import { authorsApi } from "@/services/api/entities/authors";
import { useAppSelector } from "@/hooks";

export default function CreateAuthorPage() {
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);

  const entityApi = useEntityApi(authorsApi, {
    onCreateSuccess: () => {
      // Redirigir de vuelta al dashboard de autores
      router.push("/dashboard?tab=authors");
    },
    entityName: "autor",
  });

  const handleCancel = () => {
    router.push("/dashboard?tab=authors");
  };

  return (
    <Layout user={user}>
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Crear Nuevo Autor</h1>
              <p className="mt-2 text-gray-600">Completa la información para crear un nuevo autor en el sistema</p>
            </div>
            <button onClick={handleCancel} className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium">
              ← Volver a Autores
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <EntityForm
            mode="create"
            config={authorsFormConfig}
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
