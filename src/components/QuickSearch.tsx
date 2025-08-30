'use client';

import { useState } from 'react';
import { useQuickSearch } from '@/hooks';
import Input from './ui/Input';

interface QuickSearchProps {
  entity: string;
  placeholder?: string;
  onResults?: (results: any) => void;
  onError?: (error: any) => void;
}

export default function QuickSearch({ 
  entity, 
  placeholder = "Búsqueda rápida...", 
  onResults,
  onError 
}: QuickSearchProps) {
  const { 
    searchTerm, 
    setSearchTerm, 
    isSearching, 
    hasMinimumChars 
  } = useQuickSearch({
    entity,
    onSuccess: onResults,
    onError
  });

  return (
    <div className="quick-search-container">
      <div className="quick-search-field">
        <Input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={setSearchTerm}
          className="quick-search-input"
        />
        
        {isSearching && hasMinimumChars && (
          <div className="quick-search-status">
            🔄 Buscando...
          </div>
        )}
        
        {searchTerm.length > 0 && searchTerm.length < 3 && (
          <div className="quick-search-hint">
            Mínimo 3 caracteres para buscar
          </div>
        )}
      </div>
    </div>
  );
}