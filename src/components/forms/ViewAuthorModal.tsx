'use client';

import { Modal } from '@/components/ui';
import { Button } from '@/components/forms';
import { BookAuthor } from '@/types/authors';

interface ViewAuthorModalProps {
  isOpen: boolean;
  onClose: () => void;
  author: BookAuthor | null;
}

export function ViewAuthorModal({ isOpen, onClose, author }: ViewAuthorModalProps) {
  if (!author) return null;

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatBirthDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Detalles del Autor"
      size="md"
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ID
            </label>
            <p className="text-sm text-gray-600 font-mono bg-gray-50 p-2 rounded">
              {author.id}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre
              </label>
              <p className="text-gray-900 text-lg font-semibold">
                {author.firstName}
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Apellido
              </label>
              <p className="text-gray-900 text-lg font-semibold">
                {author.lastName}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nacionalidad
              </label>
              <p className="text-gray-700">
                {author.nationality}
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Nacimiento
              </label>
              <p className="text-gray-700">
                {author.birthDate ? formatBirthDate(author.birthDate) : 'No especificada'}
              </p>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Biografía
            </label>
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-gray-700 whitespace-pre-wrap">
                {author.biography || 'Sin biografía disponible'}
              </p>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estado
            </label>
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
              author.isActive 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {author.isActive ? 'Activo' : 'Inactivo'}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Creación
              </label>
              <p className="text-sm text-gray-600">
                {formatDate(author.createdAt)}
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Última Actualización
              </label>
              <p className="text-sm text-gray-600">
                {formatDate(author.updatedAt)}
              </p>
            </div>
          </div>
          
          {author.deletedAt && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Eliminación
              </label>
              <p className="text-sm text-red-600">
                {formatDate(author.deletedAt)}
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