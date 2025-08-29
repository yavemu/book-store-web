'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
import Button from './ui/Button';

interface NavItem {
  label: string;
  path: string;
  requiredRole?: 'ADMIN' | 'USER';
}

const navItems: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Libros', path: '/books' },
  { label: 'Géneros', path: '/genres' },
  { label: 'Autores', path: '/authors' },
  { label: 'Editoriales', path: '/publishers' },
  { label: 'Usuarios', path: '/users', requiredRole: 'ADMIN' },
  { label: 'Auditoría', path: '/audit', requiredRole: 'ADMIN' }
];

export default function Navigation() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  
  // Handle role as string or object
  const userRole = typeof user?.role === 'string' 
    ? user.role 
    : (typeof user?.role === 'object' && user?.role?.name) 
    ? user.role.name 
    : 'USER';

  const handleLogout = () => {
    dispatch(logout());
  };

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(path);
  };

  const canAccess = (item: NavItem) => {
    if (!item.requiredRole) return true;
    return userRole === 'ADMIN' || item.requiredRole === userRole;
  };

  return (
    <nav style={{ 
      padding: '20px',
      backgroundColor: '#f8f9fa',
      borderBottom: '1px solid #dee2e6'
    }}>
      <div style={{ 
        display: 'flex',
        gap: '20px',
        alignItems: 'center',
        flexWrap: 'wrap'
      }}>
        <div style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: '#007bff',
          marginRight: '30px'
        }}>
          Book Store Admin
        </div>
        
        {navItems.filter(canAccess).map((item) => (
          <Link
            key={item.path}
            href={item.path}
            style={{
              padding: '8px 16px',
              textDecoration: 'none',
              borderRadius: '4px',
              backgroundColor: isActive(item.path) ? '#007bff' : 'transparent',
              color: isActive(item.path) ? 'white' : '#007bff',
              border: '1px solid #007bff',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.2s'
            }}
          >
            {item.label}
          </Link>
        ))}
        
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '10px', alignItems: 'center' }}>
          <span style={{ fontSize: '14px', color: '#6c757d' }}>
            {user?.username || 'Usuario'} ({userRole})
          </span>
          <Button variant="secondary" onClick={handleLogout}>
            Cerrar Sesión
          </Button>
        </div>
      </div>
    </nav>
  );
}