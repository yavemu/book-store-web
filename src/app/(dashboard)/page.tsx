"use client";

import PageWrapper from "@/components/PageWrapper";
import { useAppSelector } from "@/store/hooks";

export default function DashboardHomePage() {
  const { user } = useAppSelector((state) => state.auth);
  
  const userRole = typeof user?.role === 'string' 
    ? user.role 
    : (typeof user?.role === 'object' && user?.role?.name) 
    ? user.role.name 
    : 'USER';

  return (
    <PageWrapper title="Dashboard" breadcrumbs={["Dashboard"]}>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            ¡Bienvenido, {user?.username || 'Usuario'}!
          </h1>
          <p className="text-gray-600">
            Sistema de gestión de librería - Rol: <span className="font-semibold">{userRole}</span>
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-bold">📚</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-blue-600">Libros</p>
                <p className="text-2xl font-bold text-blue-900">Gestión</p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-bold">👥</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-green-600">Autores</p>
                <p className="text-2xl font-bold text-green-900">Catálogo</p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-bold">🏢</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-yellow-600">Editoriales</p>
                <p className="text-2xl font-bold text-yellow-900">Registro</p>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-bold">📦</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-purple-600">Inventario</p>
                <p className="text-2xl font-bold text-purple-900">Control</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Acceso Rápido</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <a 
              href="/books" 
              className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
            >
              <div className="text-center">
                <div className="text-2xl mb-2">📚</div>
                <h3 className="font-medium text-gray-900">Libros</h3>
                <p className="text-sm text-gray-500">Gestionar catálogo</p>
              </div>
            </a>
            
            <a 
              href="/authors" 
              className="block p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors"
            >
              <div className="text-center">
                <div className="text-2xl mb-2">✍️</div>
                <h3 className="font-medium text-gray-900">Autores</h3>
                <p className="text-sm text-gray-500">Gestionar autores</p>
              </div>
            </a>
            
            <a 
              href="/publishers" 
              className="block p-4 border border-gray-200 rounded-lg hover:border-yellow-300 hover:bg-yellow-50 transition-colors"
            >
              <div className="text-center">
                <div className="text-2xl mb-2">🏢</div>
                <h3 className="font-medium text-gray-900">Editoriales</h3>
                <p className="text-sm text-gray-500">Gestionar editoriales</p>
              </div>
            </a>
            
            <a 
              href="/inventory-movements" 
              className="block p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors"
            >
              <div className="text-center">
                <div className="text-2xl mb-2">📦</div>
                <h3 className="font-medium text-gray-900">Inventario</h3>
                <p className="text-sm text-gray-500">Movimientos</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}