'use client';

import DynamicTable, { PaginationMeta, TableColumn } from "@/components/DynamicTable";
import PageWrapper from "@/components/PageWrapper";
import ApiErrorState from '@/components/ErrorStates/ApiErrorState';
import AdvancedSearchForm, { SearchField, SearchFilters } from '@/components/AdvancedSearchForm';
import ActiveFiltersDisplay from '@/components/ActiveFiltersDisplay';
import { useApiRequest } from "@/hooks";
import { auditApi, AuditListParams } from "@/services/api/entities/audit";
import { useEffect, useState } from "react";

export default function AuditPage() {
  const [params, setParams] = useState<AuditListParams>({ page: 1, limit: 10 });
  const [searchTerm, setSearchTerm] = useState('');
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({});

  const { loading, error, data, execute } = useApiRequest({
    apiFunction: () => auditApi.list(params),
    onSuccess: (response) => {
      console.log('Audit logs loaded:', response);
    },
    onError: (error) => {
      console.error('Error loading audit logs:', error);
    }
  });

  useEffect(() => {
    execute();
  }, [params]);

  const handlePageChange = (page: number) => {
    setParams({ ...params, page });
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    
    // Implementar búsqueda con debounce si hay texto
    if (value && value.trim().length >= 3) {
      // Use quick filter for real-time search
      auditApi.filter({ filter: value.trim(), page: 1, limit: params.limit }).then(response => {
        console.log('Quick filter response:', response);
      }).catch(error => {
        console.error('Quick filter error:', error);
      });
    }
  };

  // Advanced Search Fields for Audit
  const searchFields: SearchField[] = [
    {
      key: 'action',
      label: 'Acción',
      type: 'text',
      placeholder: 'Buscar por acción...'
    },
    {
      key: 'entityType',
      label: 'Tipo Entidad',
      type: 'select',
      options: [
        { value: 'user', label: 'Usuario' },
        { value: 'book', label: 'Libro' },
        { value: 'author', label: 'Autor' },
        { value: 'genre', label: 'Género' }
      ]
    },
    {
      key: 'entityId',
      label: 'ID Entidad',
      type: 'text',
      placeholder: 'ID de la entidad...'
    },
    {
      key: 'userId',
      label: 'Usuario ID',
      type: 'text',
      placeholder: 'ID del usuario...'
    },
    {
      key: 'startDate',
      label: 'Fecha Inicio',
      type: 'date',
      placeholder: 'Fecha inicio...'
    },
    {
      key: 'endDate',
      label: 'Fecha Fin',
      type: 'date',
      placeholder: 'Fecha fin...'
    }
  ];

  const handleAdvancedSearch = (filters: SearchFilters) => {
    setSearchFilters(filters);
    console.log('Advanced search filters for audit:', filters);
    
    const newParams = { ...params, page: 1 };
    setParams(newParams);
    
    // Execute advanced filter API call if there are filters
    const hasFilters = Object.values(filters).some(value => value && value !== '');
    if (hasFilters) {
      const filterData = {
        userId: filters.userId as string,
        entityType: filters.entityType as string,
        action: filters.action as string,
        startDate: filters.startDate as string,
        endDate: filters.endDate as string,
      };
      
      auditApi.advancedFilter(filterData, newParams).then(response => {
        console.log('Advanced filter response:', response);
      }).catch(error => {
        console.error('Advanced filter error:', error);
      });
    }
  };

  const handleClearAdvancedSearch = () => {
    setSearchFilters({});
    setParams({ page: 1, limit: 10 });
    // TODO: Clear filters from API request
  };

  const handleRemoveFilter = (key: string) => {
    const newFilters = { ...searchFilters };
    delete newFilters[key];
    setSearchFilters(newFilters);
    // TODO: Update API request without this filter
  };

  const columns: TableColumn[] = [
    { key: 'id', label: 'ID' },
    { key: 'action', label: 'Acción' },
    { key: 'entityType', label: 'Tipo Entidad' },
    { key: 'entityId', label: 'ID Entidad' },
    { key: 'userId', label: 'Usuario ID' },
    { 
      key: 'details', 
      label: 'Detalles',
      render: (value) => value ? JSON.stringify(value).substring(0, 50) + '...' : '-'
    },
    { 
      key: 'createdAt', 
      label: 'Fecha',
      render: (value) => new Date(value).toLocaleString()
    }
  ];

  if (error) {
    return (
      <PageWrapper title="Auditoría">
        <ApiErrorState
          error={error}
          canRetry={error.includes('conexión') || error.includes('servidor') || error.includes('NetworkError') || error.includes('Failed to fetch')}
          isRetrying={loading}
          onRetry={() => execute()}
          onReset={() => {
            setParams({ page: 1, limit: 10 });
            setSearchTerm('');
            execute();
          }}
          title="Error cargando auditoría"
          description="No se pudieron cargar los registros de auditoría del sistema."
          showTechnicalDetails={true}
        />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper 
      title="Logs de Auditoría"
      breadcrumbs={['Auditoría']}
      showSearch
      onSearchChange={handleSearchChange}
      searchPlaceholder="Buscar en logs..."
      showCsvDownload
      onCsvDownload={async () => {
        try {
          const csvData = await auditApi.exportToCsv();
          const blob = new Blob([csvData], { type: 'text/csv' });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `auditoria_${new Date().toISOString().split('T')[0]}.csv`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        } catch (error) {
          console.error('Error downloading CSV:', error);
          alert('Error al descargar el archivo CSV');
        }
      }}
      csvDownloadEnabled={true}
    >
      {/* Advanced Search Form */}
      <AdvancedSearchForm
        fields={searchFields}
        onSearch={handleAdvancedSearch}
        onClear={handleClearAdvancedSearch}
        loading={loading}
        entityName="logs de auditoría"
        initialFilters={searchFilters}
      />

      {/* Active Filters Display */}
      <ActiveFiltersDisplay
        filters={searchFilters}
        searchFields={searchFields}
        tableColumns={columns}
        onRemoveFilter={handleRemoveFilter}
        onClearAll={handleClearAdvancedSearch}
      />

      <DynamicTable
        data={data?.data || []}
        columns={columns}
        meta={data?.meta as PaginationMeta}
        loading={loading}
        onPageChange={handlePageChange}
        actions={[]} // Sin acciones de editar/crear para logs de auditoría
        showCreateButton={false}
        entityName="log"
      />
    </PageWrapper>
  );
}