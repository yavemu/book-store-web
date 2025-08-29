'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import AuthForm from '@/components/AuthForm';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push('/books');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        fontSize: '18px'
      }}>
        Cargando...
      </div>
    );
  }

  if (isAuthenticated) {
    return null; // Se está redirigiendo
  }

  return <AuthForm />;
}