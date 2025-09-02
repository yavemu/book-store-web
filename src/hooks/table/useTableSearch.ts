import { useState, useCallback } from 'react';

interface UseTableSearchProps {
  placeholder?: string;
  onSearchChange?: (value: string) => void;
  debounceMs?: number;
}

export function useTableSearch({
  placeholder = 'Buscar...',
  onSearchChange,
  debounceMs = 300
}: UseTableSearchProps = {}) {
  const [searchValue, setSearchValue] = useState('');
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  const handleSearchChange = useCallback((value: string) => {
    setSearchValue(value);

    // Limpiar timer anterior
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    // Crear nuevo timer con debounce
    const newTimer = setTimeout(() => {
      onSearchChange?.(value);
    }, debounceMs);

    setDebounceTimer(newTimer);
  }, [onSearchChange, debounceMs, debounceTimer]);

  const clearSearch = useCallback(() => {
    setSearchValue('');
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    onSearchChange?.('');
  }, [onSearchChange, debounceTimer]);

  return {
    searchValue,
    placeholder,
    handleSearchChange,
    clearSearch
  };
}