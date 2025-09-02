"use client";

import React from "react";
import { DashboardEntityConfig } from "@/types/dashboard/entities";
import { useDashboard } from "@/hooks/useDashboard";
import PageWrapper from "@/components/PageWrapper";
import PageLoading from "@/components/ui/PageLoading";
import ApiErrorState from "@/components/ErrorStates/ApiErrorState";
import GenericAdvancedSearch from "@/components/Dashboard/GenericAdvancedSearch";
import QuickSearchInput from "@/components/Dashboard/QuickSearchInput";
import DynamicTable from "@/components/DynamicTable";

interface GenericDashboardPageProps<TEntity = any, TCreateDto = any, TUpdateDto = any> {
  config: DashboardEntityConfig<TEntity, TCreateDto, TUpdateDto>;
  apiService: any;
  tableComponent?: React.ComponentType<any>;
  customHandlers?: any;
}

export default function GenericDashboardPage<TEntity = any, TCreateDto = any, TUpdateDto = any>({
  config,
  apiService,
  tableComponent: TableComponent,
  customHandlers = {}
}: GenericDashboardPageProps<TEntity, TCreateDto, TUpdateDto>) {
  
  const { state, handlers, utils } = useDashboard({
    config,
    apiService,
    customHandlers
  });

  // Loading state
  if (state.loading && !state.data.length) {
    return (
      <PageLoading 
        title={config.displayName} 
        breadcrumbs={config.customConfig?.breadcrumbs || []}
        message={`Cargando ${config.entity}...`}
      />
    );
  }

  // Error state
  if (state.error) {
    return (
      <PageWrapper title={config.displayName}>
        <ApiErrorState
          error={state.error}
          canRetry={true}
          isRetrying={state.loading}
          onRetry={handlers.onDataRefresh}
          onReset={() => {
            utils.updateState({ 
              currentPage: 1, 
              isSearchMode: false,
              searchParams: {}
            });
            handlers.onDataRefresh?.();
          }}
          title={`Error cargando ${config.entity}`}
          description={`No se pudieron cargar los registros de ${config.entity}.`}
          showTechnicalDetails
        />
      </PageWrapper>
    );
  }

  // Quick search component (only if auto-search is enabled)
  const quickSearchComponent = config.capabilities.search.includes('auto') && config.search?.autoSearch?.enabled 
    ? (
      <QuickSearchInput
        onAutoFilter={handlers.onAutoFilter!}
        loading={state.searchLoading}
        placeholder={config.search.autoSearch.placeholder}
      />
    ) 
    : undefined;

  return (
    <PageWrapper
      title={config.displayName}
      breadcrumbs={config.customConfig?.breadcrumbs || []}
      showCsvDownload={config.capabilities.export}
      onCsvDownload={handlers.onExport}
      csvDownloadEnabled={config.capabilities.export}
    >
      {/* Advanced Search Component - only if advanced search is enabled */}
      {config.capabilities.search.includes('advanced') && config.search?.advancedSearch?.enabled && (
        <div className="mb-6">
          <GenericAdvancedSearch
            entityName={config.displayName}
            searchFields={config.search.advancedSearch.fields}
            onAutoFilter={config.capabilities.search.includes('auto') ? handlers.onAutoFilter : undefined}
            onSearch={config.capabilities.search.includes('simple') ? handlers.onSearch : undefined}
            onAdvancedFilter={handlers.onAdvancedFilter}
            onClear={handlers.onClearSearch}
            loading={state.searchLoading}
          />
        </div>
      )}

      {/* Dynamic Table Component */}
      {TableComponent ? (
        <TableComponent
          data={state.data}
          meta={state.meta}
          loading={state.loading || state.searchLoading}
          onPageChange={handlers.onPageChange}
          onDataRefresh={handlers.onDataRefresh}
          quickSearchComponent={quickSearchComponent}
          // CRUD handlers - only pass if capabilities allow
          onCreate={config.capabilities.crud.includes('create') ? handlers.onCreate : undefined}
          onEdit={config.capabilities.crud.includes('update') ? handlers.onEdit : undefined}
          onView={config.capabilities.crud.includes('read') ? handlers.onView : undefined}
          onDelete={config.capabilities.crud.includes('delete') ? handlers.onDelete : undefined}
          // Form state
          showForm={state.showForm}
          isEditing={state.isEditing}
          selectedEntity={state.selectedEntity}
          formLoading={state.formLoading}
          onFormSubmit={handlers.onFormSubmit}
          onFormCancel={handlers.onFormCancel}
          // Modal state
          showViewModal={state.showViewModal}
          showDeleteModal={state.showDeleteModal}
          onDeleteConfirm={handlers.onDeleteConfirm}
          onViewModalClose={utils.handleViewModalClose}
          onDeleteModalCancel={utils.handleDeleteModalCancel}
        />
      ) : (
        <DynamicTable
          data={state.data}
          columns={config.table.columns}
          actions={config.table.actions?.filter(action => {
            // Filter actions based on capabilities
            const actionToCapability = {
              'create': 'create',
              'view': 'read',
              'edit': 'update',
              'delete': 'delete'
            };
            const requiredCapability = actionToCapability[action.key as keyof typeof actionToCapability];
            return !requiredCapability || config.capabilities.crud.includes(requiredCapability as any);
          })}
          meta={state.meta}
          loading={state.loading || state.searchLoading}
          onPageChange={handlers.onPageChange}
          onActionClick={(action, entity) => {
            switch (action.handler) {
              case 'onCreate':
                handlers.onCreate?.();
                break;
              case 'onView':
                handlers.onView?.(entity);
                break;
              case 'onEdit':
                handlers.onEdit?.(entity);
                break;
              case 'onDelete':
                handlers.onDelete?.(entity);
                break;
            }
          }}
          quickSearchComponent={quickSearchComponent}
          // CRUD capabilities
          canCreate={config.capabilities.crud.includes('create')}
          canEdit={config.capabilities.crud.includes('update')}
          canDelete={config.capabilities.crud.includes('delete')}
          canView={config.capabilities.crud.includes('read')}
          // Form state
          showForm={state.showForm}
          isEditing={state.isEditing}
          selectedEntity={state.selectedEntity}
          formLoading={state.formLoading}
          onFormSubmit={handlers.onFormSubmit}
          onFormCancel={handlers.onFormCancel}
          // Modal state  
          showViewModal={state.showViewModal}
          showDeleteModal={state.showDeleteModal}
          onDeleteConfirm={handlers.onDeleteConfirm}
          onViewModalClose={utils.handleViewModalClose}
          onDeleteModalCancel={utils.handleDeleteModalCancel}
          // Entity info
          entityName={config.entityName}
          entityDisplayName={config.displayName}
        />
      )}
    </PageWrapper>
  );
}

// ========================================
// TYPED WRAPPER COMPONENT
// ========================================

/**
 * Creates a type-safe dashboard page component for a specific entity
 * Usage example:
 * 
 * const AuthorsPage = createDashboardPage(authorsConfig);
 * export default function AuthorsPageWrapper() {
 *   return <AuthorsPage config={authorsConfig} />;
 * }
 */
export function createDashboardPage<
  TEntity,
  TCreateDto,
  TUpdateDto,
  TListParams extends CommonListParams,
  TSearchParams,
  TFilterParams
>(defaultConfig?: DashboardEntityConfig<TEntity, TCreateDto, TUpdateDto, TListParams, TSearchParams, TFilterParams>) {
  return function TypedDashboardPage(
    props: {
      config?: DashboardEntityConfig<TEntity, TCreateDto, TUpdateDto, TListParams, TSearchParams, TFilterParams>;
    }
  ) {
    const config = props.config || defaultConfig;
    if (!config) {
      throw new Error("Dashboard configuration is required");
    }
    
    return <GenericDashboardPage config={config} />;
  };
}