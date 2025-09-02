'use client';

import { useState } from 'react';
import { authorsUnifiedConfig } from '@/config/dashboard';
import { useUnifiedEntityConfig } from '@/hooks/useUnifiedEntityConfig';
import UnifiedDashboard from '@/components/Dashboard/UnifiedDashboard';
import { SearchFilters } from '@/components/AdvancedSearchForm';

// Mock data for demonstration
const mockAuthors = [
  {
    id: '1',
    name: 'Gabriel García Márquez',
    nationality: 'Colombiana',
    birthYear: 1927,
    isActive: true,
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2', 
    name: 'Isabel Allende',
    nationality: 'Chilena',
    birthYear: 1942,
    isActive: true,
    createdAt: '2024-01-16T10:00:00Z',
  },
  {
    id: '3',
    name: 'Mario Vargas Llosa',
    nationality: 'Peruana',
    birthYear: 1936,
    isActive: false,
    createdAt: '2024-01-17T10:00:00Z',
  },
];

/**
 * Authors Page - Example Implementation using Unified Architecture
 * 
 * This example demonstrates how the new unified configuration ensures that:
 * 1. Table columns and search fields are exactly the same
 * 2. Field types, labels, and behaviors are consistent
 * 3. No manual synchronization is required
 * 4. Changes to fields automatically apply to both table and search
 */
export default function AuthorsUnifiedExample() {
  const [authors, setAuthors] = useState(mockAuthors);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilters, setActiveFilters] = useState<SearchFilters>({});

  // Get configuration using the unified hook
  const { tableConfig, searchConfig, uiConfig } = useUnifiedEntityConfig(authorsUnifiedConfig);

  const handleSearch = (filters: SearchFilters) => {
    setLoading(true);
    setActiveFilters(filters);
    
    // Simulate API call
    setTimeout(() => {
      // Filter mock data based on search criteria
      const filteredAuthors = mockAuthors.filter(author => {
        if (filters.name && !author.name.toLowerCase().includes(filters.name.toLowerCase())) {
          return false;
        }
        if (filters.nationality && !author.nationality.toLowerCase().includes(filters.nationality.toLowerCase())) {
          return false;
        }
        if (filters.birthYear && author.birthYear !== parseInt(filters.birthYear as string)) {
          return false;
        }
        if (filters.isActive !== undefined && author.isActive !== (filters.isActive === 'true')) {
          return false;
        }
        return true;
      });
      
      setAuthors(filteredAuthors);
      setLoading(false);
    }, 1000);
  };

  const handleAdvancedFilter = (filters: SearchFilters) => {
    handleSearch(filters); // Same logic for this example
  };

  const handleClearFilters = () => {
    setActiveFilters({});
    setAuthors(mockAuthors);
  };

  const handleView = (author: any) => {
    alert(`Ver detalles de: ${author.name}`);
  };

  const handleEdit = (author: any) => {
    alert(`Editar autor: ${author.name}`);
  };

  const handleCreate = () => {
    alert('Crear nuevo autor');
  };

  const handleDelete = (author: any) => {
    if (confirm(`¿Eliminar autor ${author.name}?`)) {
      setAuthors(prev => prev.filter(a => a.id !== author.id));
    }
  };

  const handleSort = (field: string, direction: 'ASC' | 'DESC') => {
    const sortedAuthors = [...authors].sort((a, b) => {
      const aValue = a[field as keyof typeof a];
      const bValue = b[field as keyof typeof b];
      
      if (direction === 'ASC') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
    
    setAuthors(sortedAuthors);
  };

  return (
    <div className="authors-page">
      {/* Demonstration Panel */}
      <div className="demo-panel bg-blue-50 p-4 mb-6 rounded-lg border">
        <h2 className="text-lg font-semibold mb-2 text-blue-800">
          🎯 Demostración de Arquitectura Unificada
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h3 className="font-medium text-blue-700">Campos de Tabla:</h3>
            <ul className="list-disc list-inside text-blue-600">
              {tableConfig.columns.map(col => (
                <li key={col.key}>{col.label} ({col.type})</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-blue-700">Campos de Búsqueda:</h3>
            <ul className="list-disc list-inside text-blue-600">
              {searchConfig.searchFields.map(field => (
                <li key={field.key}>{field.label} ({field.type})</li>
              ))}
            </ul>
          </div>
        </div>
        <p className="mt-3 text-blue-700 font-medium">
          ✅ Los campos son idénticos porque provienen de la misma configuración unificada
        </p>
      </div>

      {/* Unified Dashboard Component */}
      <UnifiedDashboard
        config={authorsUnifiedConfig}
        data={authors}
        loading={loading}
        totalPages={1}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onSort={handleSort}
        onSearch={handleSearch}
        onAdvancedFilter={handleAdvancedFilter}
        onClearFilters={handleClearFilters}
        onView={handleView}
        onEdit={handleEdit}
        onCreate={handleCreate}
        onDelete={handleDelete}
      />

      {/* Configuration Preview */}
      <details className="mt-8 bg-gray-50 p-4 rounded-lg">
        <summary className="cursor-pointer font-medium text-gray-700">
          🔍 Ver Configuración Unificada (para desarrolladores)
        </summary>
        <pre className="mt-2 text-xs overflow-auto bg-white p-4 rounded border">
          {JSON.stringify(authorsUnifiedConfig, null, 2)}
        </pre>
      </details>
    </div>
  );
}

/*
BENEFICIOS DE LA NUEVA ARQUITECTURA:

✅ GARANTÍA DE SINCRONIZACIÓN:
- Los campos de tabla y búsqueda provienen de la misma configuración
- No es posible que estén desincronizados
- Un cambio en la configuración afecta automáticamente ambos

✅ REUTILIZACIÓN:
- La misma configuración funciona para todos los dashboards
- Patrón consistente para todas las entidades
- Fácil mantenimiento y escalabilidad

✅ TIPADO FUERTE:
- TypeScript garantiza la consistencia de tipos
- Prevención de errores en tiempo de compilación
- IntelliSense completo en el IDE

✅ MEJORES PRÁCTICAS NEXT.JS:
- Separación clara de configuración y lógica
- Componentes reutilizables y mantenibles
- Arquitectura escalable
*/