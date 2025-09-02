"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PageLoading from '@/components/ui/PageLoading';

export default function DashboardHomePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirigir automáticamente a Authors como página por defecto
    router.replace('/authors');
  }, [router]);

  return (
    <PageLoading 
      title="Cargando..." 
      breadcrumbs={[]}
      message="Redirigiendo a Autores..."
    />
  );
}