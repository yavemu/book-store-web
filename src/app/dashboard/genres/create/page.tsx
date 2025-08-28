'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Layout } from '@/components';
import { Form, Input, Button } from '@/components/forms';
import { genresApi } from '@/services/api';
import { createGenreSchema, CreateGenreFormData } from '@/services/validation';
import { validateWithZodSafe } from '@/services/validation';
import { useAppSelector } from '@/hooks';

export default function CreateGenrePage() {
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);
  
  const [formData, setFormData] = useState<CreateGenreFormData>({
    name: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const validation = validateWithZodSafe(createGenreSchema, formData);
    
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
      await genresApi.create(formData);
      
      // Redirect back to genres list
      router.push('/dashboard?tab=genres');
    } catch (err) {
      console.error('Error creating genre:', err);
      setErrors({ general: 'Error al crear el género. Por favor, intenta de nuevo.' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/dashboard?tab=genres');
  };

  return (
    <Layout user={user}>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={handleCancel}
              className="text-blue-600 hover:text-blue-800 mb-4 flex items-center"
            >
              ← Volver a Géneros
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Crear Nuevo Género</h1>
            <p className="text-gray-600 mt-2">Agrega un nuevo género literario al catálogo.</p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <Form onSubmit={handleSubmit}>
              {errors.general && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                  {errors.general}
                </div>
              )}
              
              <div className="space-y-6">
                <div>
                  <Input
                    label="Nombre del Género"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                    placeholder="Ej: Ficción, Drama, Comedia, Ciencia Ficción..."
                    error={errors.name}
                    className="text-lg"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Ingresa un nombre único y descriptivo para el género literario.
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
                  {loading ? 'Creando...' : 'Crear Género'}
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </Layout>
  );
}