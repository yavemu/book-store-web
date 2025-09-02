'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useBookRelations } from '@/hooks/useBookRelations';
import { booksApi } from '@/services/api/entities/books';
import { CreateBookDto } from '@/types/api/entities';

interface BookFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  entity?: any; // For edit mode
  isEditing?: boolean;
}

export default function BookForm({
  isOpen,
  onClose,
  onSuccess,
  entity,
  isEditing = false
}: BookFormProps) {
  const { genres, publishers, loading: relationsLoading } = useBookRelations();
  
  const [formData, setFormData] = useState<Partial<CreateBookDto>>({
    title: '',
    isbnCode: '',
    price: 0,
    stockQuantity: 0,
    publicationDate: '',
    pageCount: 0,
    summary: '',
    genreId: '',
    publisherId: '',
    isAvailable: true
  });
  
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  // Initialize form data when modal opens or entity changes
  useEffect(() => {
    if (isOpen) {
      if (isEditing && entity) {
        // Pre-populate form with entity data for editing
        setFormData({
          title: entity.title ?? '',
          isbnCode: entity.isbnCode ?? '',
          price: entity.price ?? 0,
          stockQuantity: entity.stockQuantity ?? 0,
          publicationDate: entity.publicationDate ?? '',
          pageCount: entity.pageCount ?? 0,
          summary: entity.summary ?? '',
          genreId: entity.genreId ?? '',
          publisherId: entity.publisherId ?? '',
          isAvailable: entity.isAvailable ?? true
        });
      } else {
        // Clear form for creation
        setFormData({
          title: '',
          isbnCode: '',
          price: 0,
          stockQuantity: 0,
          publicationDate: '',
          pageCount: 0,
          summary: '',
          genreId: '',
          publisherId: '',
          isAvailable: true
        });
      }
      setErrors({});
      setCoverImage(null);
    }
  }, [isOpen, isEditing, entity]);

  const handleInputChange = useCallback((key: keyof CreateBookDto, value: any) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
    
    // Clear error for this field
    if (errors[key]) {
      setErrors(prev => ({
        ...prev,
        [key]: ''
      }));
    }
  }, [errors]);

  const handleFileChange = useCallback((file: File | null) => {
    setCoverImage(file);
    
    // Clear error for cover image
    if (errors.coverImage) {
      setErrors(prev => ({
        ...prev,
        coverImage: ''
      }));
    }
  }, [errors]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title?.trim()) {
      newErrors.title = 'El título es requerido';
    }
    
    if (!formData.isbnCode?.trim()) {
      newErrors.isbnCode = 'El código ISBN es requerido';
    }
    
    if (!formData.price || formData.price <= 0) {
      newErrors.price = 'El precio debe ser mayor a 0';
    }
    
    if (!formData.stockQuantity || formData.stockQuantity < 0) {
      newErrors.stockQuantity = 'La cantidad en stock debe ser 0 o mayor';
    }
    
    if (!formData.genreId) {
      newErrors.genreId = 'Debe seleccionar un género';
    }
    
    if (!formData.publisherId) {
      newErrors.publisherId = 'Debe seleccionar una editorial';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setSaving(true);
    
    try {
      const bookData = {
        ...formData,
        price: Number(formData.price),
        stockQuantity: Number(formData.stockQuantity),
        pageCount: Number(formData.pageCount) || undefined
      } as CreateBookDto;

      if (isEditing && entity) {
        // Update book
        await booksApi.update(entity.id, bookData);
        
        // Upload image if provided
        if (coverImage) {
          await booksApi.uploadCover(entity.id, coverImage);
        }
      } else {
        // Create new book with image
        await booksApi.createWithImage(bookData, coverImage || undefined);
      }

      onSuccess();
      onClose();
      
    } catch (error: any) {
      console.error('Error saving book:', error);
      setErrors({ 
        _general: error.message || 'Error al guardar el libro'
      });
    } finally {
      setSaving(false);
    }
  };

  if (relationsLoading) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Cargando...">
        <div className="loading-container">
          <div className="loading-spinner">🔄</div>
          <p>Cargando datos...</p>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? `Editar Libro` : `Crear Nuevo Libro`}
    >
      <form onSubmit={handleSubmit} className="book-form">
        {errors._general && (
          <div className="error-message general-error">
            {errors._general}
          </div>
        )}

        {/* Título */}
        <div className="form-group">
          <label className="form-label">
            Título <span className="required">*</span>
          </label>
          <Input
            type="text"
            value={formData.title || ''}
            onChange={(value) => handleInputChange('title', value)}
            placeholder="Ej: Cien años de soledad"
            className={errors.title ? 'error' : ''}
          />
          {errors.title && <span className="error-text">{errors.title}</span>}
        </div>

        {/* ISBN */}
        <div className="form-group">
          <label className="form-label">
            Código ISBN <span className="required">*</span>
          </label>
          <Input
            type="text"
            value={formData.isbnCode || ''}
            onChange={(value) => handleInputChange('isbnCode', value)}
            placeholder="Ej: 978-3-16-148410-0"
            className={errors.isbnCode ? 'error' : ''}
          />
          {errors.isbnCode && <span className="error-text">{errors.isbnCode}</span>}
        </div>

        {/* Género */}
        <div className="form-group">
          <label className="form-label">
            Género <span className="required">*</span>
          </label>
          <select
            value={formData.genreId || ''}
            onChange={(e) => handleInputChange('genreId', e.target.value)}
            className={`form-select ${errors.genreId ? 'error' : ''}`}
          >
            <option value="">Seleccionar género...</option>
            {genres.map(genre => (
              <option key={genre.value} value={genre.value}>
                {genre.label}
              </option>
            ))}
          </select>
          {errors.genreId && <span className="error-text">{errors.genreId}</span>}
        </div>

        {/* Editorial */}
        <div className="form-group">
          <label className="form-label">
            Editorial <span className="required">*</span>
          </label>
          <select
            value={formData.publisherId || ''}
            onChange={(e) => handleInputChange('publisherId', e.target.value)}
            className={`form-select ${errors.publisherId ? 'error' : ''}`}
          >
            <option value="">Seleccionar editorial...</option>
            {publishers.map(publisher => (
              <option key={publisher.value} value={publisher.value}>
                {publisher.label}
              </option>
            ))}
          </select>
          {errors.publisherId && <span className="error-text">{errors.publisherId}</span>}
        </div>

        {/* Precio */}
        <div className="form-group">
          <label className="form-label">
            Precio <span className="required">*</span>
          </label>
          <Input
            type="number"
            value={formData.price || 0}
            onChange={(value) => handleInputChange('price', Number(value))}
            placeholder="Ej: 25.99"
            step="0.01"
            min="0"
            className={errors.price ? 'error' : ''}
          />
          {errors.price && <span className="error-text">{errors.price}</span>}
        </div>

        {/* Stock */}
        <div className="form-group">
          <label className="form-label">
            Cantidad en Stock <span className="required">*</span>
          </label>
          <Input
            type="number"
            value={formData.stockQuantity || 0}
            onChange={(value) => handleInputChange('stockQuantity', Number(value))}
            placeholder="Ej: 100"
            min="0"
            className={errors.stockQuantity ? 'error' : ''}
          />
          {errors.stockQuantity && <span className="error-text">{errors.stockQuantity}</span>}
        </div>

        {/* Fecha de Publicación */}
        <div className="form-group">
          <label className="form-label">Fecha de Publicación</label>
          <Input
            type="date"
            value={formData.publicationDate || ''}
            onChange={(value) => handleInputChange('publicationDate', value)}
          />
        </div>

        {/* Número de Páginas */}
        <div className="form-group">
          <label className="form-label">Número de Páginas</label>
          <Input
            type="number"
            value={formData.pageCount || 0}
            onChange={(value) => handleInputChange('pageCount', Number(value))}
            placeholder="Ej: 350"
            min="0"
          />
        </div>

        {/* Resumen */}
        <div className="form-group">
          <label className="form-label">Resumen/Descripción</label>
          <textarea
            value={formData.summary || ''}
            onChange={(e) => handleInputChange('summary', e.target.value)}
            placeholder="Descripción del libro..."
            className="form-textarea"
            rows={4}
          />
        </div>

        {/* Imagen de Portada */}
        <div className="form-group">
          <label className="form-label">Imagen de Portada</label>
          <input
            type="file"
            onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
            accept="image/*"
            className="form-file"
          />
          {coverImage && (
            <span className="file-selected">
              📁 {coverImage.name}
            </span>
          )}
        </div>

        {/* Disponible */}
        <div className="form-group">
          <label className="checkbox-container">
            <input
              type="checkbox"
              checked={formData.isAvailable ?? true}
              onChange={(e) => handleInputChange('isAvailable', e.target.checked)}
              className="form-checkbox"
            />
            <span className="checkbox-label">Disponible</span>
          </label>
        </div>

        {/* Action Buttons */}
        <div className="form-actions">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={saving}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={saving}
            disabled={saving}
          >
            {saving 
              ? (isEditing ? 'Actualizando...' : 'Creando...') 
              : (isEditing ? 'Actualizar' : 'Crear')
            }
          </Button>
        </div>
      </form>
    </Modal>
  );
}