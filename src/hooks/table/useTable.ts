import { useState, useCallback } from 'react';
import { useTablePagination, PaginationParams } from './useTablePagination';
import { useTableSorting, SortConfig } from './useTableSorting';
import { useTableActions, TableAction } from './useTableActions';
import { useTableSearch } from './useTableSearch';

interface UseTableProps {
  // Configuración inicial
  entityName?: string;
  initialSort?: SortConfig;
  
  // Callbacks
  onPageChange?: (page: number) => void;
  onSortChange?: (field: string, direction: 'ASC' | 'DESC') => void;
  onSearchChange?: (value: string) => void;
  
  // Acciones
  customActions?: TableAction[];
  onEdit?: (record: any) => void;
  onDelete?: (record: any) => void;
  onView?: (record: any) => void;
  
  // Search config
  searchPlaceholder?: string;
  searchDebounce?: number;
}

export function useTable({
  entityName = 'registro',
  initialSort,
  onPageChange,
  onSortChange,
  onSearchChange,
  customActions,
  onEdit,
  onDelete,
  onView,
  searchPlaceholder,
  searchDebounce = 300
}: UseTableProps = {}) {
  
  // Estados del formulario
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  // Hooks especializados
  const pagination = useTablePagination({ onPageChange });
  const sorting = useTableSorting({ initialSort, onSortChange });
  const actions = useTableActions({ 
    entityName, 
    customActions, 
    onEdit: onEdit || handleEdit,
    onDelete,
    onView 
  });
  const search = useTableSearch({ 
    placeholder: searchPlaceholder, 
    onSearchChange, 
    debounceMs: searchDebounce 
  });

  // Handlers para formularios
  const handleCreate = useCallback(() => {
    setIsEditing(false);
    setEditingRecord(null);
    setShowForm(true);
  }, []);

  const handleEdit = useCallback((record: any) => {
    setIsEditing(true);
    setEditingRecord(record);
    setShowForm(true);
    onEdit?.(record);
  }, [onEdit]);

  const handleFormToggle = useCallback(() => {
    setShowForm(!showForm);
    if (showForm) {
      setIsEditing(false);
      setEditingRecord(null);
    }
  }, [showForm]);

  const handleFormClose = useCallback(() => {
    setShowForm(false);
    setIsEditing(false);
    setEditingRecord(null);
  }, []);

  // Configuración completa para la tabla
  const tableConfig = {
    // Paginación
    ...pagination,
    
    // Ordenamiento
    ...sorting,
    
    // Acciones
    ...actions,
    
    // Búsqueda
    ...search,
    
    // Formularios
    showForm,
    isEditing,
    editingRecord,
    handleCreate,
    handleEdit,
    handleFormToggle,
    handleFormClose,
    
    // Configuración
    entityName
  };

  return tableConfig;
}