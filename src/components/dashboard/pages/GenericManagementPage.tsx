"use client";

import React, { useCallback, ReactNode } from "react";
import { Column } from "@/components/ui";
import { PaginationMeta } from "@/types/api";
import { useManagementPage } from "@/hooks/useManagementPage";
import { useIsClient } from "@/hooks/useIsClient";
import { ManagementPageLayout, ManagementActions } from "../common";
import { ClientOnly } from "@/components";
import HydrationGuard from "@/components/common/HydrationGuard";

interface ApiService<T, TParams, TFilters> {
  list: (params?: TParams) => Promise<{ data: T[]; meta: PaginationMeta }>;
  filter?: (filters: TFilters, page?: number, limit?: number) => Promise<{ data: T[]; meta: PaginationMeta }>;
}

export interface RolePermissions {
  canCreate?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
  canView?: boolean;
  roles?: string[]; // Roles permitidos para esta funcionalidad
}

export interface ManagementPageConfig<T, TParams, TFilters> {
  title: string;
  createButtonText: string;
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

interface GenericManagementPageProps<T, TParams, TFilters> {
  config: ManagementPageConfig<T, TParams, TFilters>;
  userRole: string;
  onCreateModal?: () => void;
  onEditModal?: (item: T) => void;
  onDeleteModal?: (item: T) => void;
  onViewModal?: (item: T) => void;
}

export default function GenericManagementPage<T, TParams, TFilters>({
  config,
  userRole,
  onCreateModal,
  onEditModal,
  onDeleteModal,
  onViewModal,
}: GenericManagementPageProps<T, TParams, TFilters>) {
  const isClient = useIsClient();
  
  // Función para verificar permisos basados en rol
  const hasPermission = (permission: keyof RolePermissions): boolean => {
    if (!config.permissions) return true; // Si no hay permisos definidos, permitir todo
    
    // Verificar si el rol tiene acceso
    if (config.permissions.roles && !config.permissions.roles.includes(userRole)) {
      return false;
    }
    
    // Verificar permisos específicos según rol
    const basePermission = config.permissions[permission];
    
    // Si es admin, tiene todos los permisos base
    if (userRole === "admin") {
      return basePermission !== false;
    }
    
    // Si es user, solo puede ver, no crear/editar/eliminar
    if (userRole === "user") {
      return permission === "canView" && basePermission !== false;
    }
    
    return basePermission !== false;
  };

  const canCreate = hasPermission('canCreate');
  const canEdit = hasPermission('canEdit');
  const canDelete = hasPermission('canDelete');
  const canView = hasPermission('canView');
  
  // Validar la configuración antes de continuar
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
    handleView,
    handleEdit,
    handleDelete,
    modalStates: { showCreateModal, showEditModal, showDeleteModal, showViewModal },
    setShowCreateModal,
    setShowEditModal,
    setShowDeleteModal,
    setShowViewModal,
    selectedItem,
    setSelectedItem,
  } = useManagementPage<T, TParams, TFilters>({
    initialParams: config.initialParams,
    apiService: config.apiService,
    errorMessage: config.errorMessage || "Error al cargar los datos",
  });

  const handleViewWithCallback = useCallback((item: T) => {
    handleView(item);
    onViewModal?.(item);
  }, [handleView, onViewModal]);

  const handleEditWithCallback = useCallback((item: T) => {
    handleEdit(item);
    onEditModal?.(item);
  }, [handleEdit, onEditModal]);

  const handleDeleteWithCallback = useCallback((item: T) => {
    handleDelete(item);
    onDeleteModal?.(item);
  }, [handleDelete, onDeleteModal]);

  const handleCreateWithCallback = useCallback(() => {
    setShowCreateModal(true);
    onCreateModal?.();
  }, [setShowCreateModal, onCreateModal]);

  const renderActions = useCallback(
    (item: T) => {
      if (config.hideActions || (!canView && !canEdit && !canDelete)) return null;
      
      return (
        <ManagementActions
          item={item}
          onView={canView ? handleViewWithCallback : undefined}
          onEdit={canEdit ? handleEditWithCallback : undefined}
          onDelete={canDelete ? handleDeleteWithCallback : undefined}
        />
      );
    },
    [handleViewWithCallback, handleEditWithCallback, handleDeleteWithCallback, config.hideActions, canView, canEdit, canDelete],
  );

  const filtersWithProps = isClient && config.filters && React.isValidElement(config.filters)
    ? React.cloneElement(config.filters as React.ReactElement, {
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
          data={data}
          columns={config.columns}
          meta={meta}
          loading={loading}
          error={error}
          emptyMessage={config.emptyMessage}
          createButtonText={config.createButtonText}
          onRefresh={() => fetchData()}
          onCreate={canCreate ? handleCreateWithCallback : undefined}
          onPageChange={handlePageChange}
          onSort={handleSort}
          renderActions={renderActions}
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