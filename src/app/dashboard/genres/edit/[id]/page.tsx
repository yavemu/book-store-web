'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Layout } from '@/components';
import { Form, Input, Textarea, Button } from '@/components/forms';
import { genresApi } from '@/services/api';
import { updateGenreSchema, UpdateGenreFormData } from '@/services/validation';
import { validateWithZodSafe } from '@/services/validation';
import { useAppSelector } from '@/hooks';
import { LoadingSpinner } from '@/components/ui';
import { Genre } from '@/types/genres';

export default function EditGenrePage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAppSelector((state) => state.auth);
  const genreId = params.id as string;

  const [formData, setFormData] = useState<UpdateGenreFormData>({});
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const fetchGenre = useCallback(async () => {
    if (!genreId) {
      setErrors({ general: 'ID de género no encontrado.' });
      setPageLoading(false);
      return;
    }

    try {
      setPageLoading(true);
      const response = await genresApi.getById(genreId);
      const genreData = response.data;
      setFormData({
        name: genreData.name,
        description: genreData.description || '',
      });
    } catch (err) {
      console.error('Error fetching genre:', err);
      setErrors({ general: 'Error al cargar los datos del género.' });
    } finally {
      setPageLoading(false);
    }
  }, [genreId]);

  useEffect(() => {
    fetchGenre();
  }, [fetchGenre]);

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
      await genresApi.update(genreId, formData);
      router.push('/dashboard?tab=genres');
    } catch (err) {
      console.error('Error updating genre:', err);
      setErrors({ general: 'Error al actualizar el género. Por favor, intenta de nuevo.' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/dashboard?tab=genres');
  };

  if (pageLoading) {
    return (
      <Layout user={user}>
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="large" message="Cargando género..." />
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
              ← Volver a Géneros
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Editar Género</h1>
            <p className="text-gray-600 mt-2">Actualiza la información del género en el catálogo.</p>
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
                    placeholder="Nombre del género"
                    error={errors.name}
                  />
                </div>

                <div>
                  <Textarea
                    label="Descripción"
                    value={formData.description || ''}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Breve descripción del género literario..."
                    rows={4}
                    error={errors.description}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Proporciona una breve descripción del género (opcional).
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
