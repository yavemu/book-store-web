'use client';

import { useState, useEffect } from 'react';
import { Modal, LoadingSpinner, ValidationError } from '@/components/ui';
import { Form, Input, Textarea, Button } from '@/components/forms';
import { genresApi } from '@/services/api';
import { updateGenreSchema, UpdateGenreFormData } from '@/services/validation';
import { validateWithZodSafe } from '@/services/validation';
import { BookGenre } from '@/types/genres';

interface EditGenreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (genre: BookGenre) => void;
  genre: BookGenre | null;
}

export function EditGenreModal({ isOpen, onClose, onSuccess, genre }: EditGenreModalProps) {
  const [formData, setFormData] = useState<UpdateGenreFormData>({
    name: '',
    description: '',
    isActive: true,
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (genre) {
      setFormData({
        name: genre.name,
        description: genre.description || '',
        isActive: genre.isActive ?? true,
      });
    }
  }, [genre]);

  const validateForm = (): boolean => {
    const validation = validateWithZodSafe(updateGenreSchema, formData);
    
    if (!validation.success) {
      const newErrors: Record<string, string> = {};
      Object.entries(validation.errors).forEach(([field, messages]) => {
        newErrors[field] = messages[0];
      });
      
      setErrors(newErrors);
      return false;
    }
    
    setErrors({});
    return true;
  };

  const handleInputChange = (name: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!genre || !validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const updatedGenre = await genresApi.update(genre.id, formData);
      
      setErrors({});
      onSuccess(updatedGenre);
      onClose();
    } catch (err: unknown) {
      console.error('Error updating genre:', err);
      const errorMessage = (err as { response?: { data?: { message?: string } } }).response?.data?.message || 'Error al actualizar el género';
      setErrors({ general: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setErrors({});
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Editar Género"
      size="md"
    >
      <Form onSubmit={handleSubmit}>
        {errors.general && (
          <ValidationError message={errors.general} />
        )}
        
        <div className="space-y-4">
          <Input
            label="Nombre del género"
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            required
            placeholder="Ej: Ficción, Misterio, Romance..."
          />
          
          <Textarea
            label="Descripción"
            value={formData.description || ''}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Descripción del género (opcional)"
            rows={3}
          />
          
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => handleInputChange('isActive', e.target.checked)}
              className="mr-2"
            />
            <span className="text-sm font-medium text-gray-700">
              Género activo
            </span>
          </label>
        </div>
        
        <div className="flex justify-end space-x-3 pt-4 border-t mt-6">
          <Button
            type="button"
            className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleClose}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? (
              <>
                <LoadingSpinner size="small" />
                <span className="ml-2">Actualizando...</span>
              </>
            ) : (
              'Actualizar Género'
            )}
          </Button>
        </div>
      </Form>
    </Modal>
  );
}