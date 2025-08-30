'use client';

import { useEffect } from 'react';
import Modal from './ui/Modal';
import { useInventoryMovements } from '@/hooks/useInventoryMovements';

interface Book {
  id: string;
  title: string;
  isbn?: string;
  stock?: number;
  price?: number;
}

interface BookMovementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  book: Book | null;
}

export default function BookMovementsModal({ isOpen, onClose, book }: BookMovementsModalProps) {
  const { loading, error, movements, fetchMovementsByBookId } = useInventoryMovements();

  useEffect(() => {
    if (isOpen && book?.id) {
      fetchMovementsByBookId(book.id);
    }
  }, [isOpen, book?.id, fetchMovementsByBookId]);

  if (!isOpen || !book) {
    return null;
  }

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
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleRetry = () => {
    if (book?.id) {
      fetchMovementsByBookId(book.id);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Movimientos de Inventario"
      size="lg"
    >
      <div className="space-y-4">
        {/* Book Information */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-lg mb-2">{book.title}</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            {book.isbn && (
              <div>
                <span className="font-medium">ISBN:</span> {book.isbn}
              </div>
            )}
            {book.stock !== undefined && (
              <div>
                <span className="font-medium">Stock actual:</span> {book.stock}
              </div>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-gray-600">Cargando movimientos...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-8">
            <div className="text-red-600 mb-4">
              <p>{error}</p>
            </div>
            <button
              onClick={handleRetry}
              className="btn-action-ver"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Movements List */}
        {!loading && !error && movements && (
          <div className="space-y-4">
            {movements.data && movements.data.length > 0 ? (
              <div className="space-y-3">
                {movements.data.map((movement: any) => (
                  <div key={movement.id} className="border rounded-lg p-4 bg-white">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="font-medium">{movement.id}</span>
                        <span className={`ml-2 px-2 py-1 rounded text-xs ${statusColors[movement.status as keyof typeof statusColors] || ''}`}>
                          {statusLabels[movement.status as keyof typeof statusLabels] || movement.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatDate(movement.createdAt)}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Tipo:</span>{' '}
                        <span className="order-type-badge">
                          {typeLabels[movement.type as keyof typeof typeLabels] || movement.type}
                        </span>
                      </div>
                      {movement.quantity && (
                        <div>
                          <span className="font-medium">Cantidad:</span> {movement.quantity}
                        </div>
                      )}
                    </div>
                    
                    {movement.reason && (
                      <div className="mt-2 text-sm text-gray-600">
                        <span className="font-medium">Motivo:</span> {movement.reason}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No se encontraron movimientos para este libro</p>
              </div>
            )}
          </div>
        )}

        {/* Modal Actions */}
        <div className="flex justify-end pt-4 border-t">
          <button
            onClick={onClose}
            className="button secondary"
          >
            Cerrar
          </button>
        </div>
      </div>
    </Modal>
  );
}