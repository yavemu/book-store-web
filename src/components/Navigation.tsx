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
  { label: 'Libros', path: '/books' },
  { label: 'Géneros', path: '/genres' },
  { label: 'Autores', path: '/authors' },
  { label: 'Editoriales', path: '/publishers' },
  { label: 'Movimientos', path: '/inventory-movements' },
  { label: 'Usuarios', path: '/users', requiredRole: 'ADMIN' },
  { label: 'Auditoría', path: '/audit' }
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
    return pathname.startsWith(path);
  };

  const canAccess = (item: NavItem) => {
    if (!item.requiredRole) return true;
    return userRole === 'ADMIN' || item.requiredRole === userRole;
  };

  return (
    <aside className="sidebar-boutique">
      <h2 className="sidebar-brand">📚 Librería Boutique</h2>
      
      {/* User Info Section - Prominent display */}
      <div className="sidebar-user-info">
        <div className="sidebar-user-display">
          {user?.username || 'Usuario'} - [{userRole}]
        </div>
      </div>
      
      <nav className="sidebar-nav">
        {navItems.filter(canAccess).map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`sidebar-nav-item ${isActive(item.path) ? 'active' : ''}`}
          >
            {item.label}
          </Link>
        ))}
        
        <div className="sidebar-user-section">
          <Button 
            variant="secondary" 
            onClick={handleLogout}
          >
            Cerrar Sesión
          </Button>
        </div>
      </nav>
    </aside>
  );
}