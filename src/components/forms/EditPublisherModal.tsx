'use client';

import { useState, useEffect } from 'react';
import { Modal, LoadingSpinner, ValidationError } from '@/components/ui';
import { Form, Input, Textarea, Button, Select } from '@/components/forms';
import { publishingHousesApi } from '@/services/api';
import { updatePublishingHouseSchema, UpdatePublishingHouseFormData } from '@/services/validation';
import { validateWithZodSafe } from '@/services/validation';
import { PublishingHouse } from '@/types/publishing-houses';

interface EditPublisherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (publisher: PublishingHouse) => void;
  publisher: PublishingHouse | null;
}

const countries = [
  'España', 'México', 'Argentina', 'Colombia', 'Chile', 'Perú', 'Venezuela',
  'Estados Unidos', 'Reino Unido', 'Francia', 'Alemania', 'Italia',
  'Brasil', 'Portugal', 'Canadá', 'Australia', 'Japón', 'China',
  'India', 'Rusia', 'Otros'
];

export function EditPublisherModal({ isOpen, onClose, onSuccess, publisher }: EditPublisherModalProps) {
  const [formData, setFormData] = useState<UpdatePublishingHouseFormData>({
    name: '',
    description: '',
    country: 'España',
    foundedYear: undefined,
    website: '',
    email: '',
    phone: '',
    address: '',
    logoUrl: '',
    isActive: true,
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (publisher) {
      setFormData({
        name: publisher.name,
        description: publisher.description || '',
        country: publisher.country,
        foundedYear: publisher.foundedYear,
        website: publisher.website || '',
        email: publisher.email || '',
        phone: publisher.phone || '',
        address: publisher.address || '',
        logoUrl: publisher.logoUrl || '',
        isActive: publisher.isActive ?? true,
      });
    }
  }, [publisher]);

  const validateForm = (): boolean => {
    const validation = validateWithZodSafe(updatePublishingHouseSchema, formData);
    
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

  const handleInputChange = (name: string, value: string | number | boolean | undefined) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!publisher || !validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const updatedPublisher = await publishingHousesApi.update(publisher.id, formData);
      
      setErrors({});
      onSuccess(updatedPublisher);
      onClose();
    } catch (err: unknown) {
      console.error('Error updating publisher:', err);
      const errorMessage = (err as { response?: { data?: { message?: string } } }).response?.data?.message || 'Error al actualizar la editorial';
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
      title="Editar Editorial"
      size="lg"
    >
      <Form onSubmit={handleSubmit}>
        {errors.general && (
          <ValidationError message={errors.general} />
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Input
              label="Nombre de la editorial"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
              placeholder="Nombre de la editorial"
            />
          </div>
          
          <div>
            <Select
              label="País"
              value={formData.country}
              onChange={(e) => handleInputChange('country', e.target.value)}
              required
            >
              {countries.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </Select>
          </div>
          
          <div>
            <Input
              label="Año de fundación"
              type="number"
              min="1400"
              max={new Date().getFullYear()}
              value={formData.foundedYear || ''}
              onChange={(e) => handleInputChange('foundedYear', e.target.value ? parseInt(e.target.value) : undefined)}
              placeholder="Ej: 1985"
            />
          </div>
          
          <div>
            <Input
              label="Sitio web"
              type="url"
              value={formData.website || ''}
              onChange={(e) => handleInputChange('website', e.target.value)}
              placeholder="https://ejemplo.com"
            />
          </div>
          
          <div>
            <Input
              label="Email"
              type="email"
              value={formData.email || ''}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="contacto@editorial.com"
            />
          </div>
          
          <div>
            <Input
              label="Teléfono"
              type="tel"
              value={formData.phone || ''}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="+34 XXX XXX XXX"
            />
          </div>
          
          <div>
            <Input
              label="URL del logo"
              type="url"
              value={formData.logoUrl || ''}
              onChange={(e) => handleInputChange('logoUrl', e.target.value)}
              placeholder="https://ejemplo.com/logo.png"
            />
          </div>
          
          <div className="md:col-span-2">
            <Input
              label="Dirección"
              type="text"
              value={formData.address || ''}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="Dirección completa"
            />
          </div>
          
          <div className="md:col-span-2">
            <Textarea
              label="Descripción"
              value={formData.description || ''}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Descripción de la editorial (opcional)"
              rows={3}
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => handleInputChange('isActive', e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700">
                Editorial activa
              </span>
            </label>
          </div>
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
              'Actualizar Editorial'
            )}
          </Button>
        </div>
      </Form>
    </Modal>
  );
}