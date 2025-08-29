"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Layout } from "@/components";
import { EntityForm } from "@/components/forms";
import { useEntityApi } from "@/hooks/useEntityApi";
import { authorsFormConfig } from "@/config/forms";
import { authorsApi } from "@/services/api/entities/authors";
import { useAppSelector } from "@/hooks";
import type { BookAuthorResponseDto } from "@/types/api/entities";

export default function AuthorDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);
  const [authorData, setAuthorData] = useState<BookAuthorResponseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<'view' | 'edit'>('view');

  const entityApi = useEntityApi(authorsApi, {
    onUpdateSuccess: () => {
      setMode('view');
      loadAuthor(); // Reload data after update
    },
    entityName: "autor",
  });

  const loadAuthor = async () => {
    try {
      setLoading(true);
      const response = await authorsApi.getById(params.id as string);
      setAuthorData(response);
    } catch (error) {
      console.error("Error loading author:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.id) {
      loadAuthor();
    }
  }, [params.id]);

  const handleBack = () => {
    router.push("/dashboard?tab=authors");
  };

  const handleCreateNew = () => {
    router.push("/dashboard/authors/create");
  };

  if (loading) {
    return (
      <Layout user={user}>
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!authorData) {
    return (
      <Layout user={user}>
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-center py-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Autor no encontrado</h2>
              <p className="text-gray-600 mb-4">El autor solicitado no existe o ha sido eliminado.</p>
              <button
                onClick={handleBack}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Volver a Autores
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout user={user}>
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <button 
                onClick={handleBack}
                className="flex items-center text-gray-600 hover:text-gray-800 font-medium mb-2"
              >
                ← Volver a Autores
              </button>
              <h1 className="text-3xl font-bold text-gray-900">
                {authorData.firstName} {authorData.lastName}
              </h1>
              <p className="mt-2 text-gray-600">
                {mode === 'view' ? 'Detalles del autor' : 'Editando información del autor'}
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleCreateNew}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium"
              >
                + Crear Nuevo Autor
              </button>
              {mode === 'view' ? (
                <button
                  onClick={() => setMode('edit')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
                >
                  Editar
                </button>
              ) : (
                <button
                  onClick={() => setMode('view')}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 font-medium"
                >
                  Cancelar
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          {mode === 'view' ? (
            // View Mode
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre
                  </label>
                  <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                    {authorData.firstName}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Apellidos
                  </label>
                  <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                    {authorData.lastName}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nacionalidad
                  </label>
                  <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                    {authorData.nationality || 'No especificada'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de Nacimiento
                  </label>
                  <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                    {authorData.birthDate ? new Date(authorData.birthDate).toLocaleDateString('es-ES') : 'No especificada'}
                  </div>
                </div>
              </div>
              {authorData.biography && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Biografía
                  </label>
                  <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md min-h-[100px] whitespace-pre-wrap">
                    {authorData.biography}
                  </div>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600">
                <div>
                  <label className="block font-medium mb-1">ID</label>
                  <div className="font-mono text-xs">{authorData.id}</div>
                </div>
                <div>
                  <label className="block font-medium mb-1">Creado</label>
                  <div>{new Date(authorData.createdAt).toLocaleString('es-ES')}</div>
                </div>
              </div>
            </div>
          ) : (
            // Edit Mode
            <EntityForm
              mode="edit"
              config={authorsFormConfig}
              initialData={authorData}
              onUpdateSubmit={entityApi.update}
              updateLoading={entityApi.states.update.loading}
              errorMessage={entityApi.states.update.error}
              showErrorMessage={!!entityApi.states.update.error}
            />
          )}
        </div>
      </div>
    </Layout>
  );
}