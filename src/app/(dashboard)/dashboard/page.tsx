'use client';

import { useEffect, useState } from 'react';
import { useAppSelector } from '@/store/hooks';
import { auditApi, AuditListParams, AuditLogListResponse } from '@/services/api/entities/audit';
import DynamicTable, { TableColumn, PaginationMeta } from '@/components/DynamicTable';
import PageWrapper from '@/components/PageWrapper';
import ApiErrorState from '@/components/ErrorStates/ApiErrorState';
import ApiHealthIndicator from '@/components/ApiHealthIndicator';
import { useApiHealth } from '@/hooks/useApiHealth';

export default function DashboardPage() {
  const { user } = useAppSelector((state) => state.auth);
  const [params, setParams] = useState<AuditListParams>({ page: 1, limit: 10 });
  const [searchTerm, setSearchTerm] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AuditLogListResponse | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  // API Health monitoring
  const { status: apiStatus, checkHealth } = useApiHealth({
    enableAutoCheck: true,
    checkInterval: 30000
  });

  const loadUserAuditHistory = async (isRetryAttempt = false) => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      setError(null);
      if (isRetryAttempt) {
        setIsRetrying(true);
        setRetryCount(prev => prev + 1);
      } else {
        setRetryCount(0);
        setIsRetrying(false);
      }
      
      const auditData = await auditApi.getUserAuditHistory(user.id, params);
      setData(auditData);
      setError(null);
    } catch (err) {
      console.error('Error loading user audit logs:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error loading audit logs';
      setError(errorMessage);
    } finally {
      setLoading(false);
      setIsRetrying(false);
    }
  };

  useEffect(() => {
    loadUserAuditHistory();
  }, [user?.id, params]);

  const handlePageChange = (page: number) => {
    setParams({ ...params, page });
  };

  const handleSearch = async (term: string) => {
    setSearchTerm(term);
    
    if (!term.trim()) {
      // If search is cleared, reload user's regular audit history
      loadUserAuditHistory();
      return;
    }

    // Search with the term
    try {
      setLoading(true);
      setError(null);
      setRetryCount(0);
      setIsRetrying(false);
      
      const searchData = await auditApi.search({ 
        term: term.trim(),
        page: params.page || 1,
        limit: params.limit || 10
      });
      setData(searchData);
    } catch (err) {
      console.error('Error searching audit logs:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error searching audit logs';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    if (searchTerm.trim()) {
      handleSearch(searchTerm);
    } else {
      loadUserAuditHistory(true);
    }
  };

  const handleReset = () => {
    setError(null);
    setData(null);
    setSearchTerm('');
    setRetryCount(0);
    setIsRetrying(false);
  };

  const handleView = (auditLog: any) => {
    console.log('View audit log details:', auditLog);
    // TODO: Implement view details modal or navigation
  };

  const columns: TableColumn[] = [
    {
      key: 'action',
      label: 'Acción',
      sortable: true,
      render: (value) => {
        const actionLabels: Record<string, string> = {
          'CREATE': 'Crear',
          'UPDATE': 'Actualizar', 
          'DELETE': 'Eliminar',
          'LOGIN': 'Iniciar Sesión',
          'REGISTER': 'Registrarse'
        };
        return actionLabels[value] || value;
      }
    },
    {
      key: 'entityType',
      label: 'Entidad',
      sortable: true
    },
    {
      key: 'entityId', 
      label: 'ID Entidad',
      sortable: false,
      render: (value) => value ? value.substring(0, 8) + '...' : 'N/A'
    },
    {
      key: 'details',
      label: 'Detalles',
      sortable: false,
      render: (value) => {
        if (!value) return 'N/A';
        const details = typeof value === 'string' ? value : JSON.stringify(value);
        return details.length > 50 ? details.substring(0, 50) + '...' : details;
      }
    },
    {
      key: 'createdAt',
      label: 'Fecha',
      sortable: true,
      render: (value) => value ? new Date(value).toLocaleString() : 'N/A'
    }
  ];

  const actions = [
    {
      label: 'Ver Detalle',
      onClick: handleView,
      variant: 'primary' as const
    }
  ];

  if (!user?.id) {
    return (
      <PageWrapper title="Dashboard" breadcrumbs={['Dashboard']}>
        <div style={{
          textAlign: 'center',
          padding: '40px 20px',
          color: '#6c757d'
        }}>
          <h2 style={{ marginBottom: '16px', color: '#495057' }}>
            Bienvenido al Dashboard
          </h2>
          <p>Cargando información del usuario...</p>
        </div>
      </PageWrapper>
    );
  }

  if (error) {
    const canRetry = error.includes('conexión') || error.includes('servidor') || error.includes('network') || error.includes('Failed to fetch');
    
    return (
      <PageWrapper title="Dashboard" breadcrumbs={['Dashboard']}>
        <div style={{ position: 'relative' }}>
          <ApiHealthIndicator 
            showDetails={true} 
            position="static"
            onHealthChange={(isHealthy) => {
              if (isHealthy && error) {
                // API is back online, retry automatically
                setTimeout(handleRetry, 1000);
              }
            }}
          />
          
          <ApiErrorState
            error={error}
            canRetry={canRetry}
            isRetrying={isRetrying}
            retryCount={retryCount}
            maxRetries={3}
            onRetry={handleRetry}
            onReset={handleReset}
            showTechnicalDetails={true}
          />
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper 
      title="Dashboard" 
      breadcrumbs={['Dashboard']}
      onSearch={handleSearch}
      searchPlaceholder="Buscar en historial de actividad..."
    >
      <div style={{ position: 'relative' }}>
        {/* API Health Indicator */}
        <div style={{ 
          position: 'absolute', 
          top: '0', 
          right: '0', 
          zIndex: 10 
        }}>
          <ApiHealthIndicator showDetails={true} position="static" />
        </div>

        <div style={{ marginBottom: '20px', marginRight: '200px' }}>
          <h3 style={{ color: '#495057', marginBottom: '8px' }}>
            Mi Historial de Actividad
          </h3>
          <p style={{ color: '#6c757d', fontSize: '14px' }}>
            Registro de todas tus acciones en el sistema
          </p>
          
          {/* Status indicator */}
          {!apiStatus.isHealthy && (
            <div style={{
              backgroundColor: '#fff3cd',
              border: '1px solid #ffeaa7',
              borderRadius: '6px',
              padding: '8px 12px',
              marginTop: '12px',
              fontSize: '14px',
              color: '#856404',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span>⚠️</span>
              <span>La conexión con el servidor es inestable. Los datos pueden no estar actualizados.</span>
            </div>
          )}
        </div>
        
        <DynamicTable
          data={data?.data || []}
          columns={columns}
          meta={data?.meta}
          loading={loading}
          onPageChange={handlePageChange}
          actions={actions}
          showCreateButton={false}
          entityName="registro de auditoría"
        />
      </div>
    </PageWrapper>
  );
}