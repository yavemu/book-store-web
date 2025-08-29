"use client";

import React, { useCallback, ReactNode, useState } from "react";
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

  // Modal handlers
  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleCreateSuccess = () => {
    fetchData(); // Refresh data after successful creation
  };

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
          onCreate={handleOpenCreateModal}
          onRefresh={() => fetchData()}
          onPageChange={handlePageChange}
          onSort={handleSort}
          hideCreateButton={config.hideCreateButton || false}
          hideActions={config.hideActions || true}
        />

        {/* Create Modal */}
        {config.entityType && (
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