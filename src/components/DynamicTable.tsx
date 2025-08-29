'use client';

import { useState } from 'react';

export interface TableColumn {
  key: string;
  label: string;
  render?: (value: any, record: any) => React.ReactNode;
}

export interface TableAction {
  label: string;
  onClick: (record: any) => void;
  className?: string;
}

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface DynamicTableProps {
  data: any[];
  columns: TableColumn[];
  meta?: PaginationMeta;
  loading?: boolean;
  onPageChange?: (page: number) => void;
  actions?: TableAction[];
  showCreateButton?: boolean;
  onCreateClick?: () => void;
  createButtonLabel?: string;
  entityName?: string;
}

export default function DynamicTable({
  data,
  columns,
  meta,
  loading,
  onPageChange,
  actions = [],
  showCreateButton = false,
  onCreateClick,
  createButtonLabel,
  entityName = 'registro'
}: DynamicTableProps) {
  const [currentPage, setCurrentPage] = useState(meta?.currentPage || 1);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    onPageChange?.(page);
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  const renderPagination = () => {
    if (!meta || meta.totalPages <= 1) return null;

    const pages = [];
    for (let i = 1; i <= meta.totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          style={{
            padding: '5px 10px',
            margin: '0 2px',
            backgroundColor: i === currentPage ? '#007bff' : '#f8f9fa',
            color: i === currentPage ? 'white' : 'black',
            border: '1px solid #dee2e6',
            cursor: 'pointer'
          }}
        >
          {i}
        </button>
      );
    }

    return (
      <div style={{ margin: '20px 0', textAlign: 'center' }}>
        <button
          onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
          disabled={!meta.hasPrevPage}
          style={{
            padding: '5px 10px',
            marginRight: '10px',
            backgroundColor: '#f8f9fa',
            border: '1px solid #dee2e6',
            cursor: meta.hasPrevPage ? 'pointer' : 'not-allowed'
          }}
        >
          Anterior
        </button>
        {pages}
        <button
          onClick={() => handlePageChange(Math.min(meta.totalPages, currentPage + 1))}
          disabled={!meta.hasNextPage}
          style={{
            padding: '5px 10px',
            marginLeft: '10px',
            backgroundColor: '#f8f9fa',
            border: '1px solid #dee2e6',
            cursor: meta.hasNextPage ? 'pointer' : 'not-allowed'
          }}
        >
          Siguiente
        </button>
      </div>
    );
  };

  const renderActions = (record: any) => {
    const allActions = [
      {
        label: 'Ver',
        onClick: (record: any) => console.log('Ver', record),
        className: 'btn-view'
      },
      ...actions,
      {
        label: 'Eliminar',
        onClick: (record: any) => {
          if (confirm(`¿Estás seguro de eliminar este ${entityName}?`)) {
            console.log('Eliminar', record);
          }
        },
        className: 'btn-delete'
      }
    ];

    return (
      <div>
        {allActions.map((action, index) => (
          <button
            key={index}
            onClick={() => action.onClick(record)}
            style={{
              padding: '3px 8px',
              margin: '2px',
              fontSize: '12px',
              backgroundColor: action.className === 'btn-delete' ? '#dc3545' : 
                             action.className === 'btn-view' ? '#17a2b8' : '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '3px',
              cursor: 'pointer'
            }}
          >
            {action.label}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div>
      {showCreateButton && (
        <div style={{ marginBottom: '20px' }}>
          <button
            onClick={onCreateClick}
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            {createButtonLabel || `Crear ${entityName}`}
          </button>
        </div>
      )}

      <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #dee2e6' }}>
        <thead>
          <tr style={{ backgroundColor: '#f8f9fa' }}>
            {columns.map((column) => (
              <th
                key={column.key}
                style={{
                  padding: '12px',
                  textAlign: 'left',
                  borderBottom: '2px solid #dee2e6',
                  fontWeight: 'bold'
                }}
              >
                {column.label}
              </th>
            ))}
            <th
              style={{
                padding: '12px',
                textAlign: 'left',
                borderBottom: '2px solid #dee2e6',
                fontWeight: 'bold'
              }}
            >
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + 1}
                style={{
                  padding: '20px',
                  textAlign: 'center',
                  color: '#6c757d'
                }}
              >
                No hay datos disponibles
              </td>
            </tr>
          ) : (
            data.map((record, index) => (
              <tr
                key={record.id || index}
                style={{
                  backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8f9fa'
                }}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    style={{
                      padding: '12px',
                      borderBottom: '1px solid #dee2e6'
                    }}
                  >
                    {column.render
                      ? column.render(record[column.key], record)
                      : record[column.key]
                    }
                  </td>
                ))}
                <td
                  style={{
                    padding: '12px',
                    borderBottom: '1px solid #dee2e6'
                  }}
                >
                  {renderActions(record)}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {renderPagination()}

      {meta && (
        <div style={{ marginTop: '10px', color: '#6c757d', fontSize: '14px' }}>
          Mostrando {((meta.currentPage - 1) * meta.itemsPerPage) + 1} - {Math.min(meta.currentPage * meta.itemsPerPage, meta.totalItems)} de {meta.totalItems} registros
        </div>
      )}
    </div>
  );
}