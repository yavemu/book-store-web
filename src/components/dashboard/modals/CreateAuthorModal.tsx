'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui';
import { Form, Input, Textarea, Button } from '@/components/forms';
import { authorsApi } from '@/services/api';
import { createAuthorSchema, CreateAuthorFormData } from '@/services/validation';
import { validateWithZodSafe } from '@/services/validation';

interface CreateAuthorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateAuthorModal({ isOpen, onClose, onSuccess }: CreateAuthorModalProps) {
  const [formData, setFormData] = useState<CreateBookAuthorFormData>({
    firstName: '',
    lastName: '',
    biography: '',
    birthDate: '',
    nationality: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const validation = validateWithZodSafe(createAuthorSchema, formData);
    
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

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      await authorsApi.create(formData);
      
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        biography: '',
        birthDate: '',
        nationality: '',
      });
      setErrors({});
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Error creating author:', err);
      setErrors({ general: 'Error al crear el autor. Por favor, intenta de nuevo.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Crear Nuevo Autor"
      size="lg"
    >
      <Form onSubmit={handleSubmit}>
        {errors.general && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {errors.general}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Input
              label="Nombre"
              type="text"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              required
              placeholder="Nombre del autor"
              error={errors.firstName}
            />
          </div>
          
          <div>
            <Input
              label="Apellido"
              type="text"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              required
              placeholder="Apellido del autor"
              error={errors.lastName}
            />
          </div>
          
          <div>
            <Input
              label="Fecha de Nacimiento"
              type="date"
              value={formData.birthDate || ''}
              onChange={(e) => handleInputChange('birthDate', e.target.value)}
              error={errors.birthDate}
            />
          </div>
          
          <div>
            <Input
              label="Nacionalidad"
              type="text"
              value={formData.nationality || ''}
              onChange={(e) => handleInputChange('nationality', e.target.value)}
              placeholder="Ej: Española, Mexicana, Argentina..."
              error={errors.nationality}
            />
          </div>
          
          <div className="md:col-span-2">
            <Textarea
              label="Biografía"
              value={formData.biography || ''}
              onChange={(e) => handleInputChange('biography', e.target.value)}
              placeholder="Breve biografía del autor..."
              rows={4}
              error={errors.biography}
            />
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
            disabled={loading}
          >
            {loading ? 'Creando...' : 'Crear Autor'}
          </Button>
        </div>
      </Form>
    </Modal>
  );
}