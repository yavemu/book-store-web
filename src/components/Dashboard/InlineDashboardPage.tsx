'use client';

import React from 'react';
import { useDashboard } from '@/hooks/useDashboard';
import DashboardHeader from './DashboardHeader';
import GenericAdvancedSearch from './GenericAdvancedSearch';
import ActiveFiltersDisplay from '../ActiveFiltersDisplay';
import DataTable from '../DataTable';
import Button from '../ui/Button';
import GenericViewModal from './GenericViewModal';
import GenericDeleteDialog from './GenericDeleteDialog';
import GenericForm from './GenericForm';

// Props interface for the inline dashboard page (same as UnifiedDashboardPage)
interface InlineDashboardPageProps<TEntity = any> {
  config: {
    entityName: string;
    displayName: string;
    defaultPageSize?: number;
    defaultSort?: {
      field: string;
      direction: 'ASC' | 'DESC';
    };
    capabilities: {
      crud: string[];
      search: string[];
      export?: boolean;
    };
    columns: any[];
    searchFields?: any[];
    formFields?: Array<{
      key: string;
      label: string;
      type: 'text' | 'email' | 'number' | 'date' | 'select' | 'textarea' | 'boolean' | 'file';
      required?: boolean;
      options?: { value: any; label: string }[];
      placeholder?: string;
    }>;
  };
  
  apiService: any;
  customComponents?: {
    table?: React.ComponentType<any>;
    form?: React.ComponentType<any>;
    viewModal?: React.ComponentType<any>;
    deleteDialog?: React.ComponentType<any>;
  };
  
  customHandlers?: {
    onAfterCreate?: (entity: TEntity) => void;
    onAfterUpdate?: (entity: TEntity) => void;
    onAfterDelete?: (entityId: string) => void;
    onDataRefresh?: () => void;
    onExport?: () => void;
  };
}

