'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthForm, LoadingSpinner } from '@/components';
import { useAuthState } from '@/hooks';

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuthState();

  useEffect(() => {
    // If user is already authenticated, redirect to home
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const handleLoginSuccess = () => {
    // Redirect to home after successful login
    router.push('/');
  };

  if (loading) {
    return (
      <div className="layout-flex-center bg-gray-50">
        <LoadingSpinner size="large" message="Verificando autenticación..." />
      </div>
    );
  }

  // Only render auth form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="layout-flex-center bg-gray-50">
        <div className="w-full max-w-md mx-auto p-4">
          <AuthForm onSuccess={handleLoginSuccess} defaultMode="login" />
        </div>
      </div>
    );
  }

  return null; // Will redirect to home
}