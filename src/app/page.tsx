'use client';

import { Layout, LoadingSpinner, ErrorMessage, UserDashboard } from "@/components";
import LoginForm from "@/components/forms/LoginForm";
import { useHealthCheck, useAuthState } from "@/hooks";

export default function Home() {
  const { data, loading, error, refetch } = useHealthCheck();
  const { isAuthenticated, user, loading: authLoading, checkAuth, logout } = useAuthState();

  if (loading || authLoading) {
    return (
      <Layout>
        <div className="layout-flex-center py-12">
          <LoadingSpinner size="large" message={loading ? "Verificando conexión con el servidor..." : "Verificando autenticación..."} />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="layout-section">
          <ErrorMessage error={error} onRetry={refetch} className="max-w-2xl mx-auto" />
        </div>
      </Layout>
    );
  }

  const handleLoginSuccess = () => {
    checkAuth();
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div className="layout-page-header">
          <div className="text-center mx-auto">
            <h1 className="text-4xl font-bold text-neutral-800 mb-3">🏪 Bienvenido a Book Store</h1>
            <p className="text-lg text-muted max-w-2xl mx-auto">
              Sistema integral de gestión de libros - Descubre, organiza y administra tu inventario literario
            </p>
          </div>
        </div>

        <div className="layout-section">
          {isAuthenticated && user ? (
            <UserDashboard user={user} onLogout={handleLogout} />
          ) : (
            <div className="space-y-8">
              <div className="max-w-md mx-auto">
                <LoginForm onSuccess={handleLoginSuccess} showTitle={true} compact={false} />
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
