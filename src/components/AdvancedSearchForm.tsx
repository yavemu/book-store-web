'use client';

import { useDebounce } from "@/hooks";
import { UnifiedFieldConfig, getSearchFields } from "@/types/dashboard/unified-config";
import { useEffect, useState } from "react";
import Button from "./ui/Button";
import Input from "./ui/Input";

export interface SearchField {
  key: string;
  label: string;
  type: "text" | "number" | "email" | "select" | "date" | "boolean";
  options?: { value: any; label: string }[];
  placeholder?: string;
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
  };
}

export interface SearchFilters {
  [key: string]: string | number | undefined;
  startDate?: string;
  endDate?: string;
}

interface AdvancedSearchFormProps {
  fields?: SearchField[]; // Made optional for backward compatibility
  unifiedFields?: UnifiedFieldConfig[]; // New unified config option
  onSearch: (filters: SearchFilters) => void;
  onAdvancedFilter?: (filters: SearchFilters) => void;
  onClear: () => void;
  loading?: boolean;
  entityName?: string;
  initialFilters?: SearchFilters;
  isFiltering?: boolean;
}

export default function AdvancedSearchForm({
  fields,
  unifiedFields,
  onSearch,
  onAdvancedFilter,
  onClear,
  loading = false,
  entityName = "registros",
  initialFilters = {},
  isFiltering = false,
}: AdvancedSearchFormProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>(initialFilters);
  const [isRealTimeSearch, setIsRealTimeSearch] = useState(false);

  // Determine which fields to use (unified config takes precedence)
  const searchFields = unifiedFields ? getSearchFields(unifiedFields) : fields || [];

  // Debounce filters for real-time search
  const debouncedFilters = useDebounce(filters, 500);

  // Effect for real-time search with debounce
  useEffect(() => {
    if (!isRealTimeSearch || !onAdvancedFilter) return;

    // Check if we have at least one field with 3+ characters/digits
    const hasValidSearchTerm = Object.entries(debouncedFilters).some(([key, value]) => {
      if (!value) return false;
      const trimmedValue = String(value).trim();
      return trimmedValue.length >= 3;
    });

    if (hasValidSearchTerm) {
      // Filter out empty values
      const activeFilters = Object.entries(debouncedFilters).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          const trimmedValue = String(value).trim();
          if (trimmedValue.length > 0) {
            acc[key] = trimmedValue;
          }
        }
        return acc;
      }, {} as SearchFilters);

      if (Object.keys(activeFilters).length > 0) {
        onAdvancedFilter(activeFilters);
      }
    }
  }, [debouncedFilters, isRealTimeSearch, onAdvancedFilter]);

  const handleToggle = () => {
    setIsVisible(!isVisible);
  };

  const handleInputChange = (key: string, value: string | number) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    // Filter out empty values
    const activeFilters = Object.entries(filters).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        acc[key] = value;
      }
      return acc;
    }, {} as SearchFilters);

    onSearch(activeFilters);
  };

  const handleClear = () => {
    setFilters({});
    onClear();
  };

  const hasActiveFilters = Object.values(filters).some((value) => value !== undefined && value !== null && value !== "");

  return (
    <div className="advanced-search-container">
      {/* Toggle Button */}
      <div className="advanced-search-toggle">
        <Button type="button" variant="secondary" onClick={handleToggle} className="toggle-search-btn">
          <span className="toggle-icon">{isVisible ? "🔼" : "🔽"}</span>
          Búsqueda Avanzada
          {hasActiveFilters && (
            <span className="active-filters-indicator">
              ({Object.values(filters).filter((v) => v !== undefined && v !== null && v !== "").length})
            </span>
          )}
        </Button>
      </div>

      {/* Advanced Search Form */}
      {isVisible && (
        <div className="advanced-search-form-container">
          <form onSubmit={handleSearch} className="advanced-search-form">
            <h4 className="search-form-title">🔍 Búsqueda Avanzada de {entityName}</h4>

            <div className="search-grid">
              {/* Entity-specific fields */}
              {searchFields.map((field) => (
                <div key={field.key} className="search-field">
                  <label className="search-label">{field.label}</label>

                  {field.type === "select" || field.type === "boolean" ? (
                    <select value={filters[field.key] || ""} onChange={(e) => handleInputChange(field.key, e.target.value)} className="search-select">
                      <option value="">Todos</option>
                      {field.options?.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <Input
                      type={field.type === "boolean" ? "select" : field.type}
                      value={filters[field.key] || ""}
                      onChange={(value) => handleInputChange(field.key, value)}
                      placeholder={field.placeholder || `Buscar por ${field.label.toLowerCase()}...`}
                      className="search-input"
                    />
                  )}
                </div>
              ))}

              {/* Date Range Fields */}
              <div className="search-field">
                <label className="search-label">Fecha Desde</label>
                <Input
                  type="date"
                  value={filters.startDate || ""}
                  onChange={(value) => handleInputChange("startDate", value)}
                  className="search-input"
                />
              </div>

              <div className="search-field">
                <label className="search-label">Fecha Hasta</label>
                <Input type="date" value={filters.endDate || ""} onChange={(value) => handleInputChange("endDate", value)} className="search-input" />
              </div>
            </div>

            {/* Real-time search checkbox */}
            <div className="search-options">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={isRealTimeSearch}
                  onChange={(e) => setIsRealTimeSearch(e.target.checked)}
                  className="search-checkbox"
                />
              </label>
              <span className="checkbox-text">Buscar por coincidencia (tiempo real)</span>
              {isRealTimeSearch && isFiltering && <span className="filtering-status">🔄 Filtrando...</span>}
            </div>

            {/* Action Buttons */}
            <div className="search-actions">
              {!isRealTimeSearch && (
                <Button type="submit" variant="primary" disabled={loading} className="search-btn">
                  {loading ? "🔄 Buscando..." : "🔍 Buscar"}
                </Button>
              )}

              <Button type="button" variant="secondary" onClick={handleClear} disabled={loading || !hasActiveFilters} className="clear-btn">
                🗑️ Limpiar
              </Button>

              <Button type="button" variant="secondary" onClick={handleToggle} className="close-btn">
                ❌ Cerrar
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}