'use client';

import Modal from './ui/Modal';
import { InventoryMovement } from '@/services/api/entities/inventory-movements';

interface InventoryMovementViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  movement: InventoryMovement | null;
}

export default function InventoryMovementViewModal({ isOpen, onClose, movement }: InventoryMovementViewModalProps) {
  if (!movement) return null;

  const typeLabels = {
    'IN': 'Entrada',
    'OUT': 'Salida', 
    'TRANSFER': 'Transferencia'
  };

  const statusLabels = {
    'PENDING': 'Pendiente',
    'PROCESSING': 'Procesando',
    'COMPLETED': 'Completado',
    'CANCELLED': 'Cancelado'
  };

  const statusColors = {
    'PENDING': 'text-yellow-600 bg-yellow-50',
    'PROCESSING': 'text-blue-600 bg-blue-50', 
    'COMPLETED': 'text-green-600 bg-green-50',
    'CANCELLED': 'text-red-600 bg-red-50'
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={`Detalles del Movimiento ${movement.id}`}
      size="md"
    >
      <div className="view-list">
        <div className="view-row">
          <div className="view-label">ID del Movimiento:</div>
          <div className="view-value order-id">{movement.id}</div>
        </div>

        <div className="view-row">
          <div className="view-label">Tipo:</div>
          <div className="view-value">
            <span className="order-type-badge">
              {typeLabels[movement.type as keyof typeof typeLabels] || movement.type}
            </span>
          </div>
        </div>

        <div className="view-row">
          <div className="view-label">Estado:</div>
          <div className="view-value">
            <span className={`status-badge ${statusColors[movement.status as keyof typeof statusColors] || ''}`}>
              {statusLabels[movement.status as keyof typeof statusLabels] || movement.status}
            </span>
          </div>
        </div>

        <div className="view-row">
          <div className="view-label">Fecha de Creación:</div>
          <div className="view-value">{formatDate(movement.createdAt)}</div>
        </div>

        <div className="view-row">
          <div className="view-label">Última Actualización:</div>
          <div className="view-value">{formatDate(movement.updatedAt)}</div>
        </div>
      </div>

      <div className="modal-footer">
        <p className="text-sm text-gray-500">
          Este movimiento de inventario se encuentra en estado <strong>{statusLabels[movement.status as keyof typeof statusLabels]}</strong>.
        </p>
      </div>
    </Modal>
  );
}