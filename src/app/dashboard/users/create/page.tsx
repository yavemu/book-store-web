'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Layout } from '@/components';
import { Form, Input, Select, Button } from '@/components/forms';
import { usersApi } from '@/services/api';
import { createUserSchema, CreateUserFormData } from '@/services/validation';
import { validateWithZodSafe } from '@/services/validation';
import { useAppSelector } from '@/hooks';

export default function CreateUserPage() {
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);
  
  const [formData, setFormData] = useState<CreateUserFormData>({
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    roleName: 'user',
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const validation = validateWithZodSafe(createUserSchema, formData);
    
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
      await usersApi.create(formData);
      
      // Redirect back to users list
      router.push('/dashboard?tab=users');
    } catch (err) {
      console.error('Error creating user:', err);
      setErrors({ general: 'Error al crear el usuario. Por favor, intenta de nuevo.' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/dashboard?tab=users');
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
              ← Volver a Usuarios
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Crear Nuevo Usuario</h1>
            <p className="text-gray-600 mt-2">Agrega un nuevo usuario al sistema.</p>
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
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                    placeholder="usuario@ejemplo.com"
                    error={errors.email}
                    className="text-lg"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Dirección de correo electrónico que será utilizada para el inicio de sesión.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Input
                      label="Nombre"
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      required
                      placeholder="Nombre del usuario"
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
                      placeholder="Apellido del usuario"
                      error={errors.lastName}
                    />
                  </div>
                </div>
                
                <div>
                  <Input
                    label="Contraseña"
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    required
                    placeholder="Contraseña segura (mínimo 8 caracteres)"
                    error={errors.password}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    La contraseña debe tener al menos 8 caracteres e incluir mayúsculas, minúsculas y números.
                  </p>
                </div>
                
                <div>
                  <Select
                    label="Rol de Usuario"
                    value={formData.roleName}
                    onChange={(e) => handleInputChange('roleName', e.target.value)}
                    required
                    error={errors.roleName}
                  >
                    <option value="user">Usuario - Acceso básico al sistema</option>
                    <option value="admin">Administrador - Acceso completo al sistema</option>
                  </Select>
                  <p className="text-sm text-gray-500 mt-1">
                    Los usuarios tienen acceso limitado, los administradores tienen acceso completo.
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
                  {loading ? 'Creando...' : 'Crear Usuario'}
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </Layout>
  );
}