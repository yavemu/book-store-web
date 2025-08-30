'use client';

import { useEffect } from 'react';
import Button from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
}

export default function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md',
  showCloseButton = true 
}: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  return (
    <div className="modal-overlay">
      <div className="modal-backdrop" onClick={onClose} data-testid="modal-backdrop" />
      <div 
        className={`modal-content ${sizeClasses[size]}`}
        role="dialog"
        aria-labelledby="modal-title"
        tabIndex={-1}
        ref={(el) => el?.focus()}
      >
        <div className="modal-header">
          <h2 id="modal-title" className="modal-title">{title}</h2>
          {showCloseButton && (
            <Button
              variant="link"
              onClick={onClose}
              className="modal-close-button"
              aria-label="Cerrar modal"
            >
              ✕
            </Button>
          )}
        </div>
        
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
}