'use client';

import { useState, useEffect } from 'react';
import { Modal, LoadingSpinner, ValidationError } from '@/components/ui';
import { Form, Input, Textarea, Button } from '@/components/forms';
import { authorsApi } from '@/services/api/entities/authors';
import { updateAuthorSchema, UpdateAuthorFormData } from '@/services/validation';
import { validateWithZodSafe } from '@/services/validation';
import { BookAuthor } from '@/types/authors';

interface EditAuthorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (author: BookAuthor) => void;
  author: BookAuthor | null;
}

export function EditAuthorModal({ isOpen, onClose, onSuccess, author }: EditAuthorModalProps) {
  const [formData, setFormData] = useState<UpdateAuthorFormData>({
    firstName: '',
    lastName: '',
    nationality: '',
    birthDate: '',
    biography: '',
    isActive: true,
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (author) {
      setFormData({
        firstName: author.firstName,
        lastName: author.lastName,
        nationality: author.nationality,
        birthDate: author.birthDate ? author.birthDate.split('T')[0] : '',
        biography: author.biography || '',
        isActive: author.isActive ?? true,
      });
    }
  }, [author]);

  const validateForm = (): boolean => {
    const validation = validateWithZodSafe(updateAuthorSchema, formData);
    
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

    if (!author || !validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const updatedAuthor = await authorsApi.update(author.id, formData);
      
      setErrors({});
      onSuccess(updatedAuthor);
      onClose();
    } catch (err: unknown) {
      console.error('Error updating author:', err);
      const errorMessage = (err as { response?: { data?: { message?: string } } }).response?.data?.message || 'Error al actualizar el autor';
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
      title="Editar Autor"
      size="md"
    >
      <Form onSubmit={handleSubmit}>
        {errors.general && (
          <ValidationError message={errors.general} />
        )}
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nombre"
              type="text"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              required
              placeholder="Nombre del autor"
            />
            
            <Input
              label="Apellido"
              type="text"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              required
              placeholder="Apellido del autor"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nacionalidad"
              type="text"
              value={formData.nationality}
              onChange={(e) => handleInputChange('nationality', e.target.value)}
              required
              placeholder="Ej: Colombiana, Mexicana..."
            />
            
            <Input
              label="Fecha de Nacimiento"
              type="date"
              value={formData.birthDate}
              onChange={(e) => handleInputChange('birthDate', e.target.value)}
            />
          </div>
          
          <Textarea
            label="Biografía"
            value={formData.biography || ''}
            onChange={(e) => handleInputChange('biography', e.target.value)}
            placeholder="Biografía del autor (opcional)"
            rows={4}
          />
          
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => handleInputChange('isActive', e.target.checked)}
              className="mr-2"
            />
            <span className="text-sm font-medium text-gray-700">
              Autor activo
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
              'Actualizar Autor'
            )}
          </Button>
        </div>
      </Form>
    </Modal>
  );
}