"use client";

import { usePaginationMeta } from "@/hooks/usePaginationMeta";
import { DynamicTableProps } from "@/types";
import TableActions from "./TableActions";
import TablePagination from "./TablePagination";

export default function DynamicTable({ data, columns, meta, loading, onPageChange, actions = [], paginationParams }: DynamicTableProps) {
  const paginationMeta = usePaginationMeta(meta, data, paginationParams);

  return (
    <div className="table-container">
      <table className="table-dashboard">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
            {actions.length > 0 && <th>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columns.length + 1}>Cargando...</td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + 1}>No hay datos</td>
            </tr>
          ) : (
            data.map((record, idx) => (
              <tr key={record.id || idx}>
                {columns.map((col) => (
                  <td key={col.key}>{col.render ? col.render(record[col.key], record) : record[col.key]}</td>
                ))}
                {actions.length > 0 && (
                  <td>
                    <TableActions record={record} actions={actions} />
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>

      <TablePagination meta={paginationMeta} onPageChange={onPageChange || (() => {})} />
    </div>
  );
}
