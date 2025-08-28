'use client';

import { useState, useEffect, useRef } from 'react';
import { LoadingSpinner } from '@/components/ui';

interface Option {
  id: string;
  label: string;
  value?: unknown;
}

interface SearchSelectProps {
  label?: string;
  placeholder?: string;
  value?: Option | null;
  onChange: (option: Option | null) => void;
  onSearch: (term: string) => Promise<Option[]>;
  onCreate?: (term: string) => Promise<Option>;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  className?: string;
  debounceMs?: number;
  minSearchLength?: number;
  createLabel?: string;
}

export function SearchSelect({
  label,
  placeholder = 'Buscar...',
  value,
  onChange,
  onSearch,
  onCreate,
  required = false,
  disabled = false,
  error,
  className = '',
  debounceMs = 300,
  minSearchLength = 2,
  createLabel = 'Crear nuevo'
}: SearchSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [options, setOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowCreate(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchTerm.length >= minSearchLength) {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(() => {
        performSearch(searchTerm);
      }, debounceMs);
    } else {
      setOptions([]);
      setShowCreate(false);
    }

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [searchTerm, minSearchLength, debounceMs, onSearch]);

  const performSearch = async (term: string) => {
    try {
      setLoading(true);
      const results = await onSearch(term);
      setOptions(results);
      
      // Mostrar opción de crear si no hay resultados exactos y onCreate está disponible
      if (onCreate && results.length === 0) {
        setShowCreate(true);
      } else {
        setShowCreate(false);
      }
    } catch (err) {
      console.error('Error searching:', err);
      setOptions([]);
      setShowCreate(false);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (!isOpen) setIsOpen(true);
  };

  const handleOptionSelect = (option: Option) => {
    onChange(option);
    setSearchTerm('');
    setIsOpen(false);
    setShowCreate(false);
  };

  const handleCreate = async () => {
    if (!onCreate || !searchTerm) return;

    try {
      setLoading(true);
      const newOption = await onCreate(searchTerm);
      handleOptionSelect(newOption);
    } catch (err) {
      console.error('Error creating option:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    onChange(null);
    setSearchTerm('');
    setIsOpen(false);
    setShowCreate(false);
  };

  const displayValue = value ? value.label : '';

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={isOpen ? searchTerm : displayValue}
            onChange={handleInputChange}
            onFocus={() => setIsOpen(true)}
            placeholder={placeholder}
            disabled={disabled}
            className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
              disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
            } ${error ? 'border-red-300' : ''}`}
          />
          
          {value && !disabled && (
            <button
              onClick={handleClear}
              className="absolute right-8 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
            {loading ? (
              <LoadingSpinner size="small" />
            ) : (
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            )}
          </div>
        </div>

        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
            {loading && searchTerm.length >= minSearchLength && (
              <div className="px-3 py-2 text-sm text-gray-500 flex items-center">
                <LoadingSpinner size="small" />
                <span className="ml-2">Buscando...</span>
              </div>
            )}
            
            {!loading && searchTerm.length < minSearchLength && (
              <div className="px-3 py-2 text-sm text-gray-500">
                Escribe al menos {minSearchLength} caracteres para buscar
              </div>
            )}
            
            {!loading && searchTerm.length >= minSearchLength && options.length === 0 && !showCreate && (
              <div className="px-3 py-2 text-sm text-gray-500">
                No se encontraron resultados
              </div>
            )}
            
            {options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleOptionSelect(option)}
                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
              >
                {option.label}
              </button>
            ))}
            
            {showCreate && onCreate && (
              <button
                onClick={handleCreate}
                disabled={loading}
                className="w-full px-3 py-2 text-left text-sm text-indigo-600 hover:bg-indigo-50 focus:outline-none focus:bg-indigo-50 border-t border-gray-200 disabled:opacity-50"
              >
                {createLabel}: &quot;{searchTerm}&quot;
              </button>
            )}
          </div>
        )}
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}