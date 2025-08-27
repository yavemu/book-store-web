'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthForm, LoadingSpinner } from '@/components';
import { useAuthState } from '@/hooks';

export default function RegisterPage() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuthState();

  useEffect(() => {
    // If user is already authenticated, redirect to home
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  if (loading) {
    return (
      <div className="layout-flex-center bg-gray-50">
        <LoadingSpinner size="large" message="Verificando autenticación..." />
      </div>
    );
  }

  const handleAuthSuccess = () => {
    router.push('/');
  };

  // Only render auth form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="layout-flex-center bg-gray-50">
        <div className="w-full max-w-md mx-auto p-4">
          <AuthForm onSuccess={handleAuthSuccess} defaultMode="register" />
        </div>
      </div>
    );
  }

  return null; // Will redirect to home
}