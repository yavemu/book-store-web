'use client';

import { useEffect, useState } from 'react';
import { useApiRequest } from '@/hooks';
import { usersApi, UserListParams } from '@/services/api/entities/users';
import DynamicTable, { TableColumn, PaginationMeta } from '@/components/DynamicTable';
import PageWrapper from '@/components/PageWrapper';
import ApiErrorState from '@/components/ErrorStates/ApiErrorState';
import AdvancedSearchForm, { SearchField, SearchFilters } from '@/components/AdvancedSearchForm';
import ActiveFiltersDisplay from '@/components/ActiveFiltersDisplay';
import BookMovementsModal from '@/components/BookMovementsModal';

export default function UsersPage() {
  const [params, setParams] = useState<UserListParams>({ page: 1, limit: 10 });
  const [searchTerm, setSearchTerm] = useState('');
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({});
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isMovementsModalOpen, setIsMovementsModalOpen] = useState(false);
  const [hasActiveFilters, setHasActiveFilters] = useState(false);

  const { loading, error, data, execute } = useApiRequest({
    endpoint: '/users',
    method: 'GET',
    onSuccess: (response) => {
      console.log('Users loaded:', response);
    },
    onError: (error) => {
      console.error('Error loading users:', error);
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
    
    // Check if any filters are active
    const hasSearch = value && value.trim() !== '';
    const hasFilters = Object.values(searchFilters).some(filterValue => filterValue && filterValue !== '');
    setHasActiveFilters(hasSearch || hasFilters);
    
    // Implementar búsqueda con debounce
  };

  const handleCreateUser = () => {
    console.log('Crear usuario');
  };

  const handleEditUser = (record: any) => {
    console.log('Editar usuario:', record);
  };

  const handleViewMovements = (user: any) => {
    setSelectedUser(user);
    setIsMovementsModalOpen(true);
  };

  const handleCloseMovementsModal = () => {
    setIsMovementsModalOpen(false);
    setSelectedUser(null);
  };

  const handleDownloadCSV = () => {
    if (!hasActiveFilters) return;
    
    // Create query parameters from current filters and search
    const queryParams = new URLSearchParams();
    
    // Add search filters
    Object.entries(searchFilters).forEach(([key, value]) => {
      if (value && value !== '') {
        queryParams.append(key, value.toString());
      }
    });

    // Add search term if exists
    if (searchTerm && searchTerm.trim() !== '') {
      queryParams.append('search', searchTerm.trim());
    }

    // Call CSV export endpoint
    const csvEndpoint = `/users/export/csv?${queryParams.toString()}`;
    console.log('Downloading CSV with filters:', csvEndpoint);
    
    // TODO: Implement actual CSV download
    // This would typically trigger a download via the API
    alert(`CSV download would be triggered for: ${csvEndpoint}`);
  };

  // Advanced Search Fields for Users
  const searchFields: SearchField[] = [
    {
      key: 'username',
      label: 'Usuario',
      type: 'text',
      placeholder: 'Buscar por usuario...'
    },
    {
      key: 'email',
      label: 'Email',
      type: 'email',
      placeholder: 'Buscar por email...'
    },
    {
      key: 'role',
      label: 'Rol',
      type: 'select',
      options: [
        { value: 'ADMIN', label: 'Administrador' },
        { value: 'USER', label: 'Usuario' }
      ]
    },
    {
      key: 'isActive',
      label: 'Estado',
      type: 'select',
      options: [
        { value: 'true', label: 'Activo' },
        { value: 'false', label: 'Inactivo' }
      ]
    }
  ];

  const handleAdvancedSearch = (filters: SearchFilters) => {
    setSearchFilters(filters);
    console.log('Advanced search filters for users:', filters);
    setParams({ ...params, page: 1 });
    
    // Check if any filters are active
    const hasFilters = Object.values(filters).some(value => value && value !== '');
    const hasSearch = searchTerm && searchTerm.trim() !== '';
    setHasActiveFilters(hasFilters || hasSearch);
    
    // TODO: Add filters to API request
  };

  const handleClearAdvancedSearch = () => {
    setSearchFilters({});
    setSearchTerm('');
    setParams({ page: 1, limit: 10 });
    setHasActiveFilters(false);
    // TODO: Clear filters from API request
  };

  const handleRemoveFilter = (key: string) => {
    const newFilters = { ...searchFilters };
    delete newFilters[key];
    setSearchFilters(newFilters);
    
    // Check if any filters are still active
    const hasFilters = Object.values(newFilters).some(value => value && value !== '');
    const hasSearch = searchTerm && searchTerm.trim() !== '';
    setHasActiveFilters(hasFilters || hasSearch);
    
    // TODO: Update API request without this filter
  };

  const columns: TableColumn[] = [
    { key: 'id', label: 'ID' },
    { key: 'username', label: 'Usuario' },
    { key: 'email', label: 'Email' },
    { 
      key: 'isActive', 
      label: 'Estado',
      render: (value) => value ? 'Activo' : 'Inactivo'
    },
    { 
      key: 'createdAt', 
      label: 'Creado',
      render: (value) => new Date(value).toLocaleDateString()
    }
  ];

  const actions = [
    {
      label: 'Ver Movimientos',
      onClick: handleViewMovements,
      variant: 'secondary' as const
    },
    {
      label: 'Editar',
      onClick: handleEditUser,
      variant: 'secondary' as const
    }
  ];

  if (error) {
    return (
      <PageWrapper title="Usuarios">
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
          title="Error cargando usuarios"
          description="No se pudieron cargar los usuarios del sistema."
          showTechnicalDetails={true}
        />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper 
      title="Gestión de Usuarios"
      breadcrumbs={['Usuarios']}
      showSearch
      onSearchChange={handleSearchChange}
      searchPlaceholder="Buscar usuarios..."
      showCsvDownload
      onCsvDownload={handleDownloadCSV}
      csvDownloadEnabled={hasActiveFilters}
    >
      {/* Advanced Search Form */}
      <AdvancedSearchForm
        fields={searchFields}
        onSearch={handleAdvancedSearch}
        onClear={handleClearAdvancedSearch}
        loading={loading}
        entityName="usuarios"
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
        actions={actions}
        showCreateButton
        onCreateClick={handleCreateUser}
        entityName="usuario"
      />

      {/* Modal de Movimientos de Inventario */}
      <BookMovementsModal
        isOpen={isMovementsModalOpen}
        onClose={handleCloseMovementsModal}
        book={selectedUser}
      />
    </PageWrapper>
  );
}