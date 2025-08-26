import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="layout-main">
      <header className="layout-header">
        <div className="layout-header-content">
          <div className="flex items-center justify-between">
            <h1 className="header-title">📚 Book Store</h1>
            <nav className="flex items-center space-x-4">
              <span className="text-sm text-muted">Dashboard</span>
            </nav>
          </div>
        </div>
      </header>
      
      <main className="layout-content">
        {children}
      </main>
      
      <footer className="layout-footer">
        <div className="layout-footer-content">
          <div className="flex justify-between items-center">
            <p className="text-sm text-subtle">
              Book Store © 2024 - Sistema de gestión de libros
            </p>
            <div className="flex items-center space-x-4">
              <span className="text-xs text-subtle">v1.0.0</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};