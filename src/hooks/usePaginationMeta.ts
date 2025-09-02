import { PaginationMeta, PaginationParams } from "@/types";

export function usePaginationMeta(meta?: any, data: any[] = [], params?: PaginationParams): PaginationMeta {
  if (meta) {
    return {
      totalItems: Number(meta.total || meta.totalItems || 0),
      currentPage: Number(meta.page || meta.currentPage || 1),
      itemsPerPage: Number(meta.limit || meta.itemsPerPage || 10),
      totalPages: Number(meta.totalPages || Math.ceil((meta.total || 0) / (meta.limit || 10)) || 1),
      hasNextPage: Boolean(meta.hasNext || meta.hasNextPage || (meta.page || 1) < meta.totalPages),
      hasPrevPage: Boolean(meta.hasPrev || meta.hasPrevPage || (meta.page || 1) > 1),
    };
  }

  return {
    totalItems: data.length,
    currentPage: params?.page || 1,
    itemsPerPage: params?.limit || 10,
    totalPages: Math.ceil(data.length / (params?.limit || 10)) || 1,
    hasNextPage: (params?.page || 1) < (Math.ceil(data.length / (params?.limit || 10)) || 1),
    hasPrevPage: (params?.page || 1) > 1,
  };
}
