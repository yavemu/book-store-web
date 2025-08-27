import { useState, useCallback } from 'react';

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  email?: boolean;
  custom?: (value: string) => string | undefined;
}

export interface ValidationRules {
  [key: string]: ValidationRule;
}

export interface FormErrors {
  [key: string]: string;
}

export interface UseFormValidationReturn {
  errors: FormErrors;
  isValid: boolean;
  validate: (name: string, value: string) => string;
  validateAll: (data: Record<string, string>) => boolean;
  clearErrors: () => void;
  setError: (name: string, error: string) => void;
}

export function useFormValidation(rules: ValidationRules): UseFormValidationReturn {
  const [errors, setErrors] = useState<FormErrors>({});

  const validate = useCallback((name: string, value: string): string => {
    const rule = rules[name];
    if (!rule) return '';

    // Required validation
    if (rule.required && (!value || value.trim() === '')) {
      return 'Este campo es requerido';
    }

    // If field is empty and not required, skip other validations
    if (!value || value.trim() === '') {
      return '';
    }

    // MinLength validation
    if (rule.minLength && value.length < rule.minLength) {
      return `Debe tener al menos ${rule.minLength} caracteres`;
    }

    // MaxLength validation
    if (rule.maxLength && value.length > rule.maxLength) {
      return `No puede tener más de ${rule.maxLength} caracteres`;
    }

    // Email validation
    if (rule.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return 'Debe proporcionar un email válido';
      }
    }

    // Pattern validation
    if (rule.pattern && !rule.pattern.test(value)) {
      return 'El formato no es válido';
    }

    // Custom validation
    if (rule.custom) {
      const customError = rule.custom(value);
      if (customError) {
        return customError;
      }
    }

    return '';
  }, [rules]);

  const validateAll = useCallback((data: Record<string, string>): boolean => {
    const newErrors: FormErrors = {};
    let hasErrors = false;

    Object.keys(rules).forEach((fieldName) => {
      const value = data[fieldName] || '';
      const error = validate(fieldName, value);
      
      if (error) {
        newErrors[fieldName] = error;
        hasErrors = true;
      }
    });

    setErrors(newErrors);
    return !hasErrors;
  }, [rules, validate]);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const setError = useCallback((name: string, error: string) => {
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  }, []);

  const isValid = Object.keys(errors).length === 0;

  return {
    errors,
    isValid,
    validate,
    validateAll,
    clearErrors,
    setError
  };
}