"use client";

import { useState, useEffect, useCallback } from "react";
import { PaginationMeta } from "@/types/api";

interface ManagementPageParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
}

interface UseManagementPageOptions<T, TParams, TFilters> {
  initialParams: TParams;
  apiService: {
    list: (params?: TParams) => Promise<{ data: T[]; meta: PaginationMeta }>;
    filter?: (filters: TFilters, page?: number, limit?: number) => Promise<{ data: T[]; meta: PaginationMeta }>;
  };
  errorMessage?: string;
}

interface UseManagementPageReturn<T, TParams, TFilters> {
  data: T[];
  meta: PaginationMeta;
  loading: boolean;
  error: string | null;
  params: TParams;
  activeFilters: TFilters;
  selectedItem: T | null;
  modalStates: {
    showCreateModal: boolean;
    showEditModal: boolean;
    showDeleteModal: boolean;
    showViewModal: boolean;
  };
  
  // Data fetching
  fetchData: (searchParams?: Partial<TParams>, filters?: TFilters) => Promise<void>;
  
  // Handlers
  handlePageChange: (page: number) => void;
  handleSort: (sortBy: string, sortOrder: "ASC" | "DESC") => void;
  handleFilter: (filters: TFilters) => void;
  handleClearFilters: () => void;
  
  // Item actions
  handleView: (item: T) => void;
  handleEdit: (item: T) => void;
  handleDelete: (item: T) => void;
  
  // Modal controls
  setShowCreateModal: (show: boolean) => void;
  setShowEditModal: (show: boolean) => void;
  setShowDeleteModal: (show: boolean) => void;
  setShowViewModal: (show: boolean) => void;
  setSelectedItem: (item: T | null) => void;
}

export function useManagementPage<T, TParams extends ManagementPageParams, TFilters = {}>(
  options: UseManagementPageOptions<T, TParams, TFilters>
): UseManagementPageReturn<T, TParams, TFilters> {
  const { initialParams, apiService, errorMessage = "Error al cargar los datos" } = options;

  const [data, setData] = useState<T[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState<TParams>(initialParams);
  const [activeFilters, setActiveFilters] = useState<TFilters>({} as TFilters);
  const [selectedItem, setSelectedItem] = useState<T | null>(null);

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);

  const modalStates = {
    showCreateModal,
    showEditModal,
    showDeleteModal,
    showViewModal,
  };

  const fetchData = useCallback(
    async (searchParams?: Partial<TParams>, filters?: TFilters) => {
      setLoading(true);
      setError(null);

      const currentParams = { ...params, ...searchParams } as TParams;
      const currentFilters = filters ?? activeFilters;

      try {
        let response;
        
        if (apiService.filter && filters && Object.keys(currentFilters).length > 0 && Object.values(currentFilters).some(v => v !== undefined)) {
          response = await apiService.filter(currentFilters, currentParams.page, currentParams.limit);
        } else {
          response = await apiService.list(currentParams);
        }

        setData(response.data);
        setMeta(response.meta);
        setParams(currentParams);

        if (filters) setActiveFilters(currentFilters);
      } catch (err) {
        setError(err instanceof Error ? err.message : errorMessage);
        setData([]);
        setMeta({ total: 0, page: 1, limit: 10, totalPages: 0, hasNext: false, hasPrev: false });
      } finally {
        setLoading(false);
      }
    },
    [params, activeFilters, apiService, errorMessage]
  );

  const handlePageChange = useCallback((page: number) => fetchData({ page } as Partial<TParams>), [fetchData]);
  const handleSort = useCallback(
    (sortBy: string, sortOrder: "ASC" | "DESC") => 
      fetchData({ sortBy, sortOrder, page: 1 } as Partial<TParams>), 
    [fetchData]
  );
  const handleFilter = useCallback((filters: TFilters) => fetchData({ page: 1 } as Partial<TParams>, filters), [fetchData]);
  const handleClearFilters = useCallback(() => {
    setActiveFilters({} as TFilters);
    fetchData({ page: 1 } as Partial<TParams>, {} as TFilters);
  }, [fetchData]);

  // Item action handlers
  const handleView = useCallback((item: T) => {
    setSelectedItem(item);
    setShowViewModal(true);
  }, []);

  const handleEdit = useCallback((item: T) => {
    setSelectedItem(item);
    setShowEditModal(true);
  }, []);

  const handleDelete = useCallback((item: T) => {
    setSelectedItem(item);
    setShowDeleteModal(true);
  }, []);

  useEffect(() => {
    // Solo ejecutar después de que se haya montado el componente para evitar problemas de hidratación
    const timeoutId = setTimeout(() => {
      fetchData();
    }, 0);
    
    return () => clearTimeout(timeoutId);
  }, []);

  return {
    data,
    meta,
    loading,
    error,
    params,
    activeFilters,
    selectedItem,
    modalStates,
    fetchData,
    handlePageChange,
    handleSort,
    handleFilter,
    handleClearFilters,
    handleView,
    handleEdit,
    handleDelete,
    setShowCreateModal,
    setShowEditModal,
    setShowDeleteModal,
    setShowViewModal,
    setSelectedItem,
  };
}