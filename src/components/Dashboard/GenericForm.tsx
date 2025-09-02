'use client';

import React, { useState, useEffect } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface FormField {
  key: string;
  label: string;
  type: 'text' | 'email' | 'number' | 'date' | 'select' | 'textarea' | 'boolean';
  required?: boolean;
  options?: { value: any; label: string }[];
  placeholder?: string;
}

interface GenericFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  entity?: any; // For edit mode
  entityName: string;
  fields: FormField[];
  isEditing?: boolean;
  loading?: boolean;
}

export default function GenericForm({
  isOpen,
  onClose,
  onSave,
  entity,
  entityName,
  fields,
  isEditing = false,
  loading = false
}: GenericFormProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  // Initialize form data when modal opens or entity changes
  useEffect(() => {
    if (isOpen) {
      if (isEditing && entity) {
        // Pre-populate form with entity data for editing
        const initialData = fields.reduce((acc, field) => {
          acc[field.key] = entity[field.key] || '';
          return acc;
        }, {} as Record<string, any>);
        setFormData(initialData);
      } else {
        // Clear form for creation
        const initialData = fields.reduce((acc, field) => {
          acc[field.key] = field.type === 'boolean' ? false : '';
          return acc;
        }, {} as Record<string, any>);
        setFormData(initialData);
      }
      setErrors({});
    }
  }, [isOpen, isEditing, entity, fields]);

  const handleInputChange = (key: string, value: any) => {
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
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    fields.forEach(field => {
      if (field.required) {
        const value = formData[field.key];
        if (!value || (typeof value === 'string' && value.trim() === '')) {
          newErrors[field.key] = `${field.label} es requerido`;
        }
      }
    });
    
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
      await onSave(formData);
      onClose();
    } catch (error: any) {
      console.error('Error saving:', error);
      setErrors({ 
        _general: error.message || 'Error al guardar' 
      });
    } finally {
      setSaving(false);
    }
  };

  const renderField = (field: FormField) => {
    const value = formData[field.key] || '';
    const hasError = !!errors[field.key];

    switch (field.type) {
      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => handleInputChange(field.key, e.target.value)}
            className={`form-select ${hasError ? 'error' : ''}`}
            required={field.required}
          >
            <option value="">Seleccionar...</option>
            {field.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
        
      case 'boolean':
        return (
          <label className="checkbox-container">
            <input
              type="checkbox"
              checked={!!value}
              onChange={(e) => handleInputChange(field.key, e.target.checked)}
              className="form-checkbox"
            />
            <span className="checkbox-label">
              {field.placeholder || 'Activo'}
            </span>
          </label>
        );
        
      case 'textarea':
        return (
          <textarea
            value={value}
            onChange={(e) => handleInputChange(field.key, e.target.value)}
            placeholder={field.placeholder}
            className={`form-textarea ${hasError ? 'error' : ''}`}
            rows={4}
            required={field.required}
          />
        );
        
      default:
        return (
          <Input
            type={field.type}
            value={value}
            onChange={(newValue) => handleInputChange(field.key, newValue)}
            placeholder={field.placeholder}
            className={hasError ? 'error' : ''}
            required={field.required}
          />
        );
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${isEditing ? 'Editar' : 'Crear'} ${entityName}`}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="generic-form">
        {errors._general && (
          <div className="form-error-general">
            {errors._general}
          </div>
        )}
        
        <div className="form-fields">
          {fields.map(field => (
            <div key={field.key} className="form-field">
              <label className="form-label">
                {field.label}
                {field.required && <span className="required">*</span>}
              </label>
              
              {renderField(field)}
              
              {errors[field.key] && (
                <span className="form-error">
                  {errors[field.key]}
                </span>
              )}
            </div>
          ))}
        </div>
        
        <div className="form-actions">
          <Button
            type="button"
            onClick={onClose}
            variant="secondary"
            disabled={saving || loading}
          >
            Cancelar
          </Button>
          
          <Button
            type="submit"
            variant="primary"
            loading={saving || loading}
            disabled={saving || loading}
          >
            {saving ? 'Guardando...' : isEditing ? 'Actualizar' : 'Crear'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}