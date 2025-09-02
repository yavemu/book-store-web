"use client";

import PageWrapper from "@/components/PageWrapper";
import Loading from "./Loading";

interface PageLoadingProps {
  title: string;
  breadcrumbs?: string[];
  message?: string;
}

export default function PageLoading({ 
  title, 
  breadcrumbs, 
  message = "Cargando datos..." 
}: PageLoadingProps) {
  return (
    <PageWrapper title={title} breadcrumbs={breadcrumbs}>
      <div className="min-h-96 flex items-center justify-center">
        <Loading 
          message={message}
          size="lg"
          variant="spinner"
        />
      </div>
    </PageWrapper>
  );
}