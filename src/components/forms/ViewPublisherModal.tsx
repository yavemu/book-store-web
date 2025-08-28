'use client';

import { Modal } from '@/components/ui';
import { Button } from '@/components/forms';
import { PublishingHouse } from '@/types/publishing-houses';

interface ViewPublisherModalProps {
  isOpen: boolean;
  onClose: () => void;
  publisher: PublishingHouse | null;
}

export function ViewPublisherModal({ isOpen, onClose, publisher }: ViewPublisherModalProps) {
  if (!publisher) return null;

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
      title="Detalles de la Editorial"
      size="lg"
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ID
            </label>
            <p className="text-sm text-gray-600 font-mono bg-gray-50 p-2 rounded">
              {publisher.id}
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre
            </label>
            <p className="text-gray-900 text-lg font-semibold">
              {publisher.name}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                País
              </label>
              <p className="text-gray-700">
                {publisher.country}
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Año de Fundación
              </label>
              <p className="text-gray-700">
                {publisher.foundedYear || 'No especificado'}
              </p>
            </div>
          </div>
          
          {publisher.description && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción
              </label>
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-gray-700 whitespace-pre-wrap">
                  {publisher.description}
                </p>
              </div>
            </div>
          )}
          
          {publisher.address && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dirección
              </label>
              <p className="text-gray-700">
                {publisher.address}
              </p>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {publisher.phone && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono
                </label>
                <p className="text-gray-700">
                  {publisher.phone}
                </p>
              </div>
            )}
            
            {publisher.email && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <p className="text-gray-700">
                  <a 
                    href={`mailto:${publisher.email}`} 
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {publisher.email}
                  </a>
                </p>
              </div>
            )}
            
            {publisher.website && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sitio Web
                </label>
                <p className="text-gray-700">
                  <a 
                    href={publisher.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {publisher.website}
                  </a>
                </p>
              </div>
            )}
          </div>
          
          {publisher.logoUrl && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Logo
              </label>
              <div className="flex items-center space-x-3">
                <img 
                  src={publisher.logoUrl} 
                  alt={`Logo de ${publisher.name}`}
                  className="w-16 h-16 object-contain bg-gray-50 rounded-md border"
                />
                <p className="text-sm text-gray-600 break-all">
                  {publisher.logoUrl}
                </p>
              </div>
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estado
            </label>
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
              publisher.isActive 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {publisher.isActive ? 'Activo' : 'Inactivo'}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Creación
              </label>
              <p className="text-sm text-gray-600">
                {formatDate(publisher.createdAt)}
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Última Actualización
              </label>
              <p className="text-sm text-gray-600">
                {formatDate(publisher.updatedAt)}
              </p>
            </div>
          </div>
          
          {publisher.deletedAt && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Eliminación
              </label>
              <p className="text-sm text-red-600">
                {formatDate(publisher.deletedAt)}
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