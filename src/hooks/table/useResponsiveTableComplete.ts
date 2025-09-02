import { useRef } from 'react';
import { useTable } from './useTable';
import { useResponsiveTable, ResponsiveColumn } from './useResponsiveTable';
import { TableAction } from './useTableActions';
import { SortConfig } from './useTableSorting';

interface UseResponsiveTableCompleteProps {
  // Configuración básica
  entityName?: string;
  columns: ResponsiveColumn[];
  
  // Configuración inicial
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
  
  // Configuración de búsqueda
  searchPlaceholder?: string;
  searchDebounce?: number;
  
  // Configuración responsiva
  enableHorizontalScroll?: boolean;
  showHiddenColumnsButton?: boolean;
}

export function useResponsiveTableComplete({
  entityName = 'registro',
  columns,
  initialSort,
  onPageChange,
  onSortChange,
  onSearchChange,
  customActions,
  onEdit,
  onDelete,
  onView,
  searchPlaceholder,
  searchDebounce = 300,
  enableHorizontalScroll = true,
  showHiddenColumnsButton = true
}: UseResponsiveTableCompleteProps) {
  
  const containerRef = useRef<HTMLDivElement>(null);

  // Hook de funcionalidad de tabla
  const table = useTable({
    entityName,
    initialSort,
    onPageChange,
    onSortChange,
    onSearchChange,
    customActions,
    onEdit,
    onDelete,
    onView,
    searchPlaceholder,
    searchDebounce
  });

  // Hook de responsividad
  const responsive = useResponsiveTable({
    columns,
    containerRef
  });

  // Configuración completa para tabla responsiva
  const responsiveTableConfig = {
    // Configuración base de tabla
    ...table,
    
    // Configuración responsiva
    ...responsive,
    containerRef,
    
    // Configuración de columnas responsivas
    columns,
    visibleColumns: responsive.visibleColumns,
    hiddenColumns: responsive.hiddenColumns,
    
    // Configuración de visualización
    enableHorizontalScroll,
    showHiddenColumnsButton,
    
    // Helpers adicionales
    getAdaptiveProps: () => ({
      maxTextLength: responsive.getMaxTextLength(),
      compactMode: responsive.isMobile,
      showFullLabels: responsive.isDesktop
    })
  };

  return responsiveTableConfig;
}

// Hook auxiliar para crear columnas responsivas fácilmente
export function createResponsiveColumns(
  baseColumns: Array<{
    key: string;
    label: string;
    priority?: 'essential' | 'high' | 'medium' | 'low' | 'optional';
    minWidth?: number;
    maxWidth?: number;
    render?: (value: any, record: any) => React.ReactNode;
    sortable?: boolean;
  }>
): ResponsiveColumn[] {
  return baseColumns.map(column => ({
    priority: 'medium',
    ...column
  })) as ResponsiveColumn[];
}