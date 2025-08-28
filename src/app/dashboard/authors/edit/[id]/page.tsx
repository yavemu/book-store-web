'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Layout } from '@/components';
import { Form, Input, Textarea, Button } from '@/components/forms';
import { authorsApi } from '@/services/api';
import { updateAuthorSchema, UpdateAuthorFormData } from '@/services/validation';
import { validateWithZodSafe } from '@/services/validation';
import { useAppSelector } from '@/hooks';
import { LoadingSpinner } from '@/components/ui';
import { BookAuthor } from '@/types/authors';

export default function EditAuthorPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAppSelector((state) => state.auth);
  const authorId = params.id as string;

  const [formData, setFormData] = useState<UpdateAuthorFormData>({});
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const fetchAuthor = useCallback(async () => {
    if (!authorId) {
      setErrors({ general: 'ID de autor no encontrado.' });
      setPageLoading(false);
      return;
    }

    try {
      setPageLoading(true);
      const response = await authorsApi.getById(authorId);
      const authorData = response.data;
      setFormData({
        firstName: authorData.firstName,
        lastName: authorData.lastName,
        biography: authorData.biography || '',
        birthDate: authorData.birthDate ? new Date(authorData.birthDate).toISOString().split('T')[0] : '',
        nationality: authorData.nationality || '',
      });
    } catch (err) {
      console.error('Error fetching author:', err);
      setErrors({ general: 'Error al cargar los datos del autor.' });
    } finally {
      setPageLoading(false);
    }
  }, [authorId]);

  useEffect(() => {
    fetchAuthor();
  }, [fetchAuthor]);

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
      await authorsApi.update(authorId, formData);
      router.push('/dashboard?tab=authors');
    } catch (err) {
      console.error('Error updating author:', err);
      setErrors({ general: 'Error al actualizar el autor. Por favor, intenta de nuevo.' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/dashboard?tab=authors');
  };

  if (pageLoading) {
    return (
      <Layout user={user}>
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="large" message="Cargando autor..." />
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
              ← Volver a Autores
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Editar Autor</h1>
            <p className="text-gray-600 mt-2">Actualiza la información del autor en el catálogo.</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <Form onSubmit={handleSubmit}>
              {errors.general && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                  {errors.general}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Input
                    label="Nombre"
                    type="text"
                    value={formData.firstName || ''}
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
                    value={formData.lastName || ''}
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
                    placeholder="Breve biografía del autor, sus obras principales, premios, etc..."
                    rows={6}
                    error={errors.biography}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Incluye información relevante sobre la vida y obra del autor (opcional).
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
