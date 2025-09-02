'use client';

import React from 'react';
import Modal from '@/components/ui/Modal';

interface GenericViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  entity: any;
  entityName: string;
  columns: Array<{
    key: string;
    label: string;
    render?: (value: any, record: any) => React.ReactNode;
  }>;
}

export default function GenericViewModal({
  isOpen,
  onClose,
  entity,
  entityName,
  columns
}: GenericViewModalProps) {
  if (!entity) return null;

  const renderValue = (column: any, entity: any) => {
    const value = entity[column.key];
    
    if (column.render) {
      return column.render(value, entity);
    }
    
    if (value === null || value === undefined) {
      return <span className="text-gray-400">-</span>;
    }
    
    if (typeof value === 'boolean') {
      return value ? 'Activo' : 'Inactivo';
    }
    
    if (typeof value === 'number') {
      return value.toLocaleString();
    }
    
    if (value instanceof Date) {
      return value.toLocaleDateString();
    }
    
    return String(value);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Detalles de ${entityName}`}
      size="lg"
    >
      <div className="view-modal-content">
        <div className="entity-details">
          {columns.map((column) => (
            <div key={column.key} className="detail-row">
              <div className="detail-label">{column.label}:</div>
              <div className="detail-value">
                {renderValue(column, entity)}
              </div>
            </div>
          ))}
        </div>
        
        <div className="modal-actions">
          <button
            onClick={onClose}
            className="btn-secondary"
          >
            Cerrar
          </button>
        </div>
      </div>
    </Modal>
  );
}