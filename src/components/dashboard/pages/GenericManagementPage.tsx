"use client";

import React, { useCallback, ReactNode } from "react";
import { Column } from "@/components/ui";
import { PaginationMeta } from "@/types/api";
import { useManagementPage } from "@/hooks/useManagementPage";
import { useIsClient } from "@/hooks/useIsClient";
import { ManagementPageLayout, ManagementActions } from "../common";
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
  onCreateModal,
  onEditModal,
  onDeleteModal,
  onViewModal,
}: GenericManagementPageProps<T, TParams, TFilters>) {
  const isClient = useIsClient();
  
  // Mover todos los hooks al inicio antes de cualquier return
  // Siempre llamar el hook para evitar errores de hooks condicionales
  const managementData = useManagementPage<T, TParams, TFilters>({
    initialParams: config?.initialParams || { page: 1, limit: 10 } as TParams,
    apiService: config?.apiService || {
      list: () => Promise.resolve({ data: [], meta: { total: 0, page: 1, limit: 10, pages: 0 } })
    },
    errorMessage: config?.errorMessage || "Error al cargar los datos",
  });

  const handleViewWithCallback = useCallback((item: T) => {
    managementData.handleView(item);
    onViewModal?.(item);
  }, [managementData, onViewModal]);

  const handleEditWithCallback = useCallback((item: T) => {
    managementData.handleEdit(item);
    onEditModal?.(item);
  }, [managementData, onEditModal]);

  const handleDeleteWithCallback = useCallback((item: T) => {
    managementData.handleDelete(item);
    onDeleteModal?.(item);
  }, [managementData, onDeleteModal]);

  const handleCreateWithCallback = useCallback(() => {
    managementData.setShowCreateModal(true);
    onCreateModal?.();
  }, [managementData, onCreateModal]);

  // Ahora añadir las funciones de permisos después de los hooks
  const hasPermission = (permission: keyof RolePermissions): boolean => {
    if (!config?.permissions) return true;
    
    if (config.permissions.roles && !config.permissions.roles.includes(userRole)) {
      return false;
    }
    
    const basePermission = config.permissions[permission];
    
    if (userRole === "admin") {
      return basePermission !== false;
    }
    
    if (userRole === "user") {
      return permission === "canView" && basePermission !== false;
    }
    
    return basePermission !== false;
  };

  const canCreate = hasPermission('canCreate');
  const canEdit = hasPermission('canEdit');
  const canDelete = hasPermission('canDelete');
  const canView = hasPermission('canView');

  const renderActions = useCallback(
    (item: T) => {
      if (config?.hideActions || (!canView && !canEdit && !canDelete)) return null;
      
      return (
        <ManagementActions
          item={item}
          onView={canView ? handleViewWithCallback : undefined}
          onEdit={canEdit ? handleEditWithCallback : undefined}
          onDelete={canDelete ? handleDeleteWithCallback : undefined}
        />
      );
    },
    [handleViewWithCallback, handleEditWithCallback, handleDeleteWithCallback, config?.hideActions, canView, canEdit, canDelete],
  );

  // Verificaciones de errores
  if (!config) {
    return (
      <div className="p-6">
        <div className="text-red-600 bg-red-50 p-4 rounded-lg">
          Error: Configuración no encontrada
        </div>
      </div>
    );
  }

  if (!config.initialParams) {
    return (
      <div className="p-6">
        <div className="text-red-600 bg-red-50 p-4 rounded-lg">
          Error: Parámetros iniciales no definidos en la configuración
        </div>
      </div>
    );
  }

  if (!config.apiService) {
    return (
      <div className="p-6">
        <div className="text-red-600 bg-red-50 p-4 rounded-lg">
          Error: Servicio API no definido en la configuración
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
    handleFilter,
    handleClearFilters,
  } = managementData;

  const filtersWithProps = isClient && config.filters && React.isValidElement(config.filters)
    ? React.cloneElement(config.filters as React.ReactElement<Record<string, unknown>>, {
        onFilter: handleFilter,
        onClear: handleClearFilters,
        loading: loading,
      })
    : isClient ? config.filters : null;

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
          createUrl={config.createUrl}
          onRefresh={() => fetchData()}
          onCreate={canCreate ? handleCreateWithCallback : () => {}}
          onPageChange={handlePageChange}
          onSort={handleSort}
          renderActions={renderActions as (item: Record<string, unknown>) => ReactNode}
          filters={filtersWithProps}
          hideCreateButton={config.hideCreateButton || !canCreate}
        />
        
        {config.modals?.create}
        {config.modals?.edit}
        {config.modals?.delete}
        {config.modals?.view}
      </ClientOnly>
    </HydrationGuard>
  );
}

export default GenericManagementPage;
export { GenericManagementPage };