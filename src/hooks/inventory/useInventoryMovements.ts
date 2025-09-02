/**
 * Hook especializado para Inventory Movements
 * Maneja operaciones de inventario con capacidades limitadas (read + limited updates)
 */

import { useState, useCallback, useMemo } from 'react';
import { useDashboardOptimized } from '../dashboard/useDashboardOptimized';
import { inventoryMovementsApi } from '@/services/api/entities/inventory-movements';
import { inventoryMovementsConfig } from '@/config/dashboard/inventory-movements.config';

interface BulkStockUpdate {
  bookId: string;
  newStock: number;
  reason: string;
  movementType: 'IN' | 'OUT' | 'ADJUSTMENT';
}

interface UseInventoryMovementsProps {
  customHandlers?: any;
}

export function useInventoryMovements({ 
  customHandlers = {}
}: UseInventoryMovementsProps = {}) {
  
  // Estado específico para operaciones de inventario
  const [inventoryState, setInventoryState] = useState({
    selectedMovements: [] as any[],
    bulkOperationMode: false,
    showStockAdjustment: false,
    stockAdjustmentData: {
      bookId: '',
      currentStock: 0,
      newStock: 0,
      reason: '',
      movementType: 'ADJUSTMENT' as const
    }
  });

  // Actualizar estado interno
  const updateInventoryState = useCallback((updates: Partial<typeof inventoryState>) => {
    setInventoryState(prev => ({ ...prev, ...updates }));
  }, []);

  // Custom handlers para Inventory Movements
  const inventoryCustomHandlers = useMemo(() => ({
    // Override create para mostrar formulario de ajuste de stock
    onCreate: () => {
      updateInventoryState({
        showStockAdjustment: true,
        stockAdjustmentData: {
          bookId: '',
          currentStock: 0,
          newStock: 0,
          reason: '',
          movementType: 'ADJUSTMENT'
        }
      });
    },

    // Override edit para ajuste de stock (no edición real)
    onEdit: (movement: any) => {
      updateInventoryState({
        showStockAdjustment: true,
        stockAdjustmentData: {
          bookId: movement.bookId || '',
          currentStock: movement.currentStock || 0,
          newStock: movement.currentStock || 0,
          reason: `Ajuste basado en movimiento ${movement.id}`,
          movementType: 'ADJUSTMENT'
        }
      });
    },

    // Custom form submit para ajustes de inventario
    onFormSubmit: async (formData: any) => {
      try {
        // Crear movimiento de inventario en lugar de editar
        const movementData = {
          ...inventoryState.stockAdjustmentData,
          ...formData,
          quantity: Math.abs(formData.newStock - formData.currentStock),
          movementType: formData.newStock > formData.currentStock ? 'IN' : 
                       formData.newStock < formData.currentStock ? 'OUT' : 'ADJUSTMENT'
        };

        await inventoryMovementsApi.create(movementData);

        // Cerrar formulario y actualizar datos
        updateInventoryState({
          showStockAdjustment: false,
          stockAdjustmentData: {
            bookId: '',
            currentStock: 0,
            newStock: 0,
            reason: '',
            movementType: 'ADJUSTMENT'
          }
        });

        // Refresh data
        await dashboardHook.utils.loadData();
        
      } catch (error) {
        console.error('Error creating inventory movement:', error);
        throw error;
      }
    },

    // Custom form cancel
    onFormCancel: () => {
      updateInventoryState({
        showStockAdjustment: false,
        stockAdjustmentData: {
          bookId: '',
          currentStock: 0,
          newStock: 0,
          reason: '',
          movementType: 'ADJUSTMENT'
        }
      });
    },

    // Custom handlers del parent
    ...customHandlers
  }), [inventoryState.stockAdjustmentData, customHandlers]);

  // Main dashboard hook
  const dashboardHook = useDashboardOptimized({
    config: inventoryMovementsConfig,
    apiService: inventoryMovementsApi,
    customHandlers: inventoryCustomHandlers
  });

  // ===== INVENTORY-SPECIFIC METHODS =====

  // Buscar movimientos por libro específico
  const searchByBook = useCallback(async (bookId: string) => {
    if (!bookId) return;
    
    try {
      return await inventoryMovementsApi.advancedFilter(
        { bookId }, 
        { page: 1, limit: 50, sortBy: "createdAt", sortOrder: "DESC" }
      );
    } catch (error) {
      console.error('Error searching movements by book:', error);
      throw error;
    }
  }, []);

  // Buscar por rango de fechas
  const searchByDateRange = useCallback(async (startDate: string, endDate: string) => {
    if (!startDate || !endDate) return;
    
    try {
      return await inventoryMovementsApi.advancedFilter(
        { 
          startDate,
          endDate
        }, 
        { page: 1, limit: 100, sortBy: "createdAt", sortOrder: "DESC" }
      );
    } catch (error) {
      console.error('Error searching movements by date range:', error);
      throw error;
    }
  }, []);

  // Buscar por tipo de movimiento
  const searchByMovementType = useCallback(async (movementType: 'IN' | 'OUT' | 'ADJUSTMENT') => {
    if (!movementType) return;
    
    try {
      return await inventoryMovementsApi.filter({
        movementType,
        pagination: { page: 1, limit: 50, sortBy: "createdAt", sortOrder: "DESC" }
      });
    } catch (error) {
      console.error('Error searching movements by type:', error);
      throw error;
    }
  }, []);

  // Obtener resumen de stock por libro
  const getStockSummary = useCallback(async (bookId?: string) => {
    try {
      const filters = bookId ? { bookId } : {};
      const movements = await inventoryMovementsApi.advancedFilter(
        filters,
        { page: 1, limit: 1000, sortBy: "createdAt", sortOrder: "ASC" }
      );

      // Calcular resumen
      const summary: Record<string, {
        bookId: string;
        totalIn: number;
        totalOut: number;
        currentStock: number;
        lastMovement: any;
      }> = {};

      movements?.data?.forEach((movement: any) => {
        const id = movement.bookId;
        if (!summary[id]) {
          summary[id] = {
            bookId: id,
            totalIn: 0,
            totalOut: 0,
            currentStock: 0,
            lastMovement: null
          };
        }

        if (movement.movementType === 'IN') {
          summary[id].totalIn += movement.quantity;
          summary[id].currentStock += movement.quantity;
        } else if (movement.movementType === 'OUT') {
          summary[id].totalOut += movement.quantity;
          summary[id].currentStock -= movement.quantity;
        }

        // Update last movement
        if (!summary[id].lastMovement || 
            new Date(movement.createdAt) > new Date(summary[id].lastMovement.createdAt)) {
          summary[id].lastMovement = movement;
        }
      });

      return bookId ? summary[bookId] : Object.values(summary);
    } catch (error) {
      console.error('Error getting stock summary:', error);
      throw error;
    }
  }, []);

  // Bulk stock adjustment
  const performBulkStockAdjustment = useCallback(async (adjustments: BulkStockUpdate[]) => {
    try {
      const operations = adjustments.map(adjustment => 
        inventoryMovementsApi.create({
          bookId: adjustment.bookId,
          quantity: Math.abs(adjustment.newStock - (inventoryState.stockAdjustmentData.currentStock || 0)),
          movementType: adjustment.movementType,
          reason: adjustment.reason,
          performedBy: 'current-user' // This should come from auth
        })
      );
      
      const results = await Promise.allSettled(operations);
      const successful = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.filter(r => r.status === 'rejected').length;
      
      await dashboardHook.utils.loadData();
      
      return { successful, failed, total: adjustments.length };
    } catch (error) {
      console.error('Error in bulk stock adjustment:', error);
      throw error;
    }
  }, [dashboardHook.utils, inventoryState.stockAdjustmentData.currentStock]);

  // Export inventory report
  const exportInventoryReport = useCallback(async (filters?: any) => {
    try {
      const csvData = await inventoryMovementsApi.exportToCsv(filters);
      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `movimientos_inventario_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting inventory report:', error);
      throw error;
    }
  }, []);

  // ===== DERIVED STATE =====

  const inventoryEnhancedState = useMemo(() => ({
    // Original dashboard state
    ...dashboardHook.state,
    
    // Inventory-specific state
    ...inventoryState,
    
    // Computed properties
    hasSelectedMovements: inventoryState.selectedMovements.length > 0,
    canPerformBulkOperations: inventoryState.selectedMovements.length > 1,
    
    // Form state override
    showForm: inventoryState.showStockAdjustment,
    formTitle: inventoryState.showStockAdjustment ? 'Ajuste de Stock' : '',
    
    // Stock adjustment validation
    canSubmitStockAdjustment: inventoryState.stockAdjustmentData.bookId &&
                              inventoryState.stockAdjustmentData.reason &&
                              inventoryState.stockAdjustmentData.newStock >= 0,
  }), [dashboardHook.state, inventoryState]);

  return {
    // Main dashboard functionality
    ...dashboardHook,
    
    // Override state with inventory-specific enhancements
    state: inventoryEnhancedState,
    
    // Inventory-specific form methods
    stockAdjustment: {
      data: inventoryState.stockAdjustmentData,
      updateData: (updates: Partial<typeof inventoryState.stockAdjustmentData>) => {
        updateInventoryState({
          stockAdjustmentData: { ...inventoryState.stockAdjustmentData, ...updates }
        });
      },
      canSubmit: inventoryEnhancedState.canSubmitStockAdjustment,
      show: () => updateInventoryState({ showStockAdjustment: true }),
      hide: () => updateInventoryState({ showStockAdjustment: false })
    },
    
    // Selection methods
    selection: {
      selectedMovements: inventoryState.selectedMovements,
      toggleMovement: (movement: any) => {
        const isSelected = inventoryState.selectedMovements.some(m => m.id === movement.id);
        const newSelection = isSelected
          ? inventoryState.selectedMovements.filter(m => m.id !== movement.id)
          : [...inventoryState.selectedMovements, movement];
        
        updateInventoryState({ selectedMovements: newSelection });
      },
      selectAll: (movements: any[]) => updateInventoryState({ selectedMovements: movements }),
      clearSelection: () => updateInventoryState({ selectedMovements: [] }),
      toggleBulkMode: () => updateInventoryState({ 
        bulkOperationMode: !inventoryState.bulkOperationMode,
        selectedMovements: []
      })
    },
    
    // Inventory-specific operations
    inventory: {
      searchByBook,
      searchByDateRange,
      searchByMovementType,
      getStockSummary,
      performBulkStockAdjustment,
      exportInventoryReport
    }
  };
}