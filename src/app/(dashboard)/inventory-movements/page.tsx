'use client';

import { useEffect, useState } from 'react';
import { useApiRequest, useSearchApi } from '@/hooks';
import { InventoryMovementListParams, InventoryMovement } from '@/services/api/entities/inventory-movements';
import DynamicTable, { TableColumn } from '@/components/DynamicTable';
import PageWrapper from '@/components/PageWrapper';
import ApiErrorState from '@/components/ErrorStates/ApiErrorState';
import AdvancedSearchForm, { SearchField, SearchFilters } from '@/components/AdvancedSearchForm';
import ActiveFiltersDisplay from '@/components/ActiveFiltersDisplay';
import InventoryMovementViewModal from '@/components/InventoryMovementViewModal';
import QuickSearch from '@/components/QuickSearch';

export default function InventoryMovementsPage() {
  const [params, setParams] = useState<InventoryMovementListParams>({ page: 1, limit: 10 });
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({});
  const [selectedMovement, setSelectedMovement] = useState<InventoryMovement | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);

  const { loading, error, data, execute } = useApiRequest({
    endpoint: '/inventory-movements',
    method: 'GET',
    onSuccess: () => {
      setIsFiltering(false);
    },
    onError: (error) => {
      setIsFiltering(false);
      const errorMessage = error?.message || error?.error || 'Error desconocido al cargar movimientos';
      const errorDetails = {
        message: errorMessage,
        statusCode: error?.statusCode || 'unknown',
        timestamp: new Date().toISOString()
      };
      console.error('Error loading inventory movements:', errorDetails);
    }
  });

  // Search API hooks
  const { advancedFilter, filterLoading, quickSearch } = useSearchApi({
    entity: 'inventory-movements',
    onSuccess: (response) => {
      setIsFiltering(false);
    },
    onError: (error) => {
      setIsFiltering(false);
      console.error('Error in search:', error);
    }
  });

  // Mock data - single record as requested
  const mockMovements = {
    data: [
      {
        id: 'INV-001',
        type: 'IN',
        status: 'COMPLETED',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ],
    meta: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 1,
      itemsPerPage: 10,
      hasNextPage: false,
      hasPrevPage: false
    }
  };

  useEffect(() => {
    // Since no real endpoint exists, use mock data
    // execute(params);
    
    // Auto-open modal with first record for testing
    if (mockMovements.data.length > 0) {
      setSelectedMovement(mockMovements.data[0] as InventoryMovement);
      setIsViewModalOpen(true);
    }
  }, []);

  const handleViewMovement = (movement: InventoryMovement) => {
    setSelectedMovement(movement);
    setIsViewModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsViewModalOpen(false);
    setSelectedMovement(null);
  };

  const columns: TableColumn[] = [
    { key: 'id', label: 'ID', sortable: true },
    { 
      key: 'type', 
      label: 'Tipo',
      render: (value: string) => {
        const typeLabels = {
          'IN': 'Entrada',
          'OUT': 'Salida', 
          'TRANSFER': 'Transferencia'
        };
        return typeLabels[value as keyof typeof typeLabels] || value;
      }
    },
    { 
      key: 'status', 
      label: 'Estado',
      render: (value: string) => {
        const statusLabels = {
          'PENDING': 'Pendiente',
          'PROCESSING': 'Procesando',
          'COMPLETED': 'Completado',
          'CANCELLED': 'Cancelado'
        };
        const statusColors = {
          'PENDING': 'text-yellow-600',
          'PROCESSING': 'text-blue-600', 
          'COMPLETED': 'text-green-600',
          'CANCELLED': 'text-red-600'
        };
        const label = statusLabels[value as keyof typeof statusLabels] || value;
        const colorClass = statusColors[value as keyof typeof statusColors] || '';
        
        return <span className={colorClass}>{label}</span>;
      }
    },
    { 
      key: 'createdAt', 
      label: 'Fecha Creación', 
      render: (value: string) => new Date(value).toLocaleString('es-ES')
    },
    { 
      key: 'updatedAt', 
      label: 'Última Actualización', 
      render: (value: string) => new Date(value).toLocaleString('es-ES')
    }
  ];

  const searchFields: SearchField[] = [
    { key: 'id', label: 'ID del Movimiento', type: 'text' },
    { 
      key: 'type', 
      label: 'Tipo', 
      type: 'select',
      options: [
        { value: 'IN', label: 'Entrada' },
        { value: 'OUT', label: 'Salida' },
        { value: 'TRANSFER', label: 'Transferencia' }
      ]
    },
    { 
      key: 'status', 
      label: 'Estado', 
      type: 'select',
      options: [
        { value: 'PENDING', label: 'Pendiente' },
        { value: 'PROCESSING', label: 'Procesando' },
        { value: 'COMPLETED', label: 'Completado' },
        { value: 'CANCELLED', label: 'Cancelado' }
      ]
    },
    { key: 'startDate', label: 'Fecha Inicio', type: 'date' },
    { key: 'endDate', label: 'Fecha Fin', type: 'date' }
  ];

  const handleSearch = (filters: SearchFilters) => {
    setSearchFilters(filters);
    setIsFiltering(true);
    
    const newParams = { 
      ...params, 
      page: 1,
      ...filters
    };
    setParams(newParams);
    
    // In a real scenario, this would call the search API
    // execute(newParams);
    
    // Mock delay to simulate API call
    setTimeout(() => {
      setIsFiltering(false);
    }, 1000);
  };

  const handleAdvancedFilter = async (filters: SearchFilters) => {
    setSearchFilters(filters);
    setIsFiltering(true);
    
    // In a real scenario, this would use the advanced filter
    await advancedFilter(filters);
    
    // Mock delay to simulate API call since we don't have real endpoints
    setTimeout(() => {
      setIsFiltering(false);
    }, 800);
  };

  const handleQuickSearchResults = (results: any) => {
    // Handle quick search results
    console.log('Quick search results:', results);
    setIsFiltering(false);
  };

  const handleQuickSearchError = (error: any) => {
    console.error('Quick search error:', error);
    setIsFiltering(false);
  };

  const clearFilters = () => {
    setSearchFilters({});
    setParams({ page: 1, limit: 10 });
  };

  const handlePageChange = (newPage: number, newLimit: number) => {
    setParams(prev => ({ 
      ...prev, 
      page: newPage, 
      limit: newLimit 
    }));
  };

  // Use mock data since no real endpoint exists
  const displayData = mockMovements;
  const displayError = null; // No error for mock data

  return (
    <PageWrapper title="Movimientos de Inventario">
      <div className="space-y-6">
        <QuickSearch
          entity="inventory-movements"
          placeholder="Búsqueda rápida de movimientos..."
          onResults={handleQuickSearchResults}
          onError={handleQuickSearchError}
        />

        <AdvancedSearchForm
          fields={searchFields}
          onSearch={handleSearch}
          onAdvancedFilter={handleAdvancedFilter}
          onClear={clearFilters}
          loading={loading}
          entityName="movimientos"
          initialFilters={searchFilters}
          isFiltering={isFiltering || filterLoading}
        />

        <ActiveFiltersDisplay
          filters={searchFilters}
          onRemoveFilter={(key) => {
            const newFilters = { ...searchFilters };
            delete newFilters[key];
            handleSearch(newFilters);
          }}
          onClearAll={clearFilters}
        />

        {displayError && (
          <ApiErrorState 
            error={displayError}
            onRetry={() => execute(params)}
          />
        )}

        <DynamicTable<InventoryMovement>
          columns={columns}
          data={displayData?.data || []}
          loading={loading}
          pagination={displayData?.meta}
          onPageChange={handlePageChange}
          emptyMessage="No se encontraron movimientos de inventario"
          actions={[
            {
              label: 'Ver',
              variant: 'primary',
              onClick: handleViewMovement
            }
          ]}
        />

        <InventoryMovementViewModal
          isOpen={isViewModalOpen}
          onClose={handleCloseModal}
          movement={selectedMovement}
        />
      </div>
    </PageWrapper>
  );
}