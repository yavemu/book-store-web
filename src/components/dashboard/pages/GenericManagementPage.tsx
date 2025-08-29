"use client";

import React, { useCallback, ReactNode, useState } from "react";
import { useRouter } from "next/navigation";
import { Column } from "@/components/ui";
import { PaginationMeta } from "@/types/api";
import { useManagementPage } from "@/hooks/useManagementPage";
import { useIsClient } from "@/hooks/useIsClient";
import { ManagementPageLayout } from "../common";
import { CreateModalOptimized } from "../modals";
import { ClientOnly } from "@/components";
import HydrationGuard from "@/components/common/HydrationGuard";

interface ManagementPageParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
}

interface ApiService<T, TParams, TFilters> {
  list: (params?: TParams) => Promise<{ data: T[]; meta: PaginationMeta }>;
  filter?: (filters: TFilters, page?: number, limit?: number) => Promise<{ data: T[]; meta: PaginationMeta }>;
}

export interface RolePermissions {
  canCreate?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
  canView?: boolean;
  roles?: string[];
}

export interface ManagementPageConfig<T, TParams extends ManagementPageParams, TFilters> {
  title: string;
  createButtonText: string;
  createUrl?: string;
  editUrl?: string;
  entityType?: "authors" | "genres" | "publishers" | "books" | "users";
  emptyMessage: string;
  errorMessage: string;
  initialParams: TParams;
  apiService: ApiService<T, TParams, TFilters>;
  columns: Column<T>[];
  filters?: ReactNode;
  modals?: {
    create?: ReactNode;
    edit?: ReactNode;
    delete?: ReactNode;
    view?: ReactNode;
  };
  hideCreateButton?: boolean;
  hideActions?: boolean;
  permissions?: RolePermissions;
}

interface GenericManagementPageProps<T, TParams extends ManagementPageParams, TFilters> {
  config: ManagementPageConfig<T, TParams, TFilters>;
  userRole: string;
  onCreateModal?: () => void;
  onEditModal?: (item: T) => void;
  onDeleteModal?: (item: T) => void;
  onViewModal?: (item: T) => void;
}

function GenericManagementPage<T, TParams extends ManagementPageParams, TFilters>({
  config,
  userRole,
}: GenericManagementPageProps<T, TParams, TFilters>) {
  const router = useRouter();
  const isClient = useIsClient();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  // Always call hook for consistency (avoiding conditional hooks)
  const managementData = useManagementPage<T, TParams, TFilters>({
    initialParams: config?.initialParams || { page: 1, limit: 10 } as TParams,
    apiService: config?.apiService || {
      list: () => Promise.resolve({ data: [], meta: { total: 0, page: 1, limit: 10, pages: 0 } })
    },
    errorMessage: config?.errorMessage || "Error al cargar los datos",
  });

  // Error checks
  if (!config) {
    return (
      <div className="p-6">
        <div className="text-red-600 bg-red-50 p-4 rounded-lg">
          Error: Configuración no encontrada
        </div>
      </div>
    );
  }

  const {
    data,
    meta,
    loading,
    error,
    fetchData,
    handlePageChange,
    handleSort,
  } = managementData;

  // Create handler - redirige a página o abre modal
  const handleCreate = () => {
    if (config.createUrl) {
      // Si hay createUrl, redirigir a la página dedicada
      router.push(config.createUrl);
    } else {
      // Si no hay createUrl, usar modal (comportamiento anterior)
      setIsCreateModalOpen(true);
    }
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleCreateSuccess = () => {
    fetchData(); // Refresh data after successful creation
  };

  // Render action buttons for each row
  const renderActions = useCallback((item: T) => {
    const itemId = (item as any).id;
    const entityPaths = {
      authors: "/dashboard/authors",
      books: "/dashboard/books", 
      genres: "/dashboard/genres",
      publishers: "/dashboard/publishers",
      users: "/dashboard/users"
    };
    
    const basePath = entityPaths[config.entityType as keyof typeof entityPaths];
    if (!basePath || !itemId) return null;

    return (
      <div className="flex space-x-2 justify-center">
        <button
          onClick={() => router.push(`${basePath}/${itemId}`)}
          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
          title="Ver detalles"
        >
          <svg 
            className="w-5 h-5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
            />
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" 
            />
          </svg>
        </button>
      </div>
    );
  }, [config.entityType, router]);

  return (
    <HydrationGuard fallback={
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    }>
      <ClientOnly fallback={
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      }>
        <ManagementPageLayout
          title={config.title}
          data={data as Record<string, unknown>[]}
          columns={config.columns as Column<Record<string, unknown>>[]}
          meta={meta}
          loading={loading}
          error={error}
          emptyMessage={config.emptyMessage}
          createButtonText={config.createButtonText}
          onCreate={handleCreate}
          onRefresh={() => fetchData()}
          onPageChange={handlePageChange}
          onSort={handleSort}
          hideCreateButton={config.hideCreateButton || false}
          hideActions={config.hideActions || false}
          renderActions={renderActions}
        />

        {/* Create Modal - solo mostrar si no hay createUrl */}
        {config.entityType && !config.createUrl && (
          <CreateModalOptimized
            isOpen={isCreateModalOpen}
            onClose={handleCloseCreateModal}
            onSuccess={handleCreateSuccess}
            entityType={config.entityType}
          />
        )}
      </ClientOnly>
    </HydrationGuard>
  );
}

export default GenericManagementPage;
export { GenericManagementPage };