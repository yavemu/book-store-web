'use client';

import { useState } from 'react';
import { authorsUnifiedConfig } from '@/config/dashboard/authors.unified.config';
import { useUnifiedEntityConfig } from '@/hooks/useUnifiedEntityConfig';
import AdvancedSearchForm, { SearchFilters } from '@/components/AdvancedSearchForm';
import TruncatedText, { StatusBadge, NumberBadge } from '@/components/Table/TruncatedText';

// Mock data que replica exactamente el problema mostrado en la imagen
const mockAuthorsWithLongNames = [
  {
    id: '1',
    name: 'Author ban4lq 175678869329 Last ban4lq 175678869329 Very Long Name That Causes Table Issues',
    nationality: 'Colombian',
    birthDate: '1979-12-31',
    booksCount: 0,
    isActive: false,
  },
  {
    id: '2',
    name: 'Author uz2buq 175678245078 Last uz2buq 175678245078 Another Super Long Name',
    nationality: 'Colombian', 
    birthDate: '1979-12-31',
    booksCount: 0,
    isActive: false,
  },
  {
    id: '3',
    name: 'Gabriel García Márquez',
    nationality: 'Colombian',
    birthDate: '1927-03-05',
    booksCount: 15,
    isActive: true,
  },
  {
    id: '4',
    name: 'Author nocdb 175678170047 Last nocdb 175678170047 Yet Another Very Long Name That Breaks Layout',
    nationality: 'Colombian',
    birthDate: '1979-12-31',
    booksCount: 0,
    isActive: false,
  },
  {
    id: '5',
    name: 'Elena ux0 Cortázar nyú',
    nationality: 'Spanish',
    birthDate: '1969-12-31',
    booksCount: 8,
    isActive: true,
  },
];

/**
 * Demo page showing the FIXED table alignment
 * This addresses the issue where long text in columns was causing header misalignment
 */
export default function AuthorsFixedAlignmentPage() {
  const [authors, setAuthors] = useState(mockAuthorsWithLongNames);
  const [filters, setFilters] = useState<SearchFilters>({});
  
  const { tableConfig, searchConfig, uiConfig } = useUnifiedEntityConfig(authorsUnifiedConfig);

  const handleSearch = (searchFilters: SearchFilters) => {
    setFilters(searchFilters);
    console.log('Búsqueda con filtros:', searchFilters);
  };

  const handleClear = () => {
    setFilters({});
    setAuthors(mockAuthorsWithLongNames);
  };

  return (
    <div className="p-6 max-w-full">
      {/* Header with solution explanation */}
      <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-400 rounded-lg">
        <h1 className="text-2xl font-bold text-green-800 mb-2">
          ✅ Problema de Alineación de Tabla - SOLUCIONADO
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-green-700">
          <div>
            <h3 className="font-semibold">Problema Anterior:</h3>
            <ul className="list-disc list-inside">
              <li>Texto largo expandía las columnas</li>
              <li>Cabeceras se desalineaban</li>
              <li>Layout responsive roto</li>
              <li>Experiencia de usuario pobre</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold">Solución Implementada:</h3>
            <ul className="list-disc list-inside">
              <li>Anchos fijos para todas las columnas</li>
              <li>Truncado de texto con tooltips</li>
              <li>Alineación consistente</li>
              <li>Componentes reutilizables</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Search form - using unified configuration */}
      <div className="mb-6">
        <AdvancedSearchForm
          unifiedFields={authorsUnifiedConfig.fields}
          onSearch={handleSearch}
          onClear={handleClear}
          entityName={uiConfig.entityNamePlural}
          initialFilters={filters}
        />
      </div>

      {/* Column configuration summary */}
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
        <h3 className="font-semibold text-blue-800 mb-2">Configuración de Columnas:</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs text-blue-700">
          {tableConfig.columns.map(col => (
            <div key={col.key} className="bg-white p-2 rounded border">
              <div className="font-medium">{col.label}</div>
              <div>Ancho: {col.width}</div>
              <div>Align: {col.align || 'left'}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Fixed table with proper alignment */}
      <div className="bg-white border border-gray-200 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {tableConfig.columns.map((column) => (
                  <th
                    key={column.key}
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 last:border-r-0"
                    style={{ 
                      width: column.width,
                      minWidth: column.width,
                      maxWidth: column.width 
                    }}
                  >
                    <div className={`flex items-center ${column.align === 'center' ? 'justify-center' : column.align === 'right' ? 'justify-end' : 'justify-start'}`}>
                      {column.label}
                      {column.sortable && (
                        <span className="ml-1 text-gray-400 cursor-pointer hover:text-gray-600">⇅</span>
                      )}
                    </div>
                  </th>
                ))}
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {authors.map((author, index) => (
                <tr key={author.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  {tableConfig.columns.map((column) => {
                    const value = author[column.key as keyof typeof author];
                    
                    return (
                      <td 
                        key={column.key} 
                        className={`px-4 py-4 border-r border-gray-100 last:border-r-0 ${
                          column.align === 'center' ? 'text-center' : 
                          column.align === 'right' ? 'text-right' : 'text-left'
                        }`}
                        style={{ 
                          width: column.width,
                          minWidth: column.width,
                          maxWidth: column.width 
                        }}
                      >
                        <div className="text-sm text-gray-900">
                          {column.render ? column.render(value, author) : (value || '-')}
                        </div>
                      </td>
                    );
                  })}
                  <td className="px-4 py-4 text-center">
                    <div className="flex justify-center space-x-1">
                      <button className="bg-gray-600 hover:bg-gray-700 text-white px-2 py-1 rounded text-xs">
                        Ver
                      </button>
                      <button className="bg-yellow-600 hover:bg-yellow-700 text-white px-2 py-1 rounded text-xs">
                        Editar
                      </button>
                      <button className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs">
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Solution summary */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-green-50 border border-green-200 rounded">
          <h3 className="font-semibold text-green-800 mb-2">✅ Beneficios de la Solución:</h3>
          <ul className="text-sm text-green-700 list-disc list-inside space-y-1">
            <li>Cabeceras siempre alineadas con el contenido</li>
            <li>Texto largo se trunca con tooltips informativos</li>
            <li>Layout consistente en todas las resoluciones</li>
            <li>Componentes reutilizables para otros dashboards</li>
            <li>Configuración unificada entre tabla y búsqueda</li>
          </ul>
        </div>
        <div className="p-4 bg-blue-50 border border-blue-200 rounded">
          <h3 className="font-semibold text-blue-800 mb-2">🛠️ Implementación Técnica:</h3>
          <ul className="text-sm text-blue-700 list-disc list-inside space-y-1">
            <li>Anchos fijos: <code>width, minWidth, maxWidth</code></li>
            <li>Truncado CSS: <code>truncate, max-w-[Npx]</code></li>
            <li>Tooltips nativos: <code>title</code> attribute</li>
            <li>Componentes utilitarios: <code>TruncatedText, StatusBadge</code></li>
            <li>Configuración centralizada en <code>unified-config.ts</code></li>
          </ul>
        </div>
      </div>
    </div>
  );
}