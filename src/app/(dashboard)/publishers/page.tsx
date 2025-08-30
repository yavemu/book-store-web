'use client';

import { useEffect, useState } from 'react';
import { useApiRequest } from '@/hooks';
import { publishingHousesApi, PublishingHouseListParams } from '@/services/api/entities/publishing-houses';
import DynamicTable, { TableColumn, PaginationMeta } from '@/components/DynamicTable';
import PageWrapper from '@/components/PageWrapper';
import InlineForm from '@/components/InlineForm';
import ApiErrorState from '@/components/ErrorStates/ApiErrorState';
import AdvancedSearchForm, { SearchField, SearchFilters } from '@/components/AdvancedSearchForm';
import ActiveFiltersDisplay from '@/components/ActiveFiltersDisplay';

export default function PublishersPage() {
  const [params, setParams] = useState<PublishingHouseListParams>({ page: 1, limit: 10 });
  const [searchTerm, setSearchTerm] = useState('');
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({});
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  const { loading, error, data, execute } = useApiRequest({
    endpoint: '/publishing-houses',
    method: 'GET',
    onSuccess: (response) => {
      console.log('Publishers loaded:', response);
    },
    onError: (error) => {
      console.error('Error loading publishers:', error);
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
    // Implementar búsqueda con debounce
  };

  const handleCreateClick = () => {
    setIsEditing(false);
    setEditingRecord(null);
    setShowForm(!showForm);
  };

  const handleEditClick = (record: any) => {
    setIsEditing(true);
    setEditingRecord(record);
    setShowForm(true);
  };

  const handleFormSubmit = (data: any) => {
    console.log('Form submitted:', data, { isEditing, editingRecord });
    // Aquí implementarías la lógica de crear/editar
    setShowForm(false);
    setIsEditing(false);
    setEditingRecord(null);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setIsEditing(false);
    setEditingRecord(null);
  };

  const columns: TableColumn[] = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Nombre' },
    { key: 'country', label: 'País' },
    { key: 'website', label: 'Sitio Web' },
    { 
      key: 'foundedYear', 
      label: 'Año Fundación',
      render: (value) => value || '-'
    },
    { 
      key: 'createdAt', 
      label: 'Creado',
      render: (value) => new Date(value).toLocaleDateString()
    }
  ];

  // Advanced Search Fields for Publishers
  const searchFields: SearchField[] = [
    {
      key: 'name',
      label: 'Nombre',
      type: 'text',
      placeholder: 'Buscar por nombre...'
    },
    {
      key: 'country',
      label: 'País',
      type: 'text',
      placeholder: 'Buscar por país...'
    },
    {
      key: 'website',
      label: 'Sitio Web',
      type: 'text',
      placeholder: 'Buscar por sitio web...'
    },
    {
      key: 'foundedYear',
      label: 'Año Fundación',
      type: 'number',
      placeholder: 'Año de fundación...'
    }
  ];

  const formFields = [
    {
      key: 'name',
      label: 'Nombre de la Editorial',
      type: 'text' as const,
      required: true
    },
    {
      key: 'country',
      label: 'País',
      type: 'text' as const,
      required: false
    },
    {
      key: 'website',
      label: 'Sitio Web',
      type: 'text' as const,
      required: false
    },
    {
      key: 'foundedYear',
      label: 'Año de Fundación',
      type: 'number' as const,
      required: false
    }
  ];

  const handleAdvancedSearch = (filters: SearchFilters) => {
    setSearchFilters(filters);
    // Here you would typically update the API params with the search filters
    console.log('Advanced search filters:', filters);
    // Reset to page 1 when new search is applied
    setParams({ ...params, page: 1 });
    // TODO: Add filters to API request
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

  if (error) {
    const canRetry = error.includes('conexión') || error.includes('servidor') || error.includes('NetworkError') || error.includes('Failed to fetch');
    
    return (
      <PageWrapper title="Editoriales">
        <ApiErrorState
          error={error}
          canRetry={canRetry}
          isRetrying={loading}
          onRetry={() => execute()}
          onReset={() => {
            setParams({ page: 1, limit: 10 });
            setSearchTerm('');
            execute();
          }}
          title="Error cargando editoriales"
          description="No se pudieron cargar las editoriales del sistema."
          showTechnicalDetails={true}
        />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper 
      title="Gestión de Editoriales"
      breadcrumbs={['Editoriales']}
      showSearch
      onSearchChange={handleSearchChange}
      searchPlaceholder="Buscar editoriales..."
    >
      {/* Advanced Search Form */}
      <AdvancedSearchForm
        fields={searchFields}
        onSearch={handleAdvancedSearch}
        onClear={handleClearAdvancedSearch}
        loading={loading}
        entityName="editoriales"
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
        showCreateButton
        onFormToggle={handleCreateClick}
        onEditClick={handleEditClick}
        createButtonLabel="🔸 Crear editorial"
        entityName="editorial"
        showForm={showForm}
        isEditing={isEditing}
        editingRecord={editingRecord}
        formComponent={
          <InlineForm
            fields={formFields}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
            title={isEditing ? 'Editar Editorial' : 'Nueva Editorial'}
            submitLabel={isEditing ? 'Actualizar' : 'Crear'}
            initialData={editingRecord || {}}
          />
        }
      />
    </PageWrapper>
  );
}