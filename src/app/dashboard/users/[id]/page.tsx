"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Layout } from "@/components";
import { EntityForm } from "@/components/forms";
import { useEntityApi } from "@/hooks/useEntityApi";
import { usersFormConfig } from "@/config/forms";
import { usersApi } from "@/services/api/entities/users";
import { useAppSelector } from "@/hooks";
import type { UserResponseDto } from "@/types/api/entities";

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);
  const [userData, setUserData] = useState<UserResponseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<'view' | 'edit'>('view');

  const entityApi = useEntityApi(usersApi, {
    onUpdateSuccess: () => {
      setMode('view');
      loadUser(); // Reload data after update
    },
    entityName: "usuario",
  });

  const loadUser = async () => {
    try {
      setLoading(true);
      const response = await usersApi.getById(params.id as string);
      setUserData(response);
    } catch (error) {
      console.error("Error loading user:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.id) {
      loadUser();
    }
  }, [params.id]);

  const handleBack = () => {
    router.push("/dashboard?tab=users");
  };

  const handleCreateNew = () => {
    router.push("/dashboard/users/create");
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

  if (!userData) {
    return (
      <Layout user={user}>
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-center py-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Usuario no encontrado</h2>
              <p className="text-gray-600 mb-4">El usuario solicitado no existe o ha sido eliminado.</p>
              <button
                onClick={handleBack}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Volver a Usuarios
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const getRoleName = (roleId: string) => {
    switch (roleId) {
      case "bc217994-8e6c-4be4-9178-11a2cddc7b3f":
        return "Administrador";
      case "d93fcb38-2b78-4cc3-89b8-a8176c8c7e27":
        return "Usuario";
      default:
        return "Rol desconocido";
    }
  };

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
                ← Volver a Usuarios
              </button>
              <h1 className="text-3xl font-bold text-gray-900">
                {userData.username}
              </h1>
              <p className="mt-2 text-gray-600">
                {mode === 'view' ? 'Detalles del usuario' : 'Editando información del usuario'}
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleCreateNew}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium"
              >
                + Crear Nuevo Usuario
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
                    Nombre de Usuario
                  </label>
                  <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md font-mono">
                    {userData.username}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                    {userData.email}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rol
                  </label>
                  <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      userData.roleId === "bc217994-8e6c-4be4-9178-11a2cddc7b3f"
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {getRoleName(userData.roleId)}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estado
                  </label>
                  <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      userData.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {userData.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600">
                <div>
                  <label className="block font-medium mb-1">ID</label>
                  <div className="font-mono text-xs">{userData.id}</div>
                </div>
                <div>
                  <label className="block font-medium mb-1">Creado</label>
                  <div>{new Date(userData.createdAt).toLocaleString('es-ES')}</div>
                </div>
                <div>
                  <label className="block font-medium mb-1">Última Actualización</label>
                  <div>{new Date(userData.updatedAt).toLocaleString('es-ES')}</div>
                </div>
              </div>
              {userData.lastLogin && (
                <div className="text-sm text-gray-600">
                  <label className="block font-medium mb-1">Último Acceso</label>
                  <div>{new Date(userData.lastLogin).toLocaleString('es-ES')}</div>
                </div>
              )}
            </div>
          ) : (
            // Edit Mode
            <EntityForm
              mode="edit"
              config={usersFormConfig}
              initialData={{
                ...userData,
                password: '', // Don't show password in edit form
              }}
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