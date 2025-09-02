"use client";

import { BookAuthorResponseDto } from "@/types/api/entities";
import Button from "@/components/ui/Button";
import { useEffect } from "react";

interface AuthorViewModalProps {
  author: BookAuthorResponseDto;
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthorViewModal({ author, isOpen, onClose }: AuthorViewModalProps) {
  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevent background scroll
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    try {
      return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const formatDateTime = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="modal-backdrop"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="modal-container">
        <div className="modal-content author-view-modal">
          {/* Header */}
          <div className="modal-header">
            <div className="modal-title-section">
              <h2 className="modal-title">
                👤 Información del Autor
              </h2>
              <p className="modal-subtitle">
                Detalles completos del registro
              </p>
            </div>
            <button 
              onClick={onClose}
              className="modal-close-btn"
              type="button"
              aria-label="Cerrar modal"
            >
              ✕
            </button>
          </div>

          {/* Body */}
          <div className="modal-body">
            {/* Main Info Section */}
            <div className="info-section">
              <h3 className="section-title">📋 Información Personal</h3>
              <div className="info-grid">
                <div className="info-item">
                  <label className="info-label">ID:</label>
                  <span className="info-value mono">{author.id}</span>
                </div>
                
                <div className="info-item">
                  <label className="info-label">Nombre Completo:</label>
                  <span className="info-value primary">
                    {author.firstName} {author.lastName}
                  </span>
                </div>

                <div className="info-item">
                  <label className="info-label">Nacionalidad:</label>
                  <span className="info-value">
                    {author.nationality || "-"}
                  </span>
                </div>

                <div className="info-item">
                  <label className="info-label">Fecha de Nacimiento:</label>
                  <span className="info-value">
                    {formatDate(author.birthDate)}
                  </span>
                </div>
              </div>
            </div>

            {/* Biography Section */}
            {author.biography && (
              <div className="info-section">
                <h3 className="section-title">📖 Biografía</h3>
                <div className="biography-content">
                  <p className="biography-text">
                    {author.biography}
                  </p>
                </div>
              </div>
            )}

            {/* Metadata Section */}
            <div className="info-section">
              <h3 className="section-title">🕒 Información del Sistema</h3>
              <div className="info-grid">
                <div className="info-item">
                  <label className="info-label">Fecha de Creación:</label>
                  <span className="info-value">
                    {formatDateTime(author.createdAt)}
                  </span>
                </div>
                
                <div className="info-item">
                  <label className="info-label">Última Actualización:</label>
                  <span className="info-value">
                    {formatDateTime(author.updatedAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <Button 
              variant="secondary" 
              onClick={onClose}
              className="modal-close-action"
            >
              Cerrar
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}