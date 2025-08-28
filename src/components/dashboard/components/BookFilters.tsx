'use client';

import { useState } from 'react';
import { Input, SearchSelect, Select } from '@/components/forms';
import { Card } from '@/components/ui';
import { genresApi, publishingHousesApi } from '@/services/api';
import { BookFiltersDto, Genre, PublishingHouse } from '@/types/domain';

interface BookFiltersProps {
  onFilter: (filters: BookFiltersDto) => void;
  onClear: () => void;
  loading?: boolean;
}

export function BookFilters({ onFilter, onClear, loading = false }: BookFiltersProps) {
  const [filters, setFilters] = useState<BookFiltersDto>({});
  const [expanded, setExpanded] = useState(false);

  const handleFilterChange = (key: keyof BookFiltersDto, value: string | number | boolean | undefined) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilter(filters);
  };

  const handleClear = () => {
    setFilters({});
    onClear();
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== undefined && value !== null && value !== ''
  );

  const searchGenres = async (term: string) => {
    try {
      const genres = await genresApi.search(term);
      return genres.map(genre => ({
        id: genre.id,
        label: genre.name,
        value: genre
      }));
    } catch (err) {
      console.error('Error searching genres:', err);
      return [];
    }
  };

  const searchPublishers = async (term: string) => {
    try {
      const publishers = await publishingHousesApi.search(term);
      return publishers.map(publisher => ({
        id: publisher.id,
        label: publisher.name,
        value: publisher
      }));
    } catch (err) {
      console.error('Error searching publishers:', err);
      return [];
    }
  };

  const handleGenreChange = (option: { id: string; label: string; value?: unknown } | null) => {
    const genre = option?.value as Genre | undefined;
    handleFilterChange('genreId', genre?.id);
  };

  const handlePublisherChange = (option: { id: string; label: string; value?: unknown } | null) => {
    const publisher = option?.value as PublishingHouse | undefined;
    handleFilterChange('publisherId', publisher?.id);
  };

  return (
    <Card className="mb-6">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Búsqueda y Filtros
          </h3>
          <div className="flex items-center space-x-2">
            {hasActiveFilters && (
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                Filtros activos
              </span>
            )}
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50"
            >
              {expanded ? 'Ocultar' : 'Mostrar'} filtros
              <svg 
                className={`w-4 h-4 ml-1 transition-transform ${expanded ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Búsqueda básica - siempre visible */}
          <div className="mb-4">
            <Input
              type="text"
              placeholder="Buscar por título..."
              value={filters.title || ''}
              onChange={(e) => handleFilterChange('title', e.target.value)}
              className="w-full"
            />
          </div>

          {/* Filtros avanzados - expandibles */}
          {expanded && (
            <div className="space-y-4 border-t pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <SearchSelect
                  label="Género"
                  placeholder="Buscar género..."
                  value={filters.genreId ? { 
                    id: filters.genreId, 
                    label: filters.genreId // This will be replaced by the actual search
                  } : null}
                  onChange={handleGenreChange}
                  onSearch={searchGenres}
                />

                <SearchSelect
                  label="Editorial"
                  placeholder="Buscar editorial..."
                  value={filters.publisherId ? { 
                    id: filters.publisherId, 
                    label: filters.publisherId // This will be replaced by the actual search
                  } : null}
                  onChange={handlePublisherChange}
                  onSearch={searchPublishers}
                />

                <Select
                  label="Disponibilidad"
                  value={filters.isAvailable !== undefined ? filters.isAvailable.toString() : ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    handleFilterChange('isAvailable', value === '' ? undefined : value === 'true');
                  }}
                >
                  <option value="">Todos</option>
                  <option value="true">Disponible</option>
                  <option value="false">No disponible</option>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Precio mínimo"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={filters.minPrice || ''}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value ? parseFloat(e.target.value) : undefined)}
                />

                <Input
                  label="Precio máximo"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="999.99"
                  value={filters.maxPrice || ''}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value ? parseFloat(e.target.value) : undefined)}
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-end space-x-3 mt-4 pt-4 border-t">
            <button
              type="button"
              onClick={handleClear}
              disabled={loading || !hasActiveFilters}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Limpiar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Buscando...' : 'Buscar'}
            </button>
          </div>
        </form>
      </div>
    </Card>
  );
}