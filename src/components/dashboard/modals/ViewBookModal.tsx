'use client';

import { Modal } from '@/components/ui';
import { Button } from '@/components/forms';
import { BookCatalog } from '@/types/domain';
import { formatDate } from '@/utils/dateFormatter';

interface ViewBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit?: () => void;
  book: BookCatalog | null;
}

export function ViewBookModal({ isOpen, onClose, onEdit, book }: ViewBookModalProps) {
  if (!book) return null;

  const formatBookDate = (dateString?: string) => {
    if (!dateString) return 'No especificada';
    return formatDate(dateString);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Detalles del Libro"
      size="lg"
    >
      <div className="space-y-6">
        <div className="flex items-start space-x-6">
          <div className="w-32 h-40 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
            {book.coverImageUrl ? (
              <img 
                src={book.coverImageUrl} 
                alt={`Portada de ${book.title}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '';
                  target.style.display = 'none';
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                </svg>
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-gray-900 break-words">
                {book.title}
              </h2>
              <p className="text-lg text-gray-600 mt-1">
                ISBN: {book.isbnCode}
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Precio:</span>
                <span className="ml-2 text-green-600 font-semibold">
                  ${Number(book.price).toFixed(2)}
                </span>
              </div>
              
              <div>
                <span className="font-medium text-gray-700">Stock:</span>
                <span className="ml-2">{book.stockQuantity}</span>
              </div>
              
              <div>
                <span className="font-medium text-gray-700">Disponible:</span>
                <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${
                  book.isAvailable 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {book.isAvailable ? 'Sí' : 'No'}
                </span>
              </div>
              
              {book.pageCount && (
                <div>
                  <span className="font-medium text-gray-700">Páginas:</span>
                  <span className="ml-2">{book.pageCount}</span>
                </div>
              )}
              
              <div>
                <span className="font-medium text-gray-700">Publicación:</span>
                <span className="ml-2">{formatBookDate(book.publicationDate)}</span>
              </div>
              
              <div>
                <span className="font-medium text-gray-700">Género:</span>
                <span className="ml-2">{book.genre?.name || 'Sin género'}</span>
              </div>
              
              <div className="sm:col-span-2">
                <span className="font-medium text-gray-700">Editorial:</span>
                <span className="ml-2">{book.publisher?.name || 'Sin editorial'}</span>
                {book.publisher?.country && (
                  <span className="text-gray-500 ml-1">
                    ({book.publisher.country})
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {book.summary && (
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Resumen</h3>
            <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
              {book.summary}
            </p>
          </div>
        )}
        
        {book.authors && book.authors.length > 0 && (
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Autores</h3>
            <div className="flex flex-wrap gap-2">
              {book.authors.map((author) => (
                <span 
                  key={author.id}
                  className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                >
                  {author.firstName} {author.lastName}
                </span>
              ))}
            </div>
          </div>
        )}
        
        <div className="border-t pt-4 flex flex-col sm:flex-row gap-2 text-xs text-gray-500">
          <div>
            <span className="font-medium">Creado:</span>
            <span className="ml-1">{formatBookDate(book.createdAt)}</span>
          </div>
          <div>
            <span className="font-medium">Actualizado:</span>
            <span className="ml-1">{formatBookDate(book.updatedAt)}</span>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
          >
            Cerrar
          </Button>
          {onEdit && (
            <Button
              type="button"
              variant="primary"
              onClick={() => {
                onEdit();
                onClose();
              }}
            >
              Editar
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
}