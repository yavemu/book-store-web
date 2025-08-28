'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Layout, LoadingSpinner, ErrorMessage, AuthForm } from "@/components";
import { useHealthCheck, useAppSelector } from "@/hooks";

export default function Home() {
  const router = useRouter();
  const { loading, error, refetch } = useHealthCheck();
  const { isAuthenticated, user, loading: authLoading } = useAppSelector((state) => state.auth);

  // Redirect to dashboard if authenticated (based on auth state, not just token)
  useEffect(() => {
    if (!authLoading && isAuthenticated && user) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, user, authLoading, router]);

  if (loading || authLoading) {
    return (
      <Layout>
        <div className="layout-flex-center py-12">
          <LoadingSpinner
            size="large"
            message={loading ? "Verificando conexión con el servidor..." : "Verificando autenticación..."}
          />
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
    // Redux automatically updates auth state after successful login
    // Just redirect to dashboard
    router.push("/dashboard");
  };


  // Si el usuario está autenticado, redirigir a /dashboard
  if (isAuthenticated && user) {
    return null; // La redirección se maneja en useEffect
  }

  return (
    <Layout>
      <div className="space-y-8">
        <div className="layout-section">
          <div className="layout-page-header">
            <div className="text-center mx-auto">
              <h1 className="text-4xl font-bold text-neutral-800 mb-3">🏪 Bienvenido a Book Store</h1>
              <p className="text-lg text-muted max-w-2xl mx-auto">
                Sistema integral de gestión de libros - Descubre, organiza y administra tu inventario literario
              </p>
            </div>
          </div>
          <div className="space-y-8">
            <div className="max-w-md mx-auto">
              <AuthForm onSuccess={handleLoginSuccess} defaultMode="login" />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
