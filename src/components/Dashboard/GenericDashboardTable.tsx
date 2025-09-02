"use client";

// Generic Dashboard Table Component
// This component handles the table display and CRUD operations for any entity

import React from "react";
import DynamicTable from "@/components/DynamicTable";
import { 
  DashboardEntityConfig, 
  DashboardState, 
  DashboardHandlers,
  CommonListParams
} from "@/types/dashboard/entities";
import { TableAction } from "@/types/table";

// ========================================
// GENERIC DASHBOARD TABLE COMPONENT
// ========================================

interface GenericDashboardTableProps<
  TEntity,
  TCreateDto,
  TUpdateDto,
  TListParams extends CommonListParams,
  TSearchParams,
  TFilterParams
> {
  config: DashboardEntityConfig<TEntity, TCreateDto, TUpdateDto, TListParams, TSearchParams, TFilterParams>;
  state: DashboardState<TEntity>;
  handlers: DashboardHandlers<TEntity, TCreateDto, TUpdateDto, TFilterParams>;
  quickSearchComponent?: React.ReactNode;
}

export default function GenericDashboardTable<
  TEntity,
  TCreateDto,
  TUpdateDto,
  TListParams extends CommonListParams,
  TSearchParams,
  TFilterParams
>({
  config,
  state,
  handlers,
  quickSearchComponent,
}: GenericDashboardTableProps<TEntity, TCreateDto, TUpdateDto, TListParams, TSearchParams, TFilterParams>) {
  
  // ========================================
  // BUILD TABLE ACTIONS BASED ON CAPABILITIES
  // ========================================
  
  const buildTableActions = (): TableAction[] => {
    const actions: TableAction[] = [];
    
    if (config.capabilities.crud.includes('read')) {
      actions.push({
        label: "Ver",
        onClick: handlers.onView,
        variant: "ver",
      });
    }
    
    if (config.capabilities.crud.includes('update')) {
      actions.push({
        label: "Editar",
        onClick: handlers.onEdit,
        variant: "editar",
      });
    }
    
    if (config.capabilities.crud.includes('delete')) {
      actions.push({
        label: "Eliminar",
        onClick: handlers.onDelete,
        variant: "eliminar",
      });
    }
    
    return actions;
  };

  // ========================================
  // RENDER FORM COMPONENT
  // ========================================
  
  const renderFormComponent = () => {
    if (!state.showForm || !config.components.FormComponent) return null;
    
    const FormComponent = config.components.FormComponent;
    
    return (
      <FormComponent
        entity={state.selectedEntity}
        onSubmit={handlers.onFormSubmit}
        onCancel={handlers.onFormCancel}
        loading={state.crudLoading}
        isEditing={state.isEditing}
      />
    );
  };

  // ========================================
  // RENDER VIEW MODAL COMPONENT
  // ========================================
  
  const renderViewModalComponent = () => {
    if (!state.showViewModal || !state.selectedEntity || !config.components.ViewModalComponent) return null;
    
    const ViewModalComponent = config.components.ViewModalComponent;
    
    return (
      <ViewModalComponent
        entity={state.selectedEntity}
        isOpen={state.showViewModal}
        onClose={handlers.onViewModalClose}
      />
    );
  };

  // ========================================
  // RENDER DELETE DIALOG COMPONENT
  // ========================================
  
  const renderDeleteDialogComponent = () => {
    if (!state.showDeleteDialog || !state.selectedEntity || !config.components.DeleteDialogComponent) return null;
    
    const DeleteDialogComponent = config.components.DeleteDialogComponent;
    
    return (
      <DeleteDialogComponent
        entity={state.selectedEntity}
        isOpen={state.showDeleteDialog}
        onConfirm={handlers.onDeleteConfirm}
        onCancel={handlers.onDeleteCancel}
        loading={state.crudLoading}
      />
    );
  };

  // ========================================
  // MAIN TABLE RENDER
  // ========================================

  return (
    <>
      <DynamicTable
        data={state.data}
        columns={config.ui.tableColumns}
        meta={state.meta}
        loading={state.loading || state.searchLoading}
        onPageChange={handlers.onPageChange}
        actions={buildTableActions()}
        showCreateButton={config.capabilities.crud.includes('create')}
        entityName={config.entityName.toLowerCase()}
        onCreateClick={config.capabilities.crud.includes('create') ? handlers.onCreate : undefined}
        showForm={state.showForm}
        formComponent={renderFormComponent()}
        onFormToggle={() => {
          if (state.showForm) {
            handlers.onFormCancel();
          } else {
            handlers.onCreate();
          }
        }}
        isEditing={state.isEditing}
        quickSearchComponent={quickSearchComponent}
      />

      {/* View Modal */}
      {renderViewModalComponent()}

      {/* Delete Confirmation Dialog */}
      {renderDeleteDialogComponent()}
    </>
  );
}