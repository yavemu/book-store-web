'use client';

import { Layout, LoadingSpinner, ErrorMessage, LoginForm, UserDashboard } from "@/components";
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
    // Refresh auth state after successful login
    checkAuth();
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header - Always visible */}
        <div className="layout-page-header">
          <div className="text-center mx-auto">
            <h1 className="text-4xl font-bold text-neutral-800 mb-3">🏪 Bienvenido a Book Store</h1>
            <p className="text-lg text-muted max-w-2xl mx-auto">
              Sistema integral de gestión de libros - Descubre, organiza y administra tu inventario literario
            </p>
          </div>
        </div>

        <div className="layout-section">
          {/* Conditional Content based on Authentication */}
          {isAuthenticated && user ? (
            // Authenticated User Dashboard
            <UserDashboard user={user} onLogout={handleLogout} />
          ) : (
            // Non-authenticated User Content
            <div className="space-y-8">
              {/* Login Form */}
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
