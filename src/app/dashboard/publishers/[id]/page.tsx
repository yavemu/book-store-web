"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Layout } from "@/components";
import { EntityForm } from "@/components/forms";
import { useEntityApi } from "@/hooks/useEntityApi";
import { publishersFormConfig } from "@/config/forms";
import { publishingHousesApi } from "@/services/api/entities/publishing-houses";
import { useAppSelector } from "@/hooks";
import type { PublishingHouseResponseDto } from "@/types/api/entities/publishing-houses";

export default function PublisherDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);
  const [publisherData, setPublisherData] = useState<PublishingHouseResponseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<'view' | 'edit'>('view');

  const entityApi = useEntityApi(publishingHousesApi, {
    onUpdateSuccess: () => {
      setMode('view');
      loadPublisher(); // Reload data after update
    },
    entityName: "editorial",
  });

  const loadPublisher = async () => {
    try {
      setLoading(true);
      const response = await publishingHousesApi.getById(params.id as string);
      setPublisherData(response);
    } catch (error) {
      console.error("Error loading publisher:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.id) {
      loadPublisher();
    }
  }, [params.id]);

  const handleBack = () => {
    router.push("/dashboard?tab=publishers");
  };

  const handleCreateNew = () => {
    router.push("/dashboard/publishers/create");
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

  if (!publisherData) {
    return (
      <Layout user={user}>
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-center py-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Editorial no encontrada</h2>
              <p className="text-gray-600 mb-4">La editorial solicitada no existe o ha sido eliminada.</p>
              <button
                onClick={handleBack}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Volver a Editoriales
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
                ← Volver a Editoriales
              </button>
              <h1 className="text-3xl font-bold text-gray-900">
                {publisherData.name}
              </h1>
              <p className="mt-2 text-gray-600">
                {mode === 'view' ? 'Detalles de la editorial' : 'Editando información de la editorial'}
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleCreateNew}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium"
              >
                + Crear Nueva Editorial
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
                    Nombre de la Editorial
                  </label>
                  <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                    {publisherData.name}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    País
                  </label>
                  <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                    {publisherData.country || 'No especificado'}
                  </div>
                </div>
              </div>
              {publisherData.websiteUrl && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sitio Web
                  </label>
                  <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                    <a 
                      href={publisherData.websiteUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      {publisherData.websiteUrl}
                    </a>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600">
                <div>
                  <label className="block font-medium mb-1">ID</label>
                  <div className="font-mono text-xs">{publisherData.id}</div>
                </div>
                <div>
                  <label className="block font-medium mb-1">Creado</label>
                  <div>{new Date(publisherData.createdAt).toLocaleString('es-ES')}</div>
                </div>
              </div>
            </div>
          ) : (
            // Edit Mode
            <EntityForm
              mode="edit"
              config={publishersFormConfig}
              initialData={publisherData}
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