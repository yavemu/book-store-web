'use client';

import { useState, useEffect } from 'react';
import { Modal, LoadingSpinner, ValidationError } from '@/components/ui';
import { Form, Input, Textarea, Button, SearchSelect, Select } from '@/components/forms';
import { bookCatalogApi, genresApi, publishingHousesApi } from '@/services/api';
import { BookCatalog, Genre, PublishingHouse } from '@/types/domain';
import { updateBookSchema, UpdateBookFormData } from '@/services/validation';
import { validateWithZodSafe } from '@/services/validation';

interface EditBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  book: BookCatalog | null;
}

interface FormData {
  title?: string;
  subtitle?: string;
  isbn?: string;
  description?: string;
  language?: string;
  publishedDate?: string;
  pages?: number;
  price?: number;
  stock?: number;
  format?: 'paperback' | 'hardcover' | 'ebook' | 'audiobook';
  coverImageUrl?: string;
  publishingHouseId?: string;
  genreId?: string;
  isAvailable?: boolean;
  isActive?: boolean;
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
        subtitle: '',
        isbn: book.isbnCode,
        description: book.summary || '',
        language: 'Español',
        publishedDate: book.publicationDate ? new Date(book.publicationDate).toISOString().split('T')[0] : '',
        pages: book.pageCount || 1,
        price: book.price,
        stock: book.stockQuantity || 0,
        format: 'paperback',
        coverImageUrl: book.coverImageUrl || '',
        publishingHouseId: book.publisherId,
        genreId: book.genreId,
        isAvailable: book.isAvailable,
        isActive: true,
        genre: book.genre,
        publisher: book.publisher,
      });
      setErrors({});
      setIsbnExists(false);
    }
  }, [book, isOpen]);

  const validateForm = (): boolean => {
    const validationData: Partial<UpdateBookFormData> = {
      title: formData.title,
      subtitle: formData.subtitle,
      isbn: formData.isbn,
      description: formData.description,
      language: formData.language,
      publishedDate: formData.publishedDate,
      pages: formData.pages,
      price: formData.price,
      stock: formData.stock,
      format: formData.format,
      coverImageUrl: formData.coverImageUrl,
      publishingHouseId: formData.publishingHouseId,
      genreId: formData.genreId,
      isAvailable: formData.isAvailable,
      isActive: formData.isActive,
    };

    const validation = validateWithZodSafe(updateBookSchema, validationData);
    
    if (!validation.success) {
      const newErrors: Record<string, string> = {};
      Object.entries(validation.errors).forEach(([field, messages]) => {
        newErrors[field] = messages[0];
      });
      
      if (isbnExists) {
        newErrors.isbn = 'Este ISBN ya existe en el catálogo';
      }
      
      setErrors(newErrors);
      return false;
    }
    
    if (isbnExists) {
      setErrors({ isbn: 'Este ISBN ya existe en el catálogo' });
      return false;
    }
    
    setErrors({});
    return true;
  };

  const handleInputChange = (name: string, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const checkIsbn = async (isbn: string) => {
    const currentIsbn = book?.isbnCode;
    if (isbn.length >= 10 && book && isbn !== currentIsbn) {
      try {
        setIsbnChecking(true);
        const response = await bookCatalogApi.checkIsbn(isbn);
        setIsbnExists(response.exists);
        
        if (response.exists) {
          setErrors(prev => ({ ...prev, isbn: 'Este ISBN ya existe en el catálogo' }));
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
    } catch (err: unknown) {
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
    } catch (err: unknown) {
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
      
      const submitData: UpdateBookFormData = {
        title: formData.title,
        subtitle: formData.subtitle,
        isbn: formData.isbn,
        description: formData.description,
        language: formData.language,
        publishedDate: formData.publishedDate,
        pages: formData.pages,
        price: formData.price,
        stock: formData.stock,
        format: formData.format,
        coverImageUrl: formData.coverImageUrl,
        publishingHouseId: formData.publishingHouseId,
        genreId: formData.genreId,
        isAvailable: formData.isAvailable,
        isActive: formData.isActive,
      };

      // Convertir a formato API esperado
      const apiData = {
        title: submitData.title,
        subtitle: submitData.subtitle,
        isbn: submitData.isbn,
        description: submitData.description,
        language: submitData.language,
        publishedDate: submitData.publishedDate,
        pages: submitData.pages,
        price: submitData.price,
        stock: submitData.stock,
        format: submitData.format,
        coverImageUrl: submitData.coverImageUrl,
        publishingHouseId: submitData.publishingHouseId,
        genreId: submitData.genreId,
        isAvailable: submitData.isAvailable,
        isActive: submitData.isActive,
        // Mapear a campos legacy si es necesario
        isbnCode: submitData.isbn,
        stockQuantity: submitData.stock,
        pageCount: submitData.pages,
        summary: submitData.description,
        publicationDate: submitData.publishedDate,
        publisherId: submitData.publishingHouseId,
      };

      await bookCatalogApi.update(book.id, apiData);
      
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

  const handleGenreChange = (option: { id: string; label: string; value?: unknown } | null) => {
    const genre = option?.value as Genre | undefined;
    if (genre) {
      setFormData(prev => ({
        ...prev,
        genre: genre,
        genreId: genre.id
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

  const handlePublisherChange = (option: { id: string; label: string; value?: unknown } | null) => {
    const publisher = option?.value as PublishingHouse | undefined;
    if (publisher) {
      setFormData(prev => ({
        ...prev,
        publisher: publisher,
        publishingHouseId: publisher.id
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        publisher: undefined,
        publishingHouseId: ''
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
            />
          </div>
          
          <div className="md:col-span-2">
            <Input
              label="Subtítulo"
              type="text"
              value={formData.subtitle || ''}
              onChange={(e) => handleInputChange('subtitle', e.target.value)}
              placeholder="Subtítulo del libro (opcional)"
            />
          </div>
          
          <div>
            <div className="relative">
              <Input
                label="Código ISBN"
                type="text"
                value={formData.isbn || ''}
                onChange={(e) => {
                  const isbn = e.target.value;
                  handleInputChange('isbn', isbn);
                  checkIsbn(isbn);
                }}
                required
                placeholder="978-0-123456-78-9"
              />
              {isbnChecking && (
                <div className="absolute right-3 top-8">
                  <LoadingSpinner size="small" />
                </div>
              )}
            </div>
          </div>

          <div>
            <Select
              label="Idioma"
              value={formData.language || 'Español'}
              onChange={(e) => handleInputChange('language', e.target.value)}
              required
            >
              <option value="Español">Español</option>
              <option value="Inglés">Inglés</option>
              <option value="Francés">Francés</option>
              <option value="Alemán">Alemán</option>
              <option value="Italiano">Italiano</option>
              <option value="Portugués">Portugués</option>
              <option value="Catalán">Catalán</option>
              <option value="Otro">Otro</option>
            </Select>
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
            />
          </div>
          
          <div>
            <Input
              label="Stock"
              type="number"
              min="0"
              value={formData.stock || ''}
              onChange={(e) => handleInputChange('stock', parseInt(e.target.value) || 0)}
              placeholder="0"
            />
          </div>
          
          <div>
            <Input
              label="Páginas"
              type="number"
              min="1"
              value={formData.pages || ''}
              onChange={(e) => handleInputChange('pages', parseInt(e.target.value) || 1)}
              required
              placeholder="Número de páginas"
            />
          </div>
          
          <div>
            <Select
              label="Formato"
              value={formData.format || 'paperback'}
              onChange={(e) => handleInputChange('format', e.target.value as 'paperback' | 'hardcover' | 'ebook' | 'audiobook')}
              required
            >
              <option value="paperback">Tapa blanda</option>
              <option value="hardcover">Tapa dura</option>
              <option value="ebook">Libro electrónico</option>
              <option value="audiobook">Audiolibro</option>
            </Select>
          </div>
          
          <div>
            <Input
              label="Fecha de publicación"
              type="date"
              value={formData.publishedDate || ''}
              onChange={(e) => handleInputChange('publishedDate', e.target.value)}
              required
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
              createLabel="Crear editorial"
            />
          </div>
          
          <div className="md:col-span-2">
            <Textarea
              label="Descripción"
              value={formData.description || ''}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Descripción del libro..."
              rows={3}
            />
          </div>
          
          <div className="md:col-span-2">
            <div className="flex items-center space-x-6">
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
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isActive !== false}
                  onChange={(e) => handleInputChange('isActive', e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm font-medium text-gray-700">
                  Libro activo
                </span>
              </label>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 pt-4 border-t mt-6">
          <Button
            type="button"
            className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
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