'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { usersApi } from '@/services/api/entities/users';
import { CreateUserDto } from '@/types/api/entities';
import { useRoles } from '@/hooks/useRoles';


interface UserFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  entity?: any; // For edit mode
  isEditing?: boolean;
}

export default function UserForm({
  isOpen,
  onClose,
  onSuccess,
  entity,
  isEditing = false
}: UserFormProps) {
  const { roles, loading: rolesLoading, error: rolesError } = useRoles();
  
  const [formData, setFormData] = useState<Partial<CreateUserDto>>({
    username: '',
    email: '',
    password: '',
    roleId: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  // Handle roles error
  useEffect(() => {
    if (rolesError) {
      setErrors(prev => ({ ...prev, _general: 'Error cargando roles disponibles' }));
    }
  }, [rolesError]);

  // Initialize form data when modal opens or entity changes
  useEffect(() => {
    if (isOpen) {
      if (isEditing && entity) {
        // Pre-populate form with entity data for editing
        setFormData({
          username: entity.username ?? '',
          email: entity.email ?? '',
          password: '', // Don't pre-populate password for security
          roleId: entity.roleId ?? entity.role?.id ?? ''
        });
      } else {
        // Clear form for creation
        setFormData({
          username: '',
          email: '',
          password: '',
          roleId: ''
        });
      }
      setErrors({});
    }
  }, [isOpen, isEditing, entity]);

  const handleInputChange = useCallback((key: keyof CreateUserDto, value: any) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
    
    // Clear error for this field
    if (errors[key]) {
      setErrors(prev => ({
        ...prev,
        [key]: ''
      }));
    }
  }, [errors]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.username?.trim()) {
      newErrors.username = 'El nombre de usuario es requerido';
    }
    
    if (!formData.email?.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El formato del email no es válido';
    }
    
    if (!isEditing && !formData.password?.trim()) {
      newErrors.password = 'La contraseña es requerida';
    }
    
    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    
    if (!formData.roleId) {
      newErrors.roleId = 'Debe seleccionar un rol';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setSaving(true);
    
    try {
      const userData = {
        ...formData,
      } as CreateUserDto;

      // Remove password if editing and it's empty
      if (isEditing && !userData.password?.trim()) {
        delete userData.password;
      }

      if (isEditing && entity) {
        // Update user
        await usersApi.update(entity.id, userData);
      } else {
        // Create new user
        await usersApi.create(userData);
      }

      onSuccess();
      onClose();
      
    } catch (error: any) {
      console.error('Error saving user:', error);
      setErrors({ 
        _general: error.message || 'Error al guardar el usuario'
      });
    } finally {
      setSaving(false);
    }
  };

  if (rolesLoading) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Cargando...">
        <div className="loading-container">
          <div className="loading-spinner">🔄</div>
          <p>Cargando datos...</p>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? `Editar Usuario` : `Crear Nuevo Usuario`}
    >
      <form onSubmit={handleSubmit} className="user-form">
        {errors._general && (
          <div className="error-message general-error">
            {errors._general}
          </div>
        )}

        {/* Username */}
        <div className="form-group">
          <label className="form-label">
            Nombre de Usuario <span className="required">*</span>
          </label>
          <Input
            type="text"
            value={formData.username || ''}
            onChange={(value) => handleInputChange('username', value)}
            placeholder="Ej: admin"
            className={errors.username ? 'error' : ''}
          />
          {errors.username && <span className="error-text">{errors.username}</span>}
        </div>

        {/* Email */}
        <div className="form-group">
          <label className="form-label">
            Email <span className="required">*</span>
          </label>
          <Input
            type="email"
            value={formData.email || ''}
            onChange={(value) => handleInputChange('email', value)}
            placeholder="Ej: admin@demo.com"
            className={errors.email ? 'error' : ''}
          />
          {errors.email && <span className="error-text">{errors.email}</span>}
        </div>

        {/* Password */}
        <div className="form-group">
          <label className="form-label">
            Contraseña {!isEditing && <span className="required">*</span>}
            {isEditing && <span className="optional">(dejar vacío para no cambiar)</span>}
          </label>
          <Input
            type="password"
            value={formData.password || ''}
            onChange={(value) => handleInputChange('password', value)}
            placeholder={isEditing ? "Nueva contraseña..." : "Contraseña segura..."}
            className={errors.password ? 'error' : ''}
          />
          {errors.password && <span className="error-text">{errors.password}</span>}
        </div>

        {/* Role */}
        <div className="form-group">
          <label className="form-label">
            Rol <span className="required">*</span>
          </label>
          <select
            value={formData.roleId || ''}
            onChange={(e) => handleInputChange('roleId', e.target.value)}
            className={`form-select ${errors.roleId ? 'error' : ''}`}
          >
            <option value="">Seleccionar rol...</option>
            {roles.map(role => (
              <option key={role.value} value={role.value}>
                {role.label}
              </option>
            ))}
          </select>
          {errors.roleId && <span className="error-text">{errors.roleId}</span>}
        </div>

        {/* Action Buttons */}
        <div className="form-actions">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={saving}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={saving}
            disabled={saving}
          >
            {saving 
              ? (isEditing ? 'Actualizando...' : 'Creando...') 
              : (isEditing ? 'Actualizar' : 'Crear')
            }
          </Button>
        </div>
      </form>
    </Modal>
  );
}