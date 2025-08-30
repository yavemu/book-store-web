'use client';

import { useState } from 'react';
import { useApiRequest } from '@/hooks';
import { useAppDispatch } from '@/store/hooks';
import { loginSuccess } from '@/store/slices/authSlice';
import { loginSchema, registerSchema, type LoginFormData, type RegisterFormData } from '@/services/validation/schemas/auth';
import Input from './ui/Input';
import Button from './ui/Button';
import Card from './ui/Card';

type AuthMode = 'login' | 'register';

export default function AuthForm() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const dispatch = useAppDispatch();

  const [loginError, setLoginError] = useState<string | null>(null);
  
  const { loading: loginLoading, execute: executeLogin, validationErrors: loginValidationErrors } = useApiRequest<LoginFormData>({
    endpoint: '/auth/login',
    method: 'POST',
    schema: loginSchema,
    onSuccess: (response: any) => {
      console.log('Login response:', response);
      console.log('User object:', response.user);
      console.log('User role:', response.user?.role);
      setLoginError(null);
      dispatch(loginSuccess({
        token: response.access_token || response.token,
        user: response.user
      }));
    },
    onError: (error) => {
      setLoginError(error.message || 'Error al iniciar sesión');
    }
  });

  const [registerError, setRegisterError] = useState<string | null>(null);
  const [registerSuccess, setRegisterSuccess] = useState<string | null>(null);
  
  const { loading: registerLoading, execute: executeRegister, validationErrors: registerValidationErrors } = useApiRequest<RegisterFormData>({
    endpoint: '/auth/register',
    method: 'POST',
    schema: registerSchema,
    onSuccess: (response: any) => {
      setRegisterError(null);
      setRegisterSuccess('Registro exitoso. Por favor inicia sesión.');
      setMode('login');
      setFormData({ username: '', email: '', password: '', confirmPassword: '' });
    },
    onError: (error) => {
      setRegisterSuccess(null);
      setRegisterError(error.message || 'Error al registrarse');
    }
  });

  const loading = loginLoading || registerLoading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear any previous error messages
    setLoginError(null);
    setRegisterError(null);
    setRegisterSuccess(null);

    if (mode === 'register') {
      if (formData.password !== formData.confirmPassword) {
        setRegisterError('Las contraseñas no coinciden');
        return;
      }
      
      await executeRegister({
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
    } else {
      await executeLogin({
        email: formData.email,
        password: formData.password
      });
    }
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setFormData({ username: '', email: '', password: '', confirmPassword: '' });
    // Clear any error/success messages when switching modes
    setLoginError(null);
    setRegisterError(null);
    setRegisterSuccess(null);
  };

  return (
    <div className="auth-container">
      <div className="auth-card-wrapper">
        <div className="auth-header">
          <h1 className="auth-title">
            {mode === 'login' ? 'Iniciar Sesión' : 'Registrarse'}
          </h1>
          <p className="auth-subtitle">
            {mode === 'login' ? 'Bienvenido a Librería Boutique' : 'Únete a nuestra Librería Boutique'}
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="auth-form">
          {mode === 'register' && (
            <div className="form-field">
              <Input
                type="text"
                placeholder="Nombre de usuario"
                value={formData.username}
                onChange={(value) => setFormData({ ...formData, username: value })}
                required
                disabled={loading}
              />
              {registerValidationErrors?.username && (
                <div className="form-error">
                  {(registerValidationErrors.username || []).join(', ')}
                </div>
              )}
            </div>
          )}

          <div className="form-field">
            <Input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(value) => setFormData({ ...formData, email: value })}
              required
              disabled={loading}
            />
            {((mode === 'login' && loginValidationErrors?.email) || (mode === 'register' && registerValidationErrors?.email)) && (
              <div className="form-error">
                {mode === 'login' ? (loginValidationErrors?.email || []).join(', ') : (registerValidationErrors?.email || []).join(', ')}
              </div>
            )}
          </div>

          <div className="form-field">
            <Input
              type="password"
              placeholder="Contraseña"
              value={formData.password}
              onChange={(value) => setFormData({ ...formData, password: value })}
              required
              disabled={loading}
            />
            {((mode === 'login' && loginValidationErrors?.password) || (mode === 'register' && registerValidationErrors?.password)) && (
              <div className="form-error">
                {mode === 'login' ? (loginValidationErrors?.password || []).join(', ') : (registerValidationErrors?.password || []).join(', ')}
              </div>
            )}
          </div>

          {mode === 'register' && (
            <div className="form-field">
              <Input
                type="password"
                placeholder="Confirmar Contraseña"
                value={formData.confirmPassword}
                onChange={(value) => setFormData({ ...formData, confirmPassword: value })}
                required
                disabled={loading}
              />
              {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <div className="form-error">
                  Las contraseñas no coinciden
                </div>
              )}
            </div>
          )}

          {/* Global error messages - positioned above submit button */}
          {loginError && mode === 'login' && (
            <div className="form-error">
              {loginError}
            </div>
          )}
          
          {registerError && mode === 'register' && (
            <div className="form-error">
              {registerError}
            </div>
          )}
          
          {registerSuccess && (
            <div className="form-success">
              {registerSuccess}
            </div>
          )}

          <div className="form-actions">
            <Button
              type="submit"
              disabled={loading}
              fullWidth
            >
              {loading ? (
                <span className="loading-text">
                  <span className="loading-spinner"></span>
                  Procesando...
                </span>
              ) : (
                mode === 'login' ? 'Iniciar Sesión' : 'Registrarse'
              )}
            </Button>
          </div>

          <div className="auth-toggle">
            <Button
              variant="link"
              onClick={toggleMode}
              disabled={loading}
            >
              {mode === 'login' ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}