'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Layout } from '@/components';
import { Form, Input, Button } from '@/components/forms';
import { publishersApi } from '@/services/api';
import { updatePublisherSchema, UpdatePublisherFormData } from '@/services/validation';
import { validateWithZodSafe } from '@/services/validation';
import { useAppSelector } from '@/hooks';
import { LoadingSpinner } from '@/components/ui';
import { PublishingHouse } from '@/types/publishing-houses';

export default function EditPublisherPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAppSelector((state) => state.auth);
  const publisherId = params.id as string;

  const [formData, setFormData] = useState<UpdatePublisherFormData>({});
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const fetchPublisher = useCallback(async () => {
    if (!publisherId) {
      setErrors({ general: 'ID de editorial no encontrado.' });
      setPageLoading(false);
      return;
    }

    try {
      setPageLoading(true);
      const response = await publishersApi.getById(publisherId);
      const publisherData = response.data;
      setFormData({
        name: publisherData.name,
        website: publisherData.website || '',
      });
    } catch (err) {
      console.error('Error fetching publisher:', err);
      setErrors({ general: 'Error al cargar los datos de la editorial.' });
    } finally {
      setPageLoading(false);
    }
  }, [publisherId]);

  useEffect(() => {
    fetchPublisher();
  }, [fetchPublisher]);

  const validateForm = (): boolean => {
    const validation = validateWithZodSafe(updatePublisherSchema, formData);
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
      await publishersApi.update(publisherId, formData);
      router.push('/dashboard?tab=publishers');
    } catch (err) {
      console.error('Error updating publisher:', err);
      setErrors({ general: 'Error al actualizar la editorial. Por favor, intenta de nuevo.' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/dashboard?tab=publishers');
  };

  if (pageLoading) {
    return (
      <Layout user={user}>
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="large" message="Cargando editorial..." />
        </div>
      </Layout>
    );
  }

  return (
    <Layout user={user}>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="mb-8">
            <button
              onClick={handleCancel}
              className="text-blue-600 hover:text-blue-800 mb-4 flex items-center"
            >
              ← Volver a Editoriales
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Editar Editorial</h1>
            <p className="text-gray-600 mt-2">Actualiza la información de la editorial en el catálogo.</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <Form onSubmit={handleSubmit}>
              {errors.general && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                  {errors.general}
                </div>
              )}

              <div className="grid grid-cols-1 gap-6">
                <div>
                  <Input
                    label="Nombre"
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                    placeholder="Nombre de la editorial"
                    error={errors.name}
                  />
                </div>

                <div>
                  <Input
                    label="Sitio Web"
                    type="url"
                    value={formData.website || ''}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    placeholder="https://www.ejemplo.com"
                    error={errors.website}
                  />
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
                  {loading ? 'Guardando...' : 'Guardar Cambios'}
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </Layout>
  );
}
