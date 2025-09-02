"use client";

import { BookAuthorResponseDto } from "@/types/api/entities";
import Button from "@/components/ui/Button";
import { useEffect } from "react";

interface DeleteAuthorDialogProps {
  author: BookAuthorResponseDto;
  isOpen: boolean;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export default function DeleteAuthorDialog({ 
  author, 
  isOpen, 
  onConfirm, 
  onCancel, 
  loading = false 
}: DeleteAuthorDialogProps) {
  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onCancel();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="modal-backdrop"
        onClick={onCancel}
      />

      {/* Dialog */}
      <div className="modal-container">
        <div className="modal-content delete-dialog">
          {/* Header */}
          <div className="modal-header danger">
            <div className="modal-title-section">
              <h2 className="modal-title danger">
                🗑️ Eliminar Autor
              </h2>
              <p className="modal-subtitle danger">
                Esta acción no se puede deshacer
              </p>
            </div>
          </div>

          {/* Body */}
          <div className="modal-body">
            <div className="delete-warning">
              <div className="warning-icon">
                ⚠️
              </div>
              <div className="warning-content">
                <p className="warning-text">
                  ¿Estás seguro que deseas eliminar el autor <strong>{author.firstName} {author.lastName}</strong>?
                </p>
                <div className="author-details">
                  <div className="detail-item">
                    <span className="detail-label">ID:</span>
                    <span className="detail-value">{author.id}</span>
                  </div>
                  {author.nationality && (
                    <div className="detail-item">
                      <span className="detail-label">Nacionalidad:</span>
                      <span className="detail-value">{author.nationality}</span>
                    </div>
                  )}
                  <div className="detail-item">
                    <span className="detail-label">Creado:</span>
                    <span className="detail-value">
                      {new Date(author.createdAt).toLocaleDateString('es-ES')}
                    </span>
                  </div>
                </div>
                <p className="warning-consequences">
                  Esta acción eliminará permanentemente:
                </p>
                <ul className="consequences-list">
                  <li>✗ Toda la información del autor</li>
                  <li>✗ Las relaciones con libros asignados</li>
                  <li>✗ El historial de registros asociados</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <Button 
              variant="secondary" 
              onClick={onCancel}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button 
              variant="danger" 
              onClick={onConfirm}
              disabled={loading}
              loading={loading}
            >
              {loading ? "Eliminando..." : "🗑️ Eliminar Definitivamente"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}