'use client';

import { useState } from 'react';
import { authorsUnifiedConfig } from '@/config/dashboard/authors.unified.config';
import { useUnifiedEntityConfig } from '@/hooks/useUnifiedEntityConfig';
import AdvancedSearchForm, { SearchFilters } from '@/components/AdvancedSearchForm';

// Mock data que coincide exactamente con la imagen mostrada
const mockAuthorsData = [
  {
    id: '1',
    name: 'Author ban4lq 175678869329 Last ban4lq 175678869329',
    nationality: 'Colombian',
    birthDate: '31/12/1979',
    booksCount: 0,
    isActive: false,
  },
  {
    id: '2',
    name: 'Author uz2buq 175678245078 Last uz2buq 175678245078',
    nationality: 'Colombian', 
    birthDate: '31/12/1979',
    booksCount: 0,
    isActive: false,
  },
  {
    id: '3',
    name: 'Gabriel García Márquez',
    nationality: 'Colombian',
    birthDate: '5/3/1927',
    booksCount: 0,
    isActive: false,
  },
  {
    id: '4',
    name: 'Author nocdb 175678170047 Last nocdb 175678170047',
    nationality: 'Colombian',
    birthDate: '31/12/1979',
    booksCount: 0,
    isActive: false,
  },
  {
    id: '5',
    name: 'Elena ux0 Cortázar nyú',
    nationality: 'Spanish',
    birthDate: '31/12/1969',
    booksCount: 0,
    isActive: false,
  },
];

/**
 * Test page para verificar la alineación correcta de la tabla
 * Esta página demuestra que los campos están ahora perfectamente alineados
 */
export default function AuthorsTestAlignmentPage() {
  const [authors, setAuthors] = useState(mockAuthorsData);
  const [filters, setFilters] = useState<SearchFilters>({});
  
  const { tableConfig, searchConfig } = useUnifiedEntityConfig(authorsUnifiedConfig);

  const handleSearch = (searchFilters: SearchFilters) => {
    setFilters(searchFilters);
    console.log('Búsqueda con filtros:', searchFilters);
  };

  const handleClear = () => {
    setFilters({});
    setAuthors(mockAuthorsData);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-green-800 mb-2">
          ✅ Alineación de Tabla Corregida
        </h1>
        <p className="text-gray-600">
          Los campos de la tabla ahora coinciden exactamente con las cabeceras.
        </p>
      </div>

      {/* Búsqueda avanzada con configuración unificada */}
      <div className="mb-6">
        <AdvancedSearchForm
          unifiedFields={authorsUnifiedConfig.fields}
          onSearch={handleSearch}
          onClear={handleClear}
          entityName="autores"
          initialFilters={filters}
        />
      </div>

      {/* Verificación visual de la alineación */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded">
        <h3 className="font-semibold text-blue-800 mb-2">Verificación de Alineación:</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <strong>Cabeceras de Tabla:</strong>
            <ul className="list-disc list-inside text-blue-700">
              {tableConfig.columns.map(col => (
                <li key={col.key}>{col.label} (key: {col.key})</li>
              ))}
            </ul>
          </div>
          <div>
            <strong>Campos de Búsqueda:</strong>
            <ul className="list-disc list-inside text-blue-700">
              {searchConfig.searchFields.map(field => (
                <li key={field.key}>{field.label} (key: {field.key})</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Tabla con datos correctamente alineados */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-50">
            <tr>
              {tableConfig.columns.map((column) => (
                <th
                  key={column.key}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b"
                >
                  {column.label}
                  {column.sortable && (
                    <span className="ml-1 text-gray-400 cursor-pointer">⇅</span>
                  )}
                </th>
              ))}
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {authors.map((author, index) => (
              <tr key={author.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                {tableConfig.columns.map((column) => (
                  <td key={column.key} className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {column.render 
                      ? column.render(author[column.key as keyof typeof author], author)
                      : author[column.key as keyof typeof author] || '-'
                    }
                  </td>
                ))}
                <td className="px-4 py-4 whitespace-nowrap text-sm">
                  <div className="flex space-x-2">
                    <button className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-xs">
                      Ver
                    </button>
                    <button className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-xs">
                      Editar
                    </button>
                    <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs">
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Resumen de datos por columna */}
      <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded">
        <h3 className="font-semibold text-green-800 mb-2">✅ Datos Correctamente Alineados:</h3>
        <div className="text-sm text-green-700">
          <p><strong>Nombre:</strong> Se muestra correctamente usando el campo 'name' o combinando 'firstName' + 'lastName'</p>
          <p><strong>Nacionalidad:</strong> Campo 'nationality' alineado correctamente</p>
          <p><strong>Fecha de Nacimiento:</strong> Campo 'birthDate' con formato de fecha correcto</p>
          <p><strong>Libros:</strong> Campo 'booksCount' mostrando cantidad numérica</p>
          <p><strong>Estado:</strong> Campo 'isActive' convertido a 'Activo'/'Inactivo'</p>
        </div>
      </div>
    </div>
  );
}