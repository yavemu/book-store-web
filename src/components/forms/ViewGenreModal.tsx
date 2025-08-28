'use client';

import { Modal } from '@/components/ui';
import { Button } from '@/components/forms';
import { BookGenre } from '@/types/genres';

interface ViewGenreModalProps {
  isOpen: boolean;
  onClose: () => void;
  genre: BookGenre | null;
}

export function ViewGenreModal({ isOpen, onClose, genre }: ViewGenreModalProps) {
  if (!genre) return null;

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('es-ES', {
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
      title="Detalles del Género"
      size="md"
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ID
            </label>
            <p className="text-sm text-gray-600 font-mono bg-gray-50 p-2 rounded">
              {genre.id}
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre
            </label>
            <p className="text-gray-900 text-lg font-semibold">
              {genre.name}
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <p className="text-gray-700">
              {genre.description || 'Sin descripción'}
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estado
            </label>
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
              genre.isActive 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {genre.isActive ? 'Activo' : 'Inactivo'}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Creación
              </label>
              <p className="text-sm text-gray-600">
                {formatDate(genre.createdAt)}
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Última Actualización
              </label>
              <p className="text-sm text-gray-600">
                {formatDate(genre.updatedAt)}
              </p>
            </div>
          </div>
          
          {genre.deletedAt && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Eliminación
              </label>
              <p className="text-sm text-red-600">
                {formatDate(genre.deletedAt)}
              </p>
            </div>
          )}
        </div>
        
        <div className="flex justify-end pt-4 border-t">
          <Button
            type="button"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            onClick={onClose}
          >
            Cerrar
          </Button>
        </div>
      </div>
    </Modal>
  );
}