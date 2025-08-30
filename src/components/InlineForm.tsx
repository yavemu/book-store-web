'use client';

import { useState } from 'react';
import Button from './ui/Button';
import Input from './ui/Input';

interface FormField {
  key: string;
  label: string;
  type: 'text' | 'number' | 'email' | 'select';
  required?: boolean;
  options?: { value: string; label: string }[];
}

interface InlineFormProps {
  fields: FormField[];
  onSubmit: (data: Record<string, any>) => void;
  onCancel: () => void;
  title?: string;
  submitLabel?: string;
  initialData?: Record<string, any>;
  loading?: boolean;
}

export default function InlineForm({
  fields,
  onSubmit,
  onCancel,
  title = 'Formulario',
  submitLabel = 'Guardar',
  initialData = {},
  loading = false
}: InlineFormProps) {
  const [formData, setFormData] = useState<Record<string, any>>(initialData);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="inline-form">
      <h3 className="form-title">{title}</h3>
      
      <div className="form-responsive">
        {fields.map((field) => (
          <div key={field.key} className="form-row">
            <label className="form-label">
              {field.label}
              {field.required && <span className="required-asterisk">*</span>}
            </label>
            
            {field.type === 'select' ? (
              <select
                value={formData[field.key] || ''}
                onChange={(e) => handleChange(field.key, e.target.value)}
                required={field.required}
                className="filter-select"
              >
                <option value="">Seleccionar...</option>
                {field.options?.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : (
              <Input
                type={field.type}
                value={formData[field.key] || ''}
                onChange={(value) => handleChange(field.key, value)}
                required={field.required}
              />
            )}
          </div>
        ))}
      </div>
      
      <div className="form-actions">
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? 'Guardando...' : submitLabel}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}