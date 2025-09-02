'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface FormField {
  key: string;
  label: string;
  type: 'text' | 'email' | 'number' | 'date' | 'select' | 'textarea' | 'boolean' | 'file';
  required?: boolean;
  options?: { value: any; label: string }[];
  placeholder?: string;
  accept?: string; // For file inputs
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
  inline?: boolean; // New prop to render without modal
}

export default function GenericForm({
  isOpen,
  onClose,
  onSave,
  entity,
  entityName,
  fields,
  isEditing = false,
  loading = false,
  inline = false
}: GenericFormProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [fileData, setFileData] = useState<Record<string, File | null>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  // Initialize form data when modal opens or entity changes
  useEffect(() => {
    if (isOpen) {
      if (isEditing && entity) {
        // Pre-populate form with entity data for editing
        const initialData = fields.reduce((acc, field) => {
          const value = entity[field.key];
          if (value !== undefined && value !== null) {
            acc[field.key] = value;
          } else {
            acc[field.key] = field.type === 'boolean' ? false : '';
          }
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
      setFileData({});
    }
  }, [isOpen, isEditing, entity, fields]);

  const handleInputChange = useCallback((key: string, value: any) => {
    setFormData(prev => {
      // Only update if value actually changed
      if (prev[key] === value) {
        return prev;
      }
      
      return {
        ...prev,
        [key]: value
      };
    });
    
    // Clear error for this field
    setErrors(prev => {
      if (prev[key]) {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      }
      return prev;
    });
  }, []);

  const handleFileChange = useCallback((key: string, file: File | null) => {
    setFileData(prev => ({
      ...prev,
      [key]: file
    }));
    
    // Clear error for this field
    setErrors(prev => {
      if (prev[key]) {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      }
      return prev;
    });
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    fields.forEach(field => {
      if (field.required) {
        if (field.type === 'file') {
          const file = fileData[field.key];
          if (!file) {
            newErrors[field.key] = `${field.label} es requerido`;
          }
        } else {
          const value = formData[field.key];
          if (!value || (typeof value === 'string' && value.trim() === '')) {
            newErrors[field.key] = `${field.label} es requerido`;
          }
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
      // Only include files if there are file fields in the form
      const hasFileFields = fields.some(field => field.type === 'file');
      const submitData = hasFileFields 
        ? { ...formData, files: fileData }
        : formData;
      await onSave(submitData);
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

  const renderField = useCallback((field: FormField) => {
    const value = formData[field.key] ?? '';
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
        
      case 'file':
        return (
          <div className="file-input-container">
            <input
              type="file"
              onChange={(e) => handleFileChange(field.key, e.target.files?.[0] || null)}
              accept={field.accept}
              className={`form-file ${hasError ? 'error' : ''}`}
              required={field.required}
            />
            {fileData[field.key] && (
              <span className="file-selected">
                📁 {fileData[field.key]?.name}
              </span>
            )}
          </div>
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
  }, [formData, errors, handleInputChange, handleFileChange]);

  const formContent = (
    <form onSubmit={handleSubmit} className="generic-form">
      {errors._general && (
        <div className="form-error-general">
          {errors._general}
        </div>
      )}
      
      <div className={inline ? "form-fields form-fields-inline" : "form-fields"}>
        {fields.map(field => {
          // Determine if field should span full width
          const isFullWidth = field.type === 'textarea' || field.type === 'file';
          const fieldClass = inline 
            ? `form-field form-field-inline ${isFullWidth ? 'full-width' : ''}`.trim()
            : "form-field";
            
          return (
            <div key={field.key} className={fieldClass}>
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
          );
        })}
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
  );

  if (inline) {
    return formContent;
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${isEditing ? 'Editar' : 'Crear'} ${entityName}`}
      size="lg"
    >
      {formContent}
    </Modal>
  );
}