'use client';

import { useState, useEffect } from 'react';
import { Modal, LoadingSpinner, ValidationError } from '@/components/ui';
import { Form, Input, Textarea, Button, SearchSelect } from '@/components/forms';
import { bookCatalogApi, genresApi, publishingHousesApi } from '@/services/api';
import { BookCatalog, UpdateBookCatalogDto, Genre, PublishingHouse } from '@/types/domain';

interface EditBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  book: BookCatalog | null;
}

interface FormData extends UpdateBookCatalogDto {
  genre?: Genre;
  publisher?: PublishingHouse;
}

export function EditBookModal({ isOpen, onClose, onSuccess, book }: EditBookModalProps) {
  const [formData, setFormData] = useState<FormData>({});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isbnChecking, setIsbnChecking] = useState(false);
  const [isbnExists, setIsbnExists] = useState(false);

  useEffect(() => {
    if (book && isOpen) {
      setFormData({
        title: book.title,
        isbnCode: book.isbnCode,
        price: book.price,
        isAvailable: book.isAvailable,
        stockQuantity: book.stockQuantity,
        coverImageUrl: book.coverImageUrl || '',
        publicationDate: book.publicationDate ? new Date(book.publicationDate).toISOString().split('T')[0] : '',
        pageCount: book.pageCount,
        summary: book.summary || '',
        genreId: book.genreId,
        publisherId: book.publisherId,
        genre: book.genre,
        publisher: book.publisher,
      });
      setErrors({});
      setIsbnExists(false);
    }
  }, [book, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title?.trim()) {
      newErrors.title = 'El título es requerido';
    }

    if (!formData.isbnCode?.trim()) {
      newErrors.isbnCode = 'El código ISBN es requerido';
    } else if (formData.isbnCode.length < 10 || formData.isbnCode.length > 13) {
      newErrors.isbnCode = 'El código ISBN debe tener entre 10 y 13 caracteres';
    }

    if (formData.price !== undefined && (formData.price < 0)) {
      newErrors.price = 'El precio debe ser mayor o igual a 0';
    }

    if (formData.stockQuantity !== undefined && formData.stockQuantity < 0) {
      newErrors.stockQuantity = 'El stock no puede ser negativo';
    }

    if (formData.pageCount !== undefined && formData.pageCount < 1) {
      newErrors.pageCount = 'El número de páginas debe ser mayor a 0';
    }

    if (!formData.genreId) {
      newErrors.genre = 'El género es requerido';
    }

    if (!formData.publisherId) {
      newErrors.publisher = 'La editorial es requerida';
    }

    if (isbnExists) {
      newErrors.isbnCode = 'Este ISBN ya existe en el catálogo';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const checkIsbn = async (isbn: string) => {
    if (isbn.length >= 10 && book && isbn !== book.isbnCode) {
      try {
        setIsbnChecking(true);
        const response = await bookCatalogApi.checkIsbn(isbn);
        setIsbnExists(response.exists);
        
        if (response.exists) {
          setErrors(prev => ({ ...prev, isbnCode: 'Este ISBN ya existe en el catálogo' }));
        }
      } catch (err) {
        console.error('Error checking ISBN:', err);
      } finally {
        setIsbnChecking(false);
      }
    }
  };

  const searchGenres = async (term: string) => {
    try {
      const genres = await genresApi.search(term);
      return genres.map(genre => ({
        id: genre.id,
        label: genre.name,
        value: genre
      }));
    } catch (err) {
      console.error('Error searching genres:', err);
      return [];
    }
  };

  const createGenre = async (name: string) => {
    try {
      const newGenre = await genresApi.create({ name });
      return {
        id: newGenre.id,
        label: newGenre.name,
        value: newGenre
      };
    } catch (err) {
      console.error('Error creating genre:', err);
      throw err;
    }
  };

  const searchPublishers = async (term: string) => {
    try {
      const publishers = await publishingHousesApi.search(term);
      return publishers.map(publisher => ({
        id: publisher.id,
        label: publisher.name,
        value: publisher
      }));
    } catch (err) {
      console.error('Error searching publishers:', err);
      return [];
    }
  };

  const createPublisher = async (name: string) => {
    try {
      const newPublisher = await publishingHousesApi.create({ name });
      return {
        id: newPublisher.id,
        label: newPublisher.name,
        value: newPublisher
      };
    } catch (err) {
      console.error('Error creating publisher:', err);
      throw err;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!book || !validateForm()) {
      return;
    }

    try {
      setLoading(true);
      
      const submitData: UpdateBookCatalogDto = {
        title: formData.title,
        isbnCode: formData.isbnCode,
        price: formData.price,
        isAvailable: formData.isAvailable,
        stockQuantity: formData.stockQuantity,
        coverImageUrl: formData.coverImageUrl || undefined,
        publicationDate: formData.publicationDate || undefined,
        pageCount: formData.pageCount || undefined,
        summary: formData.summary || undefined,
        genreId: formData.genreId,
        publisherId: formData.publisherId,
      };

      await bookCatalogApi.update(book.id, submitData);
      
      setErrors({});
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Error updating book:', err);
      setErrors({ general: 'Error al actualizar el libro. Por favor, intenta de nuevo.' });
    } finally {
      setLoading(false);
    }
  };

  const handleGenreChange = (option: { id: string; label: string; value: Genre } | null) => {
    if (option) {
      setFormData(prev => ({
        ...prev,
        genre: option.value,
        genreId: option.value.id
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        genre: undefined,
        genreId: ''
      }));
    }
    
    if (errors.genre) {
      setErrors(prev => ({ ...prev, genre: '' }));
    }
  };

  const handlePublisherChange = (option: { id: string; label: string; value: PublishingHouse } | null) => {
    if (option) {
      setFormData(prev => ({
        ...prev,
        publisher: option.value,
        publisherId: option.value.id
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        publisher: undefined,
        publisherId: ''
      }));
    }
    
    if (errors.publisher) {
      setErrors(prev => ({ ...prev, publisher: '' }));
    }
  };

  if (!book) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Editar Libro"
      size="lg"
    >
      <Form onSubmit={handleSubmit}>
        {errors.general && (
          <ValidationError message={errors.general} />
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Input
              label="Título"
              type="text"
              value={formData.title || ''}
              onChange={(e) => handleInputChange('title', e.target.value)}
              required
              placeholder="Título del libro"
              error={errors.title}
            />
          </div>
          
          <div>
            <div className="relative">
              <Input
                label="Código ISBN"
                type="text"
                value={formData.isbnCode || ''}
                onChange={(e) => {
                  const isbn = e.target.value;
                  handleInputChange('isbnCode', isbn);
                  checkIsbn(isbn);
                }}
                required
                placeholder="978-0-123456-78-9"
                error={errors.isbnCode}
              />
              {isbnChecking && (
                <div className="absolute right-3 top-8">
                  <LoadingSpinner size="small" />
                </div>
              )}
            </div>
          </div>
          
          <div>
            <Input
              label="Precio"
              type="number"
              step="0.01"
              min="0"
              value={formData.price || ''}
              onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
              required
              placeholder="0.00"
              error={errors.price}
            />
          </div>
          
          <div>
            <Input
              label="Stock"
              type="number"
              min="0"
              value={formData.stockQuantity || ''}
              onChange={(e) => handleInputChange('stockQuantity', parseInt(e.target.value) || 0)}
              placeholder="0"
              error={errors.stockQuantity}
            />
          </div>
          
          <div>
            <Input
              label="Páginas"
              type="number"
              min="1"
              value={formData.pageCount || ''}
              onChange={(e) => handleInputChange('pageCount', e.target.value ? parseInt(e.target.value) : undefined)}
              placeholder="Número de páginas"
              error={errors.pageCount}
            />
          </div>
          
          <div>
            <Input
              label="Fecha de publicación"
              type="date"
              value={formData.publicationDate || ''}
              onChange={(e) => handleInputChange('publicationDate', e.target.value)}
            />
          </div>
          
          <div>
            <Input
              label="URL de portada"
              type="url"
              value={formData.coverImageUrl || ''}
              onChange={(e) => handleInputChange('coverImageUrl', e.target.value)}
              placeholder="https://ejemplo.com/imagen.jpg"
            />
          </div>
          
          <div>
            <SearchSelect
              label="Género"
              placeholder="Buscar género..."
              value={formData.genre ? { id: formData.genre.id, label: formData.genre.name } : null}
              onChange={handleGenreChange}
              onSearch={searchGenres}
              onCreate={createGenre}
              required
              error={errors.genre}
              createLabel="Crear género"
            />
          </div>
          
          <div>
            <SearchSelect
              label="Editorial"
              placeholder="Buscar editorial..."
              value={formData.publisher ? { id: formData.publisher.id, label: formData.publisher.name } : null}
              onChange={handlePublisherChange}
              onSearch={searchPublishers}
              onCreate={createPublisher}
              required
              error={errors.publisher}
              createLabel="Crear editorial"
            />
          </div>
          
          <div className="md:col-span-2">
            <Textarea
              label="Resumen"
              value={formData.summary || ''}
              onChange={(e) => handleInputChange('summary', e.target.value)}
              placeholder="Descripción del libro..."
              rows={3}
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isAvailable || false}
                onChange={(e) => handleInputChange('isAvailable', e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700">
                Disponible para venta
              </span>
            </label>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 pt-4 border-t mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={loading || isbnChecking || isbnExists}
          >
            {loading ? (
              <>
                <LoadingSpinner size="small" />
                <span className="ml-2">Actualizando...</span>
              </>
            ) : (
              'Actualizar Libro'
            )}
          </Button>
        </div>
      </Form>
    </Modal>
  );
}