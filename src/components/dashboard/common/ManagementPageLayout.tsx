"use client";

import { ReactNode } from "react";
import { DataTable, Column, ErrorMessage } from "@/components/ui";
import { Button } from "@/components/forms";
import { PaginationMeta } from "@/types/api";

interface ManagementPageLayoutProps<T> {
  title: string;
  data: T[];
  columns: Column<T>[];
  meta: PaginationMeta;
  loading: boolean;
  error: string | null;
  emptyMessage: string;
  createButtonText: string;
  onRefresh: () => void;
  onCreate: () => void;
  onPageChange: (page: number) => void;
  onSort: (sortBy: string, sortOrder: "ASC" | "DESC") => void;
  renderActions: (item: T) => ReactNode;
  filters?: ReactNode;
  hideCreateButton?: boolean;
}

export default function ManagementPageLayout<T>({
  title,
  data,
  columns,
  meta,
  loading,
  error,
  emptyMessage,
  createButtonText,
  onRefresh,
  onCreate,
  onPageChange,
  onSort,
  renderActions,
  filters,
  hideCreateButton = false,
}: ManagementPageLayoutProps<T>) {
  if (error) {
    return (
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
        </div>
        <ErrorMessage error={error} />
        <div className="mt-4">
          <Button onClick={onRefresh} variant="outline">
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
        <div className="flex items-center space-x-3">
          <Button onClick={onRefresh} variant="outline" disabled={loading}>
            Actualizar
          </Button>
          {!hideCreateButton && (
            <Button onClick={onCreate} variant="primary">
              {createButtonText}
            </Button>
          )}
        </div>
      </div>

      {filters}

      <DataTable
        data={data}
        columns={columns}
        meta={meta}
        loading={loading}
        onPageChange={onPageChange}
        onSort={onSort}
        actions={renderActions}
        emptyMessage={emptyMessage}
      />
    </div>
  );
}