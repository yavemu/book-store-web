'use client';

import { useState } from 'react';
import { Modal, LoadingSpinner } from '@/components/ui';
import { Button } from '@/components/forms';
import { authorsApi } from '@/services/api/entities/authors';
import { BookAuthor } from '@/types/authors';

interface DeleteAuthorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (authorId: string) => void;
  author: BookAuthor | null;
}

export function DeleteAuthorModal({ isOpen, onClose, onSuccess, author }: DeleteAuthorModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleDelete = async () => {
    if (!author) return;

    try {
      setLoading(true);
      setError('');
      
      await authorsApi.delete(author.id);
      onSuccess(author.id);
      onClose();
    } catch (err: unknown) {
      console.error('Error deleting author:', err);
      const errorMessage = (err as { response?: { data?: { message?: string } } }).response?.data?.message || 'Error al eliminar el autor';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setError('');
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Eliminar Autor"
      size="sm"
    >
      <div className="space-y-4">
        <p className="text-gray-600">
          ¿Estás seguro de que deseas eliminar al autor <strong>&quot;{author?.firstName} {author?.lastName}&quot;</strong>?
        </p>
        <p className="text-sm text-red-600">
          Esta acción no se puede deshacer. Todos los libros asociados a este autor perderán esta asociación.
        </p>
        
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}
        
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button
            type="button"
            className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleClose}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? (
              <>
                <LoadingSpinner size="small" />
                <span className="ml-2">Eliminando...</span>
              </>
            ) : (
              'Eliminar'
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
}