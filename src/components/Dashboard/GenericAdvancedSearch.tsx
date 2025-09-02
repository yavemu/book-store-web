"use client";

import React, { useState, useEffect } from "react";
import Button from "@/components/ui/Button";

export interface SearchFieldConfig {
  key: string;
  label: string;
  type: 'text' | 'select' | 'date' | 'number' | 'boolean';
  placeholder?: string;
  validation?: {
    minLength?: number;
    required?: boolean;
  };
  options?: { value: any; label: string }[];
}

export interface GenericSearchFilters {
  [key: string]: any;
}

interface GenericAdvancedSearchProps {
  entityName: string;
  searchFields: SearchFieldConfig[];
  onAutoFilter: (term: string) => void;
  onSearch: (term: string, fuzzySearch?: boolean) => void;
  onAdvancedFilter: (filters: GenericSearchFilters, fuzzySearch?: boolean) => void;
  onClear: () => void;
  loading?: boolean;
}

export default function GenericAdvancedSearch({
  entityName,
  searchFields,
  onAutoFilter,
  onSearch,
  onAdvancedFilter,
  onClear,
  loading = false,
}: GenericAdvancedSearchProps) {
  const [showAdvancedForm, setShowAdvancedForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [fuzzySearchEnabled, setFuzzySearchEnabled] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState<GenericSearchFilters>(() => {
    const initialFilters: GenericSearchFilters = {};
    searchFields.forEach(field => {
      if (field.type === 'boolean') {
        initialFilters[field.key] = undefined;
      } else if (field.type === 'number') {
        initialFilters[field.key] = undefined;
      } else {
        initialFilters[field.key] = "";
      }
    });
    return initialFilters;
  });

  const handleMainSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (searchTerm.trim().length >= 3) {
      onSearch(searchTerm.trim(), false);
    }
  };

  // Check if advanced-filter conditions are met
  const checkAdvancedFilterConditions = () => {
    // Condition 1: "buscar por coincidencias" checkbox must be active
    if (!fuzzySearchEnabled) return false;
    
    // Condition 2: At least one field must have 3+ characters
    const hasValidField = Object.entries(advancedFilters).some(([key, value]) => {
      const field = searchFields.find(f => f.key === key);
      if (field?.type === 'number' || field?.type === 'boolean') return value !== undefined;
      return typeof value === 'string' && value.trim().length >= 3;
    });
    
    return hasValidField;
  };

  const handleAdvancedSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if advanced-filter conditions are met
    if (checkAdvancedFilterConditions()) {
      const cleanFilters: GenericSearchFilters = {};
      
      Object.entries(advancedFilters).forEach(([key, value]) => {
        const field = searchFields.find(f => f.key === key);
        if (field?.type === 'number' || field?.type === 'boolean') {
          if (value !== undefined) cleanFilters[key] = value;
        } else if (typeof value === 'string' && value.trim().length >= 3) {
          cleanFilters[key] = value.trim();
        }
      });

      // Call POST /advanced-filter endpoint with fuzzy search enabled
      onAdvancedFilter(cleanFilters, true);
    }
  };

  const handleClear = () => {
    // Clear all debounce timers
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    if (searchTermDebounceRef.current) {
      clearTimeout(searchTermDebounceRef.current);
    }
    
    setSearchTerm("");
    setFuzzySearchEnabled(false);
    const clearedFilters: GenericSearchFilters = {};
    searchFields.forEach(field => {
      if (field.type === 'boolean' || field.type === 'number') {
        clearedFilters[field.key] = undefined;
      } else {
        clearedFilters[field.key] = "";
      }
    });
    setAdvancedFilters(clearedFilters);
    setShowAdvancedForm(false);
    onClear();
  };

  // Debounce refs for auto-trigger
  const debounceRef = React.useRef<NodeJS.Timeout>();
  const searchTermDebounceRef = React.useRef<NodeJS.Timeout>();

  // Effect to clean up timeouts when fuzzySearchEnabled changes
  useEffect(() => {
    if (!fuzzySearchEnabled) {
      // Clear any pending auto-searches when fuzzy search is disabled
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      if (searchTermDebounceRef.current) {
        clearTimeout(searchTermDebounceRef.current);
      }
    }
  }, [fuzzySearchEnabled]);

  const handleAdvancedFilterChange = (field: string, value: any) => {
    setAdvancedFilters(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear previous debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    // Auto-trigger only if fuzzySearchEnabled is true
    if (fuzzySearchEnabled) {
      // Include the new value being set
      const updatedFilters = { ...advancedFilters, [field]: value };
      
      // Check if at least one field has 3+ characters
      const hasValidField = Object.entries(updatedFilters).some(([key, val]) => {
        const searchField = searchFields.find(f => f.key === key);
        if (searchField?.type === 'number' || searchField?.type === 'boolean') return val !== undefined && val !== '';
        return typeof val === 'string' && val.trim().length >= 3;
      });
      
      if (hasValidField) {
        const cleanFilters: GenericSearchFilters = {};
        
        Object.entries(updatedFilters).forEach(([key, val]) => {
          const searchField = searchFields.find(f => f.key === key);
          if (searchField?.type === 'number' || searchField?.type === 'boolean') {
            if (val !== undefined && val !== '') cleanFilters[key] = val;
          } else if (typeof val === 'string' && val.trim().length >= 3) {
            cleanFilters[key] = val.trim();
          }
        });
        
        // Auto-trigger advanced filter with debounce (calls POST /advanced-filter)
        if (Object.keys(cleanFilters).length > 0) {
          debounceRef.current = setTimeout(() => {
            onAdvancedFilter(cleanFilters, true);
          }, 500);
        }
      }
    }
  };

  // Quick search validation
  const canMainSearch = searchTerm.trim().length >= 3;
  
  // Advanced filter validation - must meet all 3 conditions
  const canAdvancedSearch = checkAdvancedFilterConditions();

  const renderField = (field: SearchFieldConfig) => {
    const value = advancedFilters[field.key];

    switch (field.type) {
      case 'select':
        return (
          <select
            value={value || ""}
            onChange={(e) => handleAdvancedFilterChange(field.key, e.target.value || undefined)}
            className="search-select"
            disabled={loading}
          >
            <option value="">Todas las opciones</option>
            {field.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'boolean':
        return (
          <select
            value={value === undefined ? "" : value ? "true" : "false"}
            onChange={(e) => handleAdvancedFilterChange(field.key, e.target.value === "" ? undefined : e.target.value === "true")}
            className="search-select"
            disabled={loading}
          >
            <option value="">Todos los estados</option>
            {field.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'number':
        return (
          <input
            type="number"
            value={value || ""}
            onChange={(e) => handleAdvancedFilterChange(field.key, e.target.value ? parseInt(e.target.value) : undefined)}
            placeholder={field.placeholder}
            className="search-input"
            disabled={loading}
          />
        );

      case 'date':
        return (
          <input
            type="date"
            value={value || ""}
            onChange={(e) => handleAdvancedFilterChange(field.key, e.target.value)}
            className="search-input"
            disabled={loading}
          />
        );

      default:
        return (
          <input
            type="text"
            value={value || ""}
            onChange={(e) => handleAdvancedFilterChange(field.key, e.target.value)}
            placeholder={field.placeholder}
            className="search-input"
            disabled={loading}
          />
        );
    }
  };

  return (
    <div className="search-section">
      {/* Advanced Search Toggle */}
      <div className="advanced-search-toggle">
        <Button
          variant="secondary"
          onClick={() => setShowAdvancedForm(!showAdvancedForm)}
          disabled={loading}
          className="toggle-advanced-btn"
        >
          {showAdvancedForm ? "🔍 Ocultar Filtros Avanzados" : "🔍 Mostrar Filtros Avanzados"}
        </Button>
      </div>

      {/* Advanced Search Form - Enhanced Layout */}
      {showAdvancedForm && (
        <div className="advanced-search-container">
          <form onSubmit={handleAdvancedSubmit} className="advanced-search-form">
            {/* Search Fields Grid */}
            <div className="search-fields-grid">
              <div className="search-field-group">
                <label className="field-label">Término de búsqueda</label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    setSearchTerm(newValue);
                    
                    // Auto-trigger if fuzzySearchEnabled and has 3+ characters
                    if (fuzzySearchEnabled && newValue.trim().length >= 3) {
                      // Clear previous debounce
                      if (searchTermDebounceRef.current) {
                        clearTimeout(searchTermDebounceRef.current);
                      }
                      
                      // Auto-trigger advanced filter with debounce (POST /advanced-filter)
                      searchTermDebounceRef.current = setTimeout(() => {
                        // Call advancefilter with the search term as a filter
                        onAdvancedFilter({ name: newValue.trim() }, true);
                      }, 500);
                    }
                  }}
                  placeholder={`Ej: Gabriel García (mín. 3 caracteres)`}
                  className="search-input"
                  disabled={loading}
                />
              </div>

              {/* Fuzzy Search Checkbox - Enables automatic advanced filtering */}
              <div className="search-field-group">
                <label className="field-label">
                  <input
                    type="checkbox"
                    checked={fuzzySearchEnabled}
                    onChange={(e) => setFuzzySearchEnabled(e.target.checked)}
                    disabled={loading}
                    className="mr-2"
                  />
                  🔄 Buscar por coincidencias automáticamente
                </label>
                <small className="text-gray-600">
                  {fuzzySearchEnabled 
                    ? "✅ Búsqueda automática activada - Se ejecuta al escribir en cualquier campo (≥3 caracteres)"
                    : "⏸️ Búsqueda manual - Use el botón 'Buscar' para ejecutar"
                  }
                </small>
              </div>

              {searchFields.map(field => (
                <div key={field.key} className="search-field-group">
                  <label className="field-label">{field.label}</label>
                  {renderField(field)}
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="search-actions">
              <div className="search-actions-left">
                <Button
                  variant="secondary"
                  onClick={handleClear}
                  disabled={loading}
                  type="button"
                  size="sm"
                >
                  🗑️ Limpiar
                </Button>
              </div>
              
              <div className="search-actions-right">
                {/* Botón Buscar - Activo por defecto, se desactiva si fuzzySearch está habilitado */}
                <Button
                  type="button"
                  variant="primary"
                  disabled={fuzzySearchEnabled || loading}
                  loading={loading}
                  onClick={() => onSearch(searchTerm.trim(), false)}
                  size="sm"
                  title={fuzzySearchEnabled ? "Desactiva 'Buscar por coincidencias' para usar búsqueda normal" : "Búsqueda normal (usa POST /search)"}
                >
                  🔍 Buscar
                </Button>
                
                {/* Indicador de estado cuando fuzzySearch está activo */}
                {fuzzySearchEnabled && (
                  <div className="auto-search-indicator">
                    <span className="text-sm text-blue-600">
                      🔄 Búsqueda automática activada
                    </span>
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}