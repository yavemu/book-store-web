'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Layout } from '@/components';
import { Form, Input, Button } from '@/components/forms';
import { publishingHousesApi } from '@/services/api';
import { createPublishingHouseSchema, CreatePublishingHouseFormData } from '@/services/validation';
import { validateWithZodSafe } from '@/services/validation';
import { useAppSelector } from '@/hooks';

export default function CreatePublisherPage() {
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);
  
  const [formData, setFormData] = useState<CreatePublishingHouseFormData>({
    name: '',
    country: '',
    website: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const validation = validateWithZodSafe(createPublishingHouseSchema, formData);
    
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
      await publishingHousesApi.create(formData);
      
      // Redirect back to publishers list
      router.push('/dashboard?tab=publishers');
    } catch (err) {
      console.error('Error creating publisher:', err);
      setErrors({ general: 'Error al crear la editorial. Por favor, intenta de nuevo.' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/dashboard?tab=publishers');
  };

  return (
    <Layout user={user}>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={handleCancel}
              className="text-blue-600 hover:text-blue-800 mb-4 flex items-center"
            >
              ← Volver a Editoriales
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Crear Nueva Editorial</h1>
            <p className="text-gray-600 mt-2">Agrega una nueva editorial al catálogo de la librería.</p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <Form onSubmit={handleSubmit}>
              {errors.general && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                  {errors.general}
                </div>
              )}
              
              <div className="space-y-6">
                <div>
                  <Input
                    label="Nombre de la Editorial"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                    placeholder="Ej: Penguin Random House, Editorial Planeta, Alfaguara..."
                    error={errors.name}
                    className="text-lg"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Nombre oficial de la editorial o casa editorial.
                  </p>
                </div>
                
                <div>
                  <Input
                    label="País"
                    type="text"
                    value={formData.country || ''}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    placeholder="Ej: España, México, Argentina, Colombia..."
                    error={errors.country}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    País donde tiene su sede principal la editorial (opcional).
                  </p>
                </div>
                
                <div>
                  <Input
                    label="Sitio Web"
                    type="url"
                    value={formData.website || ''}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    placeholder="https://www.editorial.com"
                    error={errors.website}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    URL del sitio web oficial de la editorial (opcional).
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end space-x-4 pt-8 border-t mt-8">
                <Button
                  type="button"
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleCancel}
                  disabled={loading}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {loading ? 'Creando...' : 'Crear Editorial'}
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </Layout>
  );
}