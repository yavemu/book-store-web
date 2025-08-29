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

  const { loading: loginLoading, execute: executeLogin, validationErrors: loginValidationErrors } = useApiRequest<LoginFormData>({
    endpoint: '/auth/login',
    method: 'POST',
    schema: loginSchema,
    onSuccess: (response: any) => {
      console.log('Login response:', response);
      console.log('User object:', response.user);
      console.log('User role:', response.user?.role);
      dispatch(loginSuccess({
        token: response.access_token || response.token,
        user: response.user
      }));
    },
    onError: (error) => {
      alert('Error en login: ' + error.message);
    }
  });

  const { loading: registerLoading, execute: executeRegister, validationErrors: registerValidationErrors } = useApiRequest<RegisterFormData>({
    endpoint: '/auth/register',
    method: 'POST',
    schema: registerSchema,
    onSuccess: (response: any) => {
      alert('Registro exitoso. Por favor inicia sesión.');
      setMode('login');
      setFormData({ username: '', email: '', password: '', confirmPassword: '' });
    },
    onError: (error) => {
      alert('Error en registro: ' + error.message);
    }
  });

  const loading = loginLoading || registerLoading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === 'register') {
      if (formData.password !== formData.confirmPassword) {
        alert('Las contraseñas no coinciden');
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
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f8f9fa',
      padding: '20px'
    }}>
      <Card title={mode === 'login' ? 'Iniciar Sesión' : 'Registrarse'}>
        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <div style={{ marginBottom: '16px' }}>
              <Input
                type="text"
                placeholder="Nombre de usuario"
                value={formData.username}
                onChange={(value) => setFormData({ ...formData, username: value })}
                required
                disabled={loading}
              />
              {registerValidationErrors?.username && (
                <div style={{ color: '#dc3545', fontSize: '14px', marginTop: '4px' }}>
                  {registerValidationErrors.username.join(', ')}
                </div>
              )}
            </div>
          )}

          <div style={{ marginBottom: '16px' }}>
            <Input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(value) => setFormData({ ...formData, email: value })}
              required
              disabled={loading}
            />
            {((mode === 'login' && loginValidationErrors?.email) || (mode === 'register' && registerValidationErrors?.email)) && (
              <div style={{ color: '#dc3545', fontSize: '14px', marginTop: '4px' }}>
                {mode === 'login' ? loginValidationErrors?.email?.join(', ') : registerValidationErrors?.email?.join(', ')}
              </div>
            )}
          </div>

          <div style={{ marginBottom: '16px' }}>
            <Input
              type="password"
              placeholder="Contraseña"
              value={formData.password}
              onChange={(value) => setFormData({ ...formData, password: value })}
              required
              disabled={loading}
            />
            {((mode === 'login' && loginValidationErrors?.password) || (mode === 'register' && registerValidationErrors?.password)) && (
              <div style={{ color: '#dc3545', fontSize: '14px', marginTop: '4px' }}>
                {mode === 'login' ? loginValidationErrors?.password?.join(', ') : registerValidationErrors?.password?.join(', ')}
              </div>
            )}
          </div>

          {mode === 'register' && (
            <div style={{ marginBottom: '16px' }}>
              <Input
                type="password"
                placeholder="Confirmar Contraseña"
                value={formData.confirmPassword}
                onChange={(value) => setFormData({ ...formData, confirmPassword: value })}
                required
                disabled={loading}
              />
            </div>
          )}

          <div style={{ marginBottom: '16px' }}>
            <Button
              type="submit"
              disabled={loading}
              fullWidth
            >
              {loading ? 'Cargando...' : (mode === 'login' ? 'Iniciar Sesión' : 'Registrarse')}
            </Button>
          </div>

          <div style={{ textAlign: 'center' }}>
            <Button
              variant="link"
              onClick={toggleMode}
              disabled={loading}
            >
              {mode === 'login' ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}