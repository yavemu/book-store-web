import { useState, useEffect, useRef, useMemo } from 'react';

export type ColumnPriority = 'essential' | 'high' | 'medium' | 'low' | 'optional';
export type BreakpointSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface ResponsiveColumn {
  key: string;
  label: string;
  priority: ColumnPriority;
  minWidth?: number;
  maxWidth?: number;
  render?: (value: any, record: any) => React.ReactNode;
  sortable?: boolean;
}

interface UseResponsiveTableProps {
  columns: ResponsiveColumn[];
  containerRef: React.RefObject<HTMLDivElement>;
}

export function useResponsiveTable({ 
  columns, 
  containerRef 
}: UseResponsiveTableProps) {
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [breakpointSize, setBreakpointSize] = useState<BreakpointSize>('md');

  // Detectar cambios en el tamaño del contenedor
  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width;
        setContainerWidth(width);
        
        // Determinar breakpoint basado en el ancho del contenedor
        if (width < 480) {
          setBreakpointSize('xs');
        } else if (width < 640) {
          setBreakpointSize('sm');
        } else if (width < 768) {
          setBreakpointSize('md');
        } else if (width < 1024) {
          setBreakpointSize('lg');
        } else {
          setBreakpointSize('xl');
        }
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [containerRef]);

  // Configuración de columnas por breakpoint
  const breakpointConfig = useMemo(() => ({
    xs: {
      maxColumns: 2,
      priorities: ['essential'],
      textTruncate: 15
    },
    sm: {
      maxColumns: 3,
      priorities: ['essential', 'high'],
      textTruncate: 20
    },
    md: {
      maxColumns: 4,
      priorities: ['essential', 'high', 'medium'],
      textTruncate: 30
    },
    lg: {
      maxColumns: 6,
      priorities: ['essential', 'high', 'medium', 'low'],
      textTruncate: 40
    },
    xl: {
      maxColumns: 8,
      priorities: ['essential', 'high', 'medium', 'low', 'optional'],
      textTruncate: 50
    }
  }), []);

  // Filtrar columnas según el breakpoint actual
  const visibleColumns = useMemo(() => {
    const config = breakpointConfig[breakpointSize];
    
    // Filtrar por prioridad
    const priorityFiltered = columns.filter(column => 
      config.priorities.includes(column.priority)
    );

    // Limitar número máximo de columnas
    const limitedColumns = priorityFiltered.slice(0, config.maxColumns);

    return limitedColumns;
  }, [columns, breakpointSize, breakpointConfig]);

  // Calcular ancho de columnas adaptativamente
  const getColumnWidth = useMemo(() => {
    const actionsColumnWidth = 120; // Ancho fijo para acciones
    const availableWidth = containerWidth - actionsColumnWidth - 40; // Padding/margins
    const columnCount = visibleColumns.length;
    
    if (columnCount === 0) return () => 'auto';
    
    return (column: ResponsiveColumn) => {
      const baseWidth = availableWidth / columnCount;
      
      // Respetar min/max width si están definidos
      if (column.minWidth && baseWidth < column.minWidth) {
        return `${column.minWidth}px`;
      }
      if (column.maxWidth && baseWidth > column.maxWidth) {
        return `${column.maxWidth}px`;
      }
      
      return `${Math.floor(baseWidth)}px`;
    };
  }, [containerWidth, visibleColumns]);

  // Obtener longitud máxima de texto según breakpoint
  const getMaxTextLength = () => {
    return breakpointConfig[breakpointSize].textTruncate;
  };

  // Determinar si necesita scroll horizontal
  const needsHorizontalScroll = useMemo(() => {
    const minRequiredWidth = visibleColumns.reduce((total, col) => {
      return total + (col.minWidth || 100);
    }, 120); // + acciones
    
    return containerWidth > 0 && minRequiredWidth > containerWidth;
  }, [visibleColumns, containerWidth]);

  // Obtener columnas ocultas para mostrar en modal/drawer
  const hiddenColumns = useMemo(() => {
    const visibleKeys = visibleColumns.map(col => col.key);
    return columns.filter(col => !visibleKeys.includes(col.key));
  }, [columns, visibleColumns]);

  return {
    containerWidth,
    breakpointSize,
    visibleColumns,
    hiddenColumns,
    getColumnWidth,
    getMaxTextLength,
    needsHorizontalScroll,
    
    // Helpers para componentes
    isMobile: breakpointSize === 'xs' || breakpointSize === 'sm',
    isTablet: breakpointSize === 'md',
    isDesktop: breakpointSize === 'lg' || breakpointSize === 'xl',
  };
}