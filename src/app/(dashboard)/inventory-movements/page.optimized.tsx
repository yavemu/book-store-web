"use client";

import React from "react";
import { useInventoryMovements } from "@/hooks/inventory/useInventoryMovements";
import PageWrapper from "@/components/PageWrapper";
import PageLoading from "@/components/ui/PageLoading";
import ApiErrorState from "@/components/ErrorStates/ApiErrorState";
import GenericAdvancedSearch from "@/components/Dashboard/GenericAdvancedSearch";
import InventoryMovementsTable from "@/components/inventory-movements/InventoryMovementsTable"; // Assuming this exists
import StockAdjustmentForm from "@/components/inventory-movements/StockAdjustmentForm"; // New component
import InventoryStatsWidget from "@/components/inventory-movements/InventoryStatsWidget"; // New component

export default function InventoryMovementsPageOptimized() {
  const inventory = useInventoryMovements({
    customHandlers: {
      onAfterCreate: (movement) => {
        console.log('Movimiento de inventario creado:', movement.id);
        // Aquí podrías enviar notificaciones de stock bajo, etc.
      }
    }
  });

  // Loading state
  if (inventory.state.loading && !inventory.state.data.length) {
    return (
      <PageLoading title="Movimientos de Movimientos" breadcrumbs={["Movimientos", "Movimientos"]} message="Cargando movimientos de inventario..." />
    );
  }

  // Error state
  if (inventory.state.error) {
    return (
      <PageWrapper title="Movimientos de Movimientos">
        <ApiErrorState
          error={inventory.state.error}
          canRetry={true}
          isRetrying={inventory.state.loading}
          onRetry={inventory.handlers.onDataRefresh}
          onReset={() => {
            inventory.handlers.onClearSearch?.();
            inventory.handlers.onDataRefresh?.();
          }}
          title="Error cargando movimientos"
          description="No se pudieron cargar los movimientos de inventario."
          showTechnicalDetails
        />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper
      title="Movimientos de Movimientos"
      breadcrumbs={["Movimientos", "Movimientos"]}
      showCsvDownload={true}
      onCsvDownload={inventory.handlers.onExport}
      csvDownloadEnabled={true}
    >
      {/* Inventory Stats Widget */}
      <div className="mb-6">
        <InventoryStatsWidget onGetStockSummary={inventory.inventory.getStockSummary} onExportReport={inventory.inventory.exportInventoryReport} />
      </div>

      {/* Advanced Search Component */}
      <div className="mb-6">
        <GenericAdvancedSearch
          entityName="Movimientos de Movimientos"
          searchFields={[
            { key: "bookTitle", label: "Título del libro", type: "text", placeholder: "Buscar por libro" },
            { key: "bookIsbn", label: "ISBN", type: "text", placeholder: "ISBN-10 o ISBN-13" },
            {
              key: "movementType",
              label: "Tipo",
              type: "select",
              options: [
                { value: "IN", label: "Entrada" },
                { value: "OUT", label: "Salida" },
                { value: "ADJUSTMENT", label: "Ajuste" },
              ],
            },
            { key: "performedBy", label: "Realizado por", type: "text" },
            { key: "startDate", label: "Fecha desde", type: "date" },
            { key: "endDate", label: "Fecha hasta", type: "date" },
            {
              key: "lowStock",
              label: "Stock bajo",
              type: "boolean",
              options: [
                { value: true, label: "Solo stock bajo" },
                { value: false, label: "Todos los niveles" },
              ],
            },
          ]}
          onAutoFilter={inventory.handlers.onAutoFilter}
          onAdvancedFilter={inventory.handlers.onAdvancedFilter}
          onClear={inventory.handlers.onClearSearch}
          loading={inventory.state.searchLoading}
        />
      </div>

      {/* Bulk Operations Bar */}
      {inventory.state.bulkOperationMode && (
        <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-800">{inventory.selection.selectedMovements.length} movimientos seleccionados</span>
            <div className="flex space-x-2">
              <button
                onClick={() =>
                  inventory.inventory.exportInventoryReport({
                    movementIds: inventory.selection.selectedMovements.map((m) => m.id),
                  })
                }
                className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                disabled={!inventory.state.hasSelectedMovements}
              >
                Exportar Seleccionados
              </button>
              <button onClick={inventory.selection.clearSelection} className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700">
                Limpiar Selección
              </button>
              <button onClick={inventory.selection.toggleBulkMode} className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700">
                Salir Modo Bulk
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Inventory Movements Table */}
      <InventoryMovementsTable
        data={inventory.state.data}
        meta={inventory.state.meta}
        loading={inventory.state.loading || inventory.state.searchLoading}
        onPageChange={inventory.handlers.onPageChange}
        onDataRefresh={inventory.handlers.onDataRefresh}
        // CRUD handlers (limited for inventory)
        onCreate={inventory.handlers.onCreate} // Stock adjustment
        onEdit={inventory.handlers.onEdit} // Stock adjustment based on movement
        onView={inventory.handlers.onView}
        // No delete for inventory movements
        // Form state
        showForm={inventory.state.showForm}
        formLoading={inventory.state.formLoading}
        onFormCancel={inventory.handlers.onFormCancel}
        // Modal state
        showViewModal={inventory.state.showViewModal}
        onViewModalClose={inventory.utils.handleViewModalClose}
        // Selection mode
        bulkOperationMode={inventory.state.bulkOperationMode}
        selectedMovements={inventory.selection.selectedMovements}
        onToggleMovement={inventory.selection.toggleMovement}
        onSelectAll={inventory.selection.selectAll}
        onToggleBulkMode={inventory.selection.toggleBulkMode}
        // Specialized search functions
        onSearchByBook={inventory.inventory.searchByBook}
        onSearchByDateRange={inventory.inventory.searchByDateRange}
        onSearchByMovementType={inventory.inventory.searchByMovementType}
        // Custom form component for stock adjustments
        formComponent={
          inventory.state.showStockAdjustment && (
            <StockAdjustmentForm
              data={inventory.stockAdjustment.data}
              onDataChange={inventory.stockAdjustment.updateData}
              onSubmit={inventory.handlers.onFormSubmit}
              onCancel={inventory.handlers.onFormCancel}
              loading={inventory.state.formLoading}
              canSubmit={inventory.stockAdjustment.canSubmit}
              // Additional props for stock adjustment
              onSearchBook={inventory.inventory.searchByBook}
              onGetCurrentStock={inventory.inventory.getStockSummary}
            />
          )
        }
      />
    </PageWrapper>
  );
}