'use client';

import React from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

interface GenericDeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  entity: any;
  entityName: string;
  loading?: boolean;
  displayField?: string; // Field to show as entity identifier (e.g., 'name', 'title')
}

export default function GenericDeleteDialog({
  isOpen,
  onClose,
  onConfirm,
  entity,
  entityName,
  loading = false,
  displayField = 'name'
}: GenericDeleteDialogProps) {
  if (!entity) return null;

  const entityIdentifier = entity[displayField] || entity.title || entity.email || `${entityName} #${entity.id}`;

  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Confirmar Eliminación"
      size="sm"
    >
      <div className="delete-dialog-content">
        <div className="warning-icon">⚠️</div>
        
        <div className="warning-message">
          <p>¿Estás seguro de que deseas eliminar este {entityName.toLowerCase()}?</p>
          
          <div className="entity-info">
            <strong>{entityIdentifier}</strong>
          </div>
          
          <p className="warning-text">
            Esta acción no se puede deshacer.
          </p>
        </div>
        
        <div className="dialog-actions">
          <Button
            onClick={onClose}
            variant="secondary"
            disabled={loading}
          >
            Cancelar
          </Button>
          
          <Button
            onClick={handleConfirm}
            variant="danger"
            loading={loading}
            disabled={loading}
          >
            {loading ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}