"use client";

import React, { ReactNode } from "react";
import { Column } from "@/components/ui";
import { PaginationMeta } from "@/types/api";
import { useManagementPage } from "@/hooks/useManagementPage";
import { useCreateModal } from "@/hooks/useCreateModal";
import { useDeleteModal } from "@/hooks/useDeleteModal";
import { ManagementPageLayout } from "../common";
import { CreateModalOptimized, DeleteModal } from "../modals";
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

interface GenericManagementPageOptimizedProps<T, TParams extends ManagementPageParams, TFilters> {
  config: ManagementPageConfig<T, TParams, TFilters>;
  userRole: string;
}

function GenericManagementPageOptimized<T, TParams extends ManagementPageParams, TFilters>({
  config,
  userRole,
}: GenericManagementPageOptimizedProps<T, TParams, TFilters>) {
  
  // Always call hook for consistency (avoiding conditional hooks)
  const managementData = useManagementPage<T, TParams, TFilters>({
    initialParams: config?.initialParams || { page: 1, limit: 10 } as TParams,
    apiService: config?.apiService || {
      list: () => Promise.resolve({ data: [], meta: { total: 0, page: 1, limit: 10, pages: 0 } })
    },
    errorMessage: config?.errorMessage || "Error al cargar los datos",
  });

  // Uso del hook optimizado para modal
  const createModal = useCreateModal({
    onSuccess: () => {
      managementData.fetchData();
    }
  });

  const deleteModal = useDeleteModal({
    onSuccess: () => {
      managementData.fetchData();
    }
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
          onCreate={createModal.open}
          onRefresh={() => fetchData()}
          onPageChange={handlePageChange}
          onSort={handleSort}
          hideCreateButton={config.hideCreateButton || false}
          hideActions={config.hideActions || true}
        />

        {/* Create Modal Optimizado */}
        {config.entityType && (
          <CreateModalOptimized
            isOpen={createModal.isOpen}
            onClose={createModal.close}
            onSuccess={createModal.handleSuccess}
            entityType={config.entityType}
          />
        )}

        {/* Delete Modal */}
        {config.entityType && deleteModal.entityId && (
          <DeleteModal
            isOpen={deleteModal.isOpen}
            onClose={deleteModal.close}
            onSuccess={deleteModal.handleSuccess}
            entityType={config.entityType}
            entityId={deleteModal.entityId}
            entityName={deleteModal.entityName}
          />
        )}
      </ClientOnly>
    </HydrationGuard>
  );
}

export default GenericManagementPageOptimized;
export { GenericManagementPageOptimized };