'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useFormValidation, ValidationRules } from '@/hooks';
import { RegisterUserDto } from '@/types/auth';
import { ValidationError, LoadingSpinner } from '@/components/ui';

const validationRules: ValidationRules = {
  username: {
    required: true,
    minLength: 3,
    maxLength: 50,
  },
  email: {
    required: true,
    email: true,
  },
  password: {
    required: true,
    minLength: 6,
  },
  confirmPassword: {
    required: true,
    custom: (_value: string) => {
      // This will be compared in the component
      return undefined;
    },
  },
};

export function RegisterForm() {
  const router = useRouter();
  const { register, loading, error, clearError } = useAuth();
  const { errors, validate, validateAll, setError } = useFormValidation(validationRules);
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

    // Validate field on blur
    const fieldError = validate(name, value);
    if (fieldError) {
      setError(name, fieldError);
    } else {
      setError(name, '');
    }

    // Special validation for password confirmation
    if (name === 'confirmPassword' || name === 'password') {
      const password = name === 'password' ? value : formData.password;
      const confirmPassword = name === 'confirmPassword' ? value : formData.confirmPassword;
      
      if (confirmPassword && password !== confirmPassword) {
        setError('confirmPassword', 'Las contraseñas no coinciden');
      } else if (password === confirmPassword) {
        setError('confirmPassword', '');
      }
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('confirmPassword', 'Las contraseñas no coinciden');
      return;
    }

    // Validate all fields
    const isValid = validateAll(formData);
    if (!isValid) {
      return;
    }

    try {
      const registerData: RegisterUserDto = {
        username: formData.username.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      };

      await register(registerData);
      
      // Redirect to login page with success message
      router.push('/login?message=registration-success');
    } catch (_err) {
      // Error is handled by the useAuth hook
    }
  };

  return (
    <div className="card-base p-8 max-w-md mx-auto">
      <div className="text-center mb-6">
        <h1 className="header-title mb-2">Crear Cuenta</h1>
        <p className="text-muted">Completa tus datos para registrarte</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Username Field */}
        <div className="form-group">
          <label htmlFor="username" className="form-label">
            Nombre de usuario *
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            className={`input-base w-full ${errors.username ? 'border-red-500' : ''}`}
            placeholder="Ingresa tu nombre de usuario"
            disabled={loading}
          />
          {errors.username && <ValidationError message={errors.username} />}
        </div>

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

        {/* Confirm Password Field */}
        <div className="form-group">
          <label htmlFor="confirmPassword" className="form-label">
            Confirmar contraseña *
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className={`input-base w-full pr-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
              placeholder="Confirma tu contraseña"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              disabled={loading}
            >
              {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
          {errors.confirmPassword && <ValidationError message={errors.confirmPassword} />}
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
          {loading ? 'Registrando...' : 'Crear cuenta'}
        </button>

        {/* Login Link */}
        <div className="text-center mt-6">
          <p className="text-muted">
            ¿Ya tienes una cuenta?{' '}
            <button
              type="button"
              onClick={() => router.push('/login')}
              className="text-indigo-600 hover:text-indigo-700 font-medium"
              disabled={loading}
            >
              Inicia sesión aquí
            </button>
          </p>
        </div>
      </form>
    </div>
  );
}