export default function InlineDashboardPage<TEntity = any>({
  config,
  apiService,
  customComponents,
  customHandlers
}: InlineDashboardPageProps<TEntity>) {
  
  const dashboard = useDashboard({
    config: {
      entity: config.entityName,
      entityName: config.entityName,
      capabilities: config.capabilities,
      table: {
        columns: config.columns,
        pageSize: config.defaultPageSize,
        defaultSort: config.defaultSort
      },
      search: {
        autoSearch: {
          enabled: config.capabilities.search.includes('auto'),
          minChars: 3,
          debounceMs: 300
        },
        advancedSearch: {
          enabled: config.capabilities.search.includes('advanced'),
          fields: config.searchFields || []
        }
      },
      form: {
        fields: config.formFields || []
      }
    },
    apiService: apiService,
    customHandlers: customHandlers
  });

  const { state, handlers } = dashboard;

  const {
    onCreate: handleCreate,
    onEdit: handleEdit,
    onView: handleView,
    onDelete: handleDelete,
    onFormSubmit: handleFormSubmit,
    onFormCancel: handleFormCancel,
    onDeleteConfirm: handleDeleteConfirm,
    onAutoFilter: handleAutoFilter,
    onSearch: handleSearch,
    onAdvancedFilter: handleAdvancedFilter,
    onQuickFilter: handleQuickFilter,
    onClearSearch: handleClearSearch,
    onPageChange: handlePageChange,
    onDataRefresh: handleRefresh
  } = handlers;

  const isLoading = state.loading || state.searchLoading || state.formLoading;
  const hasError = !!state.error;
  const isEmpty = !isLoading && state.data.length === 0;
  const totalItems = state.meta?.total || 0;
  const totalPages = state.meta?.totalPages || 0;
  const hasNext = state.meta?.hasNext || false;
  const hasPrev = state.meta?.hasPrev || false;

  const handleAutoFilterInternal = (term: string) => {
    handleAutoFilter(term);
  };

  const handleSimpleSearch = (term: string, fuzzySearch?: boolean) => {
    handleSearch(term, fuzzySearch);
  };

  const handleAdvancedSearch = (filters: any, fuzzySearch?: boolean) => {
    handleAdvancedFilter(filters);
  };

  const handlePaginationChange = (page: number) => {
    handlePageChange(page);
  };

  const handleClearAll = () => {
    handleClearSearch();
  };

  const handleFormSave = async (formData: any) => {
    await handleFormSubmit(formData);
  };

  const handleDeleteConfirmInternal = async () => {
    await handleDeleteConfirm();
  };

  const handleCloseViewModal = () => {
    dashboard.utils.handleViewModalClose();
  };

  const handleCloseDeleteDialog = () => {
    dashboard.utils.handleDeleteModalCancel();
  };

  const handleCloseForm = () => {
    handleFormCancel();
  };

  return (
    <div className="dashboard-container">
      {/* Header with title and create button */}
      <DashboardHeader
        title={config.displayName}
        onCreateClick={handleCreate}
        canCreate={config.capabilities.crud.includes('create')}
        isLoading={isLoading}
        totalItems={totalItems}
        currentOperation={state.currentOperation}
        entityName={config.entityName}
      >
        {/* Quick search in header */}
        {config.capabilities.search.includes('auto') && (
          <div className="header-search">
            <input
              type="text"
              placeholder={`Búsqueda rápida ${config.entityName.toLowerCase()}... (mín. 3 caracteres)`}
              className="search-input-header"
              onChange={(e) => {
                const value = e.target.value.trim();
                if (value.length >= 3) {
                  setTimeout(() => handleAutoFilterInternal(value), 300);
                } else if (value.length === 0) {
                  handleClearAll();
                }
              }}
            />
          </div>
        )}
      </DashboardHeader>

      {/* Advanced Search Section */}
      {config.capabilities.search.includes('advanced') && config.searchFields && (
        <GenericAdvancedSearch
          entityName={config.entityName}
          searchFields={config.searchFields}
          onAutoFilter={handleAutoFilterInternal}
          onSearch={handleSimpleSearch}
          onAdvancedFilter={handleAdvancedSearch}
          onQuickFilter={handleQuickFilter}
          onClear={handleClearAll}
          loading={isLoading}
        />
      )}

      {/* Active Filters Display */}
      {state.isSearchMode && (
        <ActiveFiltersDisplay
          filters={state.searchParams}
          onClearFilter={(key) => {
            handleClearAll();
          }}
          onClearAll={handleClearAll}
        />
      )}

      {/* Inline Form Section */}
      {state.showForm && config.formFields && (
        <div className="inline-form-container" style={{
          backgroundColor: '#f8f9fa',
          border: '1px solid #dee2e6',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '20px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '20px',
            borderBottom: '1px solid #dee2e6',
            paddingBottom: '15px'
          }}>
            <h3 style={{ margin: 0, color: '#495057' }}>
              {state.isEditing ? `✏️ Editar ${config.entityName}` : `➕ Crear ${config.entityName}`}
            </h3>
            <Button
              variant="secondary"
              onClick={handleCloseForm}
              disabled={state.formLoading}
              style={{ minWidth: 'auto', padding: '8px 12px' }}
            >
              ✕
            </Button>
          </div>
          
          <div className="form-content">
            <GenericForm
              isOpen={true} // Always open when showing inline
              onClose={handleCloseForm}
              onSave={handleFormSave}
              entity={state.selectedEntity}
              entityName={config.entityName}
              fields={config.formFields}
              isEditing={state.isEditing}
              loading={state.formLoading}
              inline={true} // Render without modal
            />
          </div>
        </div>
      )}

      {/* Main Data Table */}
      <div className="table-container">
        {/* Loading State */}
        {isLoading && (
          <div className="loading-state">
            <div className="loading-spinner">🔄</div>
            <p>Cargando {config.entityName.toLowerCase()}...</p>
          </div>
        )}

        {/* Error State */}
        {hasError && !isLoading && (
          <div className="error-state">
            <p>❌ Error: {state.error}</p>
            <Button onClick={handleRefresh} variant="primary" size="sm">
              🔄 Reintentar
            </Button>
          </div>
        )}

        {/* Empty State */}
        {isEmpty && !isLoading && !hasError && (
          <div className="empty-state">
            <p>📋 No se encontraron {config.entityName.toLowerCase()}s</p>
            {state.isSearchMode ? (
              <Button onClick={handleClearAll} variant="secondary" size="sm">
                🔄 Limpiar búsqueda
              </Button>
            ) : (
              config.capabilities.crud.includes('create') && (
                <Button onClick={handleCreate} variant="primary" size="sm">
                  ➕ Crear {config.entityName}
                </Button>
              )
            )}
          </div>
        )}

        {/* Data Table */}
        {!isLoading && !hasError && !isEmpty && (
          <>
            {customComponents?.table ? (
              <customComponents.table
                data={state.data}
                columns={config.columns}
                loading={isLoading}
                sortBy={state.sortBy}
                sortOrder={state.sortOrder}
                onEdit={handleEdit}
                onView={handleView}
                onDelete={handleDelete}
                capabilities={config.capabilities}
              />
            ) : (
              <DataTable
                data={state.data}
                columns={config.columns}
                loading={isLoading}
                onEdit={handleEdit}
                onView={handleView}
                onDelete={handleDelete}
                capabilities={config.capabilities}
              />
            )}

            {/* Pagination */}
            <div className="pagination-container">
              <div className="pagination-info">
                <span>
                  Mostrando {((state.currentPage - 1) * state.pageSize) + 1} - {Math.min(state.currentPage * state.pageSize, totalItems)} de {totalItems} {config.entityName.toLowerCase()}s
                </span>
                
                <div className="page-size-selector">
                  <label>Elementos por página:</label>
                  <select 
                    value={state.pageSize}
                    onChange={(e) => {
                      console.log('Page size change requested:', e.target.value);
                    }}
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </div>
              </div>

              <div className="pagination-controls">
                <Button
                  onClick={() => handlePaginationChange(state.currentPage - 1)}
                  disabled={!hasPrev || isLoading}
                  variant="secondary"
                  size="sm"
                >
                  ← Anterior
                </Button>
                
                <span className="page-indicator">
                  Página {state.currentPage} de {totalPages}
                </span>
                
                <Button
                  onClick={() => handlePaginationChange(state.currentPage + 1)}
                  disabled={!hasNext || isLoading}
                  variant="secondary"
                  size="sm"
                >
                  Siguiente →
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Operation indicator for debugging */}
      <div className="operation-indicator">
        <small>
          Estado búsqueda: <strong>{state.isSearchMode ? 'Activa' : 'Inactiva'}</strong>
          {state.showForm && <span> | <strong>Formulario: {state.isEditing ? 'Editando' : 'Creando'}</strong></span>}
        </small>
      </div>

      {/* CRUD Modals - Only View and Delete, Form is inline */}
      {/* View Modal */}
      {state.showViewModal && state.selectedEntity && (
        <GenericViewModal
          isOpen={state.showViewModal}
          onClose={handleCloseViewModal}
          entity={state.selectedEntity}
          entityName={config.entityName}
          columns={config.columns}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {state.showDeleteModal && state.selectedEntity && (
        <GenericDeleteDialog
          isOpen={state.showDeleteModal}
          onClose={handleCloseDeleteDialog}
          onConfirm={handleDeleteConfirmInternal}
          entity={state.selectedEntity}
          entityName={config.entityName}
          loading={state.formLoading}
        />
      )}
    </div>
  );
}