"use client";

import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { DataTable, Column, ErrorMessage } from "@/components/ui";
import { Button } from "@/components/forms";
import { PaginationMeta } from "@/types/api";

interface ManagementPageLayoutProps<T extends Record<string, unknown>> {
  title: string;
  data: T[];
  columns: Column<T>[];
  meta: PaginationMeta;
  loading: boolean;
  error: string | null;
  emptyMessage: string;
  createButtonText: string;
  onRefresh: () => void;
  onCreate?: () => void;
  createUrl?: string;
  onPageChange: (page: number) => void;
  onSort: (sortBy: string, sortOrder: "ASC" | "DESC") => void;
  renderActions: (item: T) => ReactNode;
  filters?: ReactNode;
  hideCreateButton?: boolean;
}

export default function ManagementPageLayout<T extends Record<string, unknown>>({
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
  createUrl,
  onPageChange,
  onSort,
  renderActions,
  filters,
  hideCreateButton = false,
}: ManagementPageLayoutProps<T>) {
  const router = useRouter();
  if (error) {
    return (
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
        </div>
        <ErrorMessage error={error} />
        <div className="mt-4">
          <Button onClick={onRefresh} className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50">
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
          <Button onClick={onRefresh} className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed" disabled={loading}>
            Actualizar
          </Button>
          {!hideCreateButton && (
            <Button onClick={() => { 
              console.log('Create button clicked!'); 
              if (createUrl) {
                router.push(createUrl);
              } else if (onCreate) {
                onCreate(); 
              }
            }} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
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