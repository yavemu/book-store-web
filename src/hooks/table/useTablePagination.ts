import { useState, useMemo } from 'react';

export interface PaginationMeta {
  totalItems: number;
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: 'ASC' | 'DESC';
}

interface UsePaginationProps {
  initialPage?: number;
  onPageChange?: (page: number) => void;
}

export function useTablePagination({ initialPage = 1, onPageChange }: UsePaginationProps) {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const mapApiMetaToPaginationMeta = (apiMeta: any): PaginationMeta | null => {
    if (!apiMeta) return null;
    
    const totalItems = Number(apiMeta.total || apiMeta.totalItems || 0);
    const currentPage = Number(apiMeta.page || apiMeta.currentPage || 1);
    const itemsPerPage = Number(apiMeta.limit || apiMeta.itemsPerPage || apiMeta.size || 10);
    const totalPages = Number(apiMeta.totalPages || apiMeta.pages || Math.ceil(totalItems / itemsPerPage) || 1);
    
    const hasNextPage = Boolean(
      apiMeta.hasNext !== undefined ? apiMeta.hasNext :
      apiMeta.hasNextPage !== undefined ? apiMeta.hasNextPage :
      apiMeta.hasMore !== undefined ? apiMeta.hasMore :
      currentPage < totalPages
    );
    
    const hasPrevPage = Boolean(
      apiMeta.hasPrev !== undefined ? apiMeta.hasPrev :
      apiMeta.hasPrevPage !== undefined ? apiMeta.hasPrevPage :
      apiMeta.hasPrevious !== undefined ? apiMeta.hasPrevious :
      currentPage > 1
    );
    
    return {
      totalItems,
      currentPage,
      itemsPerPage,
      totalPages,
      hasNextPage,
      hasPrevPage
    };
  };

  const createSafeFallbackMeta = (
    data: any[], 
    paginationParams?: PaginationParams
  ): PaginationMeta => ({
    totalItems: Math.max(0, data.length),
    currentPage: Math.max(1, paginationParams?.page || 1),
    itemsPerPage: Math.max(1, paginationParams?.limit || 10),
    totalPages: Math.max(1, Math.ceil(data.length / (paginationParams?.limit || 10))),
    hasNextPage: data.length > (paginationParams?.limit || 10),
    hasPrevPage: (paginationParams?.page || 1) > 1
  });

  const getSafePaginationMeta = (
    apiMeta: any, 
    data: any[], 
    paginationParams?: PaginationParams
  ): PaginationMeta => {
    const mappedMeta = mapApiMetaToPaginationMeta(apiMeta);
    const effectiveMeta = mappedMeta || createSafeFallbackMeta(data, paginationParams);

    return {
      totalItems: Math.max(0, effectiveMeta.totalItems || 0),
      currentPage: Math.max(1, effectiveMeta.currentPage || 1),
      itemsPerPage: Math.max(1, effectiveMeta.itemsPerPage || 10),
      totalPages: Math.max(1, effectiveMeta.totalPages || 1),
      hasNextPage: Boolean(effectiveMeta.hasNextPage),
      hasPrevPage: Boolean(effectiveMeta.hasPrevPage)
    };
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    onPageChange?.(page);
  };

  return {
    currentPage,
    handlePageChange,
    mapApiMetaToPaginationMeta,
    getSafePaginationMeta
  };
}