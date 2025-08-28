'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Layout, LoadingSpinner } from '@/components';
import NavigationMenu from '@/components/navigation/NavigationMenu';
import { useAppSelector, useAppDispatch } from '@/hooks';
import { logout } from '@/store/slices/authSlice';

// Dynamic content components
import CatalogPage from '@/components/dashboard/pages/CatalogPage';
import SearchPage from '@/components/dashboard/pages/SearchPage';
import ProfilePage from '@/components/dashboard/pages/ProfilePage';
import BooksManagementPage from '@/components/dashboard/pages/BooksManagementPage';
import AuthorsManagementPage from '@/components/dashboard/pages/AuthorsManagementPage';
import PublishersManagementPage from '@/components/dashboard/pages/PublishersManagementPage';
import GenresManagementPage from '@/components/dashboard/pages/GenresManagementPage';
import UsersManagementPage from '@/components/dashboard/pages/UsersManagementPage';
import AuditPage from '@/components/dashboard/pages/AuditPage';

export default function Dashboard() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user, loading: authLoading } = useAppSelector(state => state.auth);
  const [activeMenuItem, setActiveMenuItem] = useState<string>('catalog');
  const [pageLoading, setPageLoading] = useState(false);

  useEffect(() => {
    // Redirect to home if not authenticated after loading is complete
    if (!authLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, authLoading, router]);

  const handleLogout = () => {
    dispatch(logout());
    router.push('/');
  };

  const handleMenuItemClick = (menuItemId: string) => {
    if (menuItemId === activeMenuItem) return;
    
    setPageLoading(true);
    
    // Simulate loading time for better UX
    setTimeout(() => {
      setActiveMenuItem(menuItemId);
      setPageLoading(false);
    }, 300);
  };

  const renderPageContent = () => {
    if (pageLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="large" message="Cargando..." />
        </div>
      );
    }

    switch (activeMenuItem) {
      case 'catalog':
        return <CatalogPage />;
      case 'search':
        return <SearchPage />;
      case 'profile':
        return <ProfilePage user={user} />;
      case 'books':
        return <BooksManagementPage />;
      case 'authors':
        return <AuthorsManagementPage />;
      case 'publishers':
        return <PublishersManagementPage />;
      case 'genres':
        return <GenresManagementPage />;
      case 'users':
        return <UsersManagementPage />;
      case 'audit':
        return <AuditPage />;
      default:
        return <CatalogPage />;
    }
  };

  if (authLoading) {
    return (
      <Layout>
        <div className="layout-flex-center">
          <LoadingSpinner size="large" message="Verificando autenticación..." />
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated || !user) {
    return null; // Will redirect to login
  }

  return (
    <Layout user={user} onLogout={handleLogout}>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Navigation Sidebar */}
            <div className="lg:col-span-1">
              <NavigationMenu 
                user={user} 
                onMenuItemClick={handleMenuItemClick}
                activeMenuItem={activeMenuItem}
              />
            </div>
            
            {/* Main Content Area */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow-lg min-h-96">
                {renderPageContent()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}