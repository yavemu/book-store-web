'use client';

import { Layout, LoadingSpinner, ErrorMessage } from '@/components';
import { HealthStatus } from '@/components/domain';
import { useHealthCheck } from '@/hooks';

export default function Home() {
  const { data, loading, error, refetch } = useHealthCheck();

  if (loading) {
    return (
      <Layout>
        <div className="layout-flex-center py-12">
          <LoadingSpinner 
            size="large" 
            message="Verificando conexión con el servidor..."
          />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="layout-section">
          <ErrorMessage 
            error={error} 
            onRetry={refetch}
            className="max-w-2xl mx-auto"
          />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        <div className="layout-page-header">
          <div className="text-center mx-auto">
            <h1 className="text-4xl font-bold text-neutral-800 mb-3">
              🏪 Bienvenido a Book Store
            </h1>
            <p className="text-lg text-muted max-w-2xl mx-auto">
              Sistema integral de gestión de libros - Descubre, organiza y administra tu inventario literario
            </p>
          </div>
        </div>
        
        <div className="layout-section">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="card-base text-center p-6">
              <div className="text-3xl mb-3">📚</div>
              <h3 className="section-title">Gestión de Inventario</h3>
              <p className="text-sm text-muted">Administra tu catálogo completo</p>
            </div>
            
            <div className="card-base text-center p-6">
              <div className="text-3xl mb-3">🔍</div>
              <h3 className="section-title">Búsqueda Avanzada</h3>
              <p className="text-sm text-muted">Encuentra libros fácilmente</p>
            </div>
            
            <div className="card-base text-center p-6">
              <div className="text-3xl mb-3">📊</div>
              <h3 className="section-title">Reportes</h3>
              <p className="text-sm text-muted">Analiza tu negocio</p>
            </div>
          </div>
          
          {data && (
            <div className="max-w-3xl mx-auto">
              <HealthStatus data={data} />
            </div>
          )}
          
          <div className="text-center mt-8">
            <button
              onClick={refetch}
              className="btn-primary"
            >
              🔄 Actualizar Estado del Servidor
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
