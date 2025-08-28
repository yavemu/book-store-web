'use client';

import { useState } from 'react';
import { LoadingSpinner } from './LoadingSpinner';

export interface Column<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  render?: (item: T, value: unknown) => React.ReactNode;
  className?: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  meta: PaginationMeta;
  loading?: boolean;
  onPageChange?: (page: number) => void;
  onSort?: (column: string, order: 'ASC' | 'DESC') => void;
  actions?: (item: T) => React.ReactNode;
  emptyMessage?: string;
  className?: string;
}

export function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  meta,
  loading = false,
  onPageChange,
  onSort,
  actions,
  emptyMessage = 'No hay datos para mostrar',
  className = ''
}: DataTableProps<T>) {
  const [sortColumn, setSortColumn] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('ASC');

  const handleSort = (column: Column<T>) => {
    if (!column.sortable || !onSort) return;

    const columnKey = String(column.key);
    const newOrder = sortColumn === columnKey && sortOrder === 'ASC' ? 'DESC' : 'ASC';
    
    setSortColumn(columnKey);
    setSortOrder(newOrder);
    onSort(columnKey, newOrder);
  };

  const handlePageChange = (page: number) => {
    if (onPageChange && page >= 1 && page <= meta.totalPages) {
      onPageChange(page);
    }
  };

  const getCellValue = (item: T, column: Column<T>) => {
    const key = column.key as keyof T;
    return key in item ? item[key] : '';
  };

  const renderPagination = () => {
    if (meta.totalPages <= 1) return null;

    const pages = [];
    const currentPage = meta.page;
    const totalPages = meta.totalPages;

    // Siempre mostrar primera página
    if (currentPage > 3) {
      pages.push(1);
      if (currentPage > 4) pages.push('...');
    }

    // Páginas alrededor de la actual
    for (let i = Math.max(1, currentPage - 2); i <= Math.min(totalPages, currentPage + 2); i++) {
      pages.push(i);
    }

    // Siempre mostrar última página
    if (currentPage < totalPages - 2) {
      if (currentPage < totalPages - 3) pages.push('...');
      pages.push(totalPages);
    }

    return (
      <div className="flex items-center justify-between py-4 px-6 border-t border-gray-200">
        <div className="text-sm text-gray-700">
          Mostrando {((meta.page - 1) * meta.limit) + 1} a{' '}
          {Math.min(meta.page * meta.limit, meta.total)} de {meta.total} resultados
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handlePageChange(meta.page - 1)}
            disabled={!meta.hasPrev}
            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Anterior
          </button>

          <div className="flex items-center space-x-1">
            {pages.map((page, index) => (
              <button
                key={index}
                onClick={() => typeof page === 'number' ? handlePageChange(page) : undefined}
                disabled={typeof page !== 'number'}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  page === currentPage
                    ? 'bg-indigo-600 text-white'
                    : typeof page === 'number'
                      ? 'text-gray-900 bg-white border border-gray-300 hover:bg-gray-50'
                      : 'text-gray-500 cursor-default'
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() => handlePageChange(meta.page + 1)}
            disabled={!meta.hasNext}
            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Siguiente
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow ${className}`}>
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="large" message="Cargando datos..." />
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''
                  } ${column.className || ''}`}
                  onClick={() => handleSort(column)}
                >
                  <div className="flex items-center">
                    {column.label}
                    {column.sortable && (
                      <div className="ml-1 flex flex-col">
                        <svg
                          className={`w-3 h-3 ${
                            sortColumn === column.key && sortOrder === 'ASC'
                              ? 'text-indigo-600'
                              : 'text-gray-300'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <svg
                          className={`w-3 h-3 -mt-1 ${
                            sortColumn === column.key && sortOrder === 'DESC'
                              ? 'text-indigo-600'
                              : 'text-gray-300'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                </th>
              ))}
              {actions && (
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (actions ? 1 : 0)}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((item, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-gray-50">
                  {columns.map((column, colIndex) => (
                    <td
                      key={colIndex}
                      className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 ${column.className || ''}`}
                    >
                      {column.render 
                        ? column.render(item, getCellValue(item, column))
                        : getCellValue(item, column)
                      }
                    </td>
                  ))}
                  {actions && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {actions(item)}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {renderPagination()}
    </div>
  );
}