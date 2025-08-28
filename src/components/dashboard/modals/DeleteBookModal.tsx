'use client';

import { useState } from 'react';
import { Modal, LoadingSpinner, ErrorMessage } from '@/components/ui';
import { Button } from '@/components/forms';
import { bookCatalogApi } from '@/services/api';
import { BookCatalog } from '@/types/domain';

interface DeleteBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  book: BookCatalog | null;
}

export function DeleteBookModal({ isOpen, onClose, onSuccess, book }: DeleteBookModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!book) return;

    try {
      setLoading(true);
      setError(null);
      
      await bookCatalogApi.delete(book.id);
      
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Error deleting book:', err);
      setError(err instanceof Error ? err.message : 'Error al eliminar el libro');
    } finally {
      setLoading(false);
    }
  };

  if (!book) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Confirmar Eliminación"
      size="sm"
    >
      <div className="space-y-4">
        {error && <ErrorMessage error={error} />}
        
        <div className="text-sm text-gray-700">
          <p className="mb-3">
            ¿Estás seguro de que deseas eliminar el siguiente libro?
          </p>
          
          <div className="bg-gray-50 rounded-lg p-4 border">
            <div className="flex items-start space-x-4">
              {book.coverImageUrl && (
                <div className="w-12 h-16 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                  <img 
                    src={book.coverImageUrl} 
                    alt={`Portada de ${book.title}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
              )}
              
              <div className="min-w-0 flex-1">
                <h4 className="font-medium text-gray-900 truncate">
                  {book.title}
                </h4>
                <p className="text-sm text-gray-500">
                  ISBN: {book.isbnCode}
                </p>
                {book.genre && (
                  <p className="text-sm text-gray-500">
                    Género: {book.genre.name}
                  </p>
                )}
                <p className="text-sm text-gray-500">
                  Precio: ${Number(book.price).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
          
          <p className="text-red-600 font-medium mt-3">
            ⚠️ Esta acción no se puede deshacer
          </p>
          <p className="text-sm text-gray-600 mt-1">
            El libro será marcado como eliminado y no estará disponible en el catálogo.
          </p>
        </div>
        
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleDelete}
            disabled={loading}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-300"
          >
            {loading ? (
              <>
                <LoadingSpinner size="small" />
                <span className="ml-2">Eliminando...</span>
              </>
            ) : (
              'Eliminar Libro'
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
}