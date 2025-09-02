import { useState } from 'react';

export interface SortConfig {
  field: string;
  direction: 'ASC' | 'DESC';
}

interface UseTableSortingProps {
  initialSort?: SortConfig;
  onSortChange?: (field: string, direction: 'ASC' | 'DESC') => void;
}

export function useTableSorting({ 
  initialSort = { field: 'createdAt', direction: 'DESC' }, 
  onSortChange 
}: UseTableSortingProps = {}) {
  const [sortConfig, setSortConfig] = useState<SortConfig>(initialSort);

  const handleSort = (field: string) => {
    if (!onSortChange) return;
    
    let newDirection: 'ASC' | 'DESC';
    
    if (sortConfig.field === field) {
      // Si es el mismo campo, alternar dirección
      newDirection = sortConfig.direction === 'ASC' ? 'DESC' : 'ASC';
    } else {
      // Si es un campo diferente, empezar con ASC
      newDirection = 'ASC';
    }
    
    const newSortConfig = { field, direction: newDirection };
    setSortConfig(newSortConfig);
    onSortChange(field, newDirection);
  };

  const getSortIcon = (field: string) => {
    const isActive = sortConfig.field === field;
    
    if (!isActive) {
      return '↕️'; // Icono de ordenamiento por defecto
    }
    
    return sortConfig.direction === 'ASC' ? '↑' : '↓';
  };
  
  const isSortActive = (field: string) => {
    return sortConfig.field === field && 
           !(field === 'createdAt' && sortConfig.direction === 'DESC');
  };

  return {
    sortConfig,
    handleSort,
    getSortIcon,
    isSortActive
  };
}