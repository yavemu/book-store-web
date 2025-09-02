/**
 * Hook para manejar la lógica de paginación
 * Principios aplicados: SRP, separación de lógica de UI
 */

import { useState, useCallback, useMemo } from 'react';
import { PaginationMeta } from './useTablePagination';
import {
  calculateVisiblePages,
  calculateQuickNavigation,
  calculateRecordInfo,
  shouldShowQuickNavigation,
  isValidPage,
  getMaxVisiblePages
} from '@/utils/pagination';

export interface UsePaginationLogicProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
  disabled?: boolean;
  isMobile?: boolean;
}

export interface PaginationState {
  jumpPage: string;
  showJumpInput: boolean;
}

export interface PaginationActions {
  handlePageChange: (page: number) => void;
  handleQuickJump: (page: number) => void;
  handleJumpInputChange: (value: string) => void;
  handleJumpSubmit: () => void;
  handleJumpCancel: () => void;
  toggleJumpInput: () => void;
}

export interface PaginationData {
  // Información básica
  currentPage: number;
  totalPages: number;
  totalItems: number;
  
  // Cálculos de páginas visibles
  visiblePages: number[];
  showFirstPage: boolean;
  showLastPage: boolean;
  showStartEllipsis: boolean;
  showEndEllipsis: boolean;
  
  // Navegación
  canGoToPrevious: boolean;
  canGoToNext: boolean;
  
  // Navegación rápida
  shouldShowQuickNav: boolean;
  quickNav: {
    canGoToFirst: boolean;
    canGoToLast: boolean;
    canGoBack10: boolean;
    canGoForward10: boolean;
    firstPage: number;
    lastPage: number;
    back10Page: number;
    forward10Page: number;
  };
  
  // Información de registros
  recordInfo: {
    startRecord: number;
    endRecord: number;
    totalItems: number;
    hasRecords: boolean;
  };
}

export function usePaginationLogic({
  meta,
  onPageChange,
  disabled = false,
  isMobile
}: UsePaginationLogicProps) {
  
  // Estado interno del componente
  const [state, setState] = useState<PaginationState>({
    jumpPage: '',
    showJumpInput: false
  });

  // Extraer valores del meta de forma segura
  const { currentPage, totalPages, totalItems, itemsPerPage } = meta;

  // Cálculos memoizados para optimizar rendimiento
  const paginationData = useMemo<PaginationData>(() => {
    const maxVisible = getMaxVisiblePages(isMobile);
    const pageCalculation = calculateVisiblePages(currentPage, totalPages, maxVisible);
    const quickNav = calculateQuickNavigation(currentPage, totalPages);
    const recordInfo = calculateRecordInfo(currentPage, itemsPerPage, totalItems);
    
    return {
      currentPage,
      totalPages,
      totalItems,
      ...pageCalculation,
      shouldShowQuickNav: shouldShowQuickNavigation(totalPages),
      quickNav,
      recordInfo
    };
  }, [currentPage, totalPages, totalItems, itemsPerPage, isMobile]);

  // Acciones del componente usando useCallback directamente
  const handlePageChange = useCallback((page: number) => {
    if (disabled || !isValidPage(page, totalPages)) return;
    onPageChange(page);
  }, [disabled, totalPages, onPageChange]);

  const handleQuickJump = useCallback((page: number) => {
    handlePageChange(page);
  }, [handlePageChange]);

  const handleJumpInputChange = useCallback((value: string) => {
    setState(prev => ({ ...prev, jumpPage: value }));
  }, []);

  const handleJumpSubmit = useCallback(() => {
    const pageNumber = parseInt(state.jumpPage);
    if (isValidPage(pageNumber, totalPages)) {
      handlePageChange(pageNumber);
      setState(prev => ({ ...prev, jumpPage: '', showJumpInput: false }));
    }
  }, [state.jumpPage, totalPages, handlePageChange]);

  const handleJumpCancel = useCallback(() => {
    setState(prev => ({ ...prev, jumpPage: '', showJumpInput: false }));
  }, []);

  const toggleJumpInput = useCallback(() => {
    setState(prev => ({ ...prev, showJumpInput: !prev.showJumpInput }));
  }, []);

  const actions = useMemo<PaginationActions>(() => ({
    handlePageChange,
    handleQuickJump,
    handleJumpInputChange,
    handleJumpSubmit,
    handleJumpCancel,
    toggleJumpInput
  }), [handlePageChange, handleQuickJump, handleJumpInputChange, handleJumpSubmit, handleJumpCancel, toggleJumpInput]);

  return {
    state,
    data: paginationData,
    actions,
    disabled
  };
}