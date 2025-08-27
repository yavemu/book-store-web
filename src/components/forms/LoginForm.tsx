'use client';

import { useState, FormEvent } from 'react';
import { useAuth, useFormValidation, ValidationRules } from '@/hooks';
import { LoginDto } from '@/types/auth';
import { ValidationError, LoadingSpinner } from '@/components/ui';

const validationRules: ValidationRules = {
  email: {
    required: true,
    email: true,
  },
  password: {
    required: true,
    minLength: 6,
  },
};

interface LoginFormProps {
  onSuccess?: () => void;
  showTitle?: boolean;
  compact?: boolean;
}

export function LoginForm({ onSuccess, showTitle = true, compact = false }: LoginFormProps) {
  const { login, loading, error, clearError } = useAuth();
  const { errors, validate, validateAll, setError } = useFormValidation(validationRules);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (error) {
      clearError();
    }

    // Validate field on change
    const fieldError = validate(name, value);
    if (fieldError) {
      setError(name, fieldError);
    } else {
      setError(name, '');
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate all fields
    const isValid = validateAll(formData);
    if (!isValid) {
      return;
    }

    try {
      const loginData: LoginDto = {
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      };

      await login(loginData);
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (_err) {
      // Error is handled by the useAuth hook
    }
  };

  return (
    <div className={compact ? '' : 'card-base p-8 max-w-md mx-auto'}>
      {showTitle && (
        <div className="text-center mb-6">
          <h2 className={compact ? 'section-title' : 'header-title mb-2'}>Iniciar Sesión</h2>
          {!compact && <p className="text-muted">Ingresa tus credenciales para acceder</p>}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Field */}
        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={`input-base w-full ${errors.email ? 'border-red-500' : ''}`}
            placeholder="Ingresa tu email"
            disabled={loading}
          />
          {errors.email && <ValidationError message={errors.email} />}
        </div>

        {/* Password Field */}
        <div className="form-group">
          <label htmlFor="password" className="form-label">
            Contraseña *
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`input-base w-full pr-10 ${errors.password ? 'border-red-500' : ''}`}
              placeholder="Ingresa tu contraseña"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              disabled={loading}
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
          {errors.password && <ValidationError message={errors.password} />}
        </div>

        {/* General Error */}
        {error && (
          <div className="mb-4">
            <ValidationError message={error} />
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full py-3 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading && <LoadingSpinner size="small" />}
          {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
        </button>

        {/* Register Link */}
        {!compact && (
          <div className="text-center mt-6">
            <p className="text-muted">
              ¿No tienes una cuenta?{' '}
              <a
                href="/register"
                className="text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Regístrate aquí
              </a>
            </p>
          </div>
        )}
      </form>
    </div>
  );
}