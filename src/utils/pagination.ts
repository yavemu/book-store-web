/**
 * Utilidades para cálculos de paginación
 * Principios aplicados: SRP (Single Responsibility Principle), funciones puras
 */

export interface PageRange {
  start: number;
  end: number;
  pages: number[];
}

export interface PaginationCalculation {
  visiblePages: number[];
  showFirstPage: boolean;
  showLastPage: boolean;
  showStartEllipsis: boolean;
  showEndEllipsis: boolean;
  canGoToPrevious: boolean;
  canGoToNext: boolean;
}

/**
 * Calcula el número máximo de páginas visibles según el tamaño de pantalla
 */
export const getMaxVisiblePages = (isMobile?: boolean): number => {
  // Valor por defecto para SSR
  if (typeof window === 'undefined') return 7;
  
  if (isMobile !== undefined) {
    return isMobile ? 3 : 7;
  }
  
  return window.innerWidth < 640 ? 3 : 7;
};

/**
 * Calcula qué páginas deben ser visibles basado en la página actual
 */
export const calculateVisiblePages = (
  currentPage: number,
  totalPages: number,
  maxVisible: number = 7
): PaginationCalculation => {
  
  // Validación de entrada
  if (currentPage < 1 || totalPages < 1 || currentPage > totalPages) {
    return {
      visiblePages: [1],
      showFirstPage: false,
      showLastPage: false,
      showStartEllipsis: false,
      showEndEllipsis: false,
      canGoToPrevious: false,
      canGoToNext: false
    };
  }

  // Si hay pocas páginas, mostrar todas
  if (totalPages <= maxVisible + 2) {
    return {
      visiblePages: Array.from({ length: totalPages }, (_, i) => i + 1),
      showFirstPage: false,
      showLastPage: false,
      showStartEllipsis: false,
      showEndEllipsis: false,
      canGoToPrevious: currentPage > 1,
      canGoToNext: currentPage < totalPages
    };
  }

  // Calcular rango de páginas visibles
  const halfVisible = Math.floor(maxVisible / 2);
  let startPage = Math.max(1, currentPage - halfVisible);
  const endPage = Math.min(totalPages, startPage + maxVisible - 1);
  
  // Ajustar si estamos cerca del final
  if (endPage - startPage + 1 < maxVisible) {
    startPage = Math.max(1, endPage - maxVisible + 1);
  }

  const visiblePages = [];
  for (let i = startPage; i <= endPage; i++) {
    visiblePages.push(i);
  }

  return {
    visiblePages,
    showFirstPage: startPage > 1,
    showLastPage: endPage < totalPages,
    showStartEllipsis: startPage > 2,
    showEndEllipsis: endPage < totalPages - 1,
    canGoToPrevious: currentPage > 1,
    canGoToNext: currentPage < totalPages
  };
};

/**
 * Calcula las páginas para navegación rápida
 */
export const calculateQuickNavigation = (
  currentPage: number,
  totalPages: number
) => {
  const canGoToFirst = currentPage > 1;
  const canGoToLast = currentPage < totalPages;
  const canGoBack10 = currentPage > 10;
  const canGoForward10 = currentPage <= totalPages - 10;

  const firstPage = 1;
  const lastPage = totalPages;
  const back10Page = Math.max(1, currentPage - 10);
  const forward10Page = Math.min(totalPages, currentPage + 10);

  return {
    canGoToFirst,
    canGoToLast,
    canGoBack10,
    canGoForward10,
    firstPage,
    lastPage,
    back10Page,
    forward10Page
  };
};

/**
 * Valida si un número de página es válido
 */
export const isValidPage = (page: number, totalPages: number): boolean => {
  return Number.isInteger(page) && page >= 1 && page <= totalPages;
};

/**
 * Calcula la información de registros mostrados
 */
export const calculateRecordInfo = (
  currentPage: number,
  itemsPerPage: number,
  totalItems: number
) => {
  const startRecord = Math.max(1, (currentPage - 1) * itemsPerPage + 1);
  const endRecord = Math.min(currentPage * itemsPerPage, totalItems);
  
  return {
    startRecord,
    endRecord,
    totalItems,
    hasRecords: totalItems > 0
  };
};

/**
 * Determina si se debe mostrar navegación rápida
 */
export const shouldShowQuickNavigation = (totalPages: number): boolean => {
  return totalPages > 10;
};