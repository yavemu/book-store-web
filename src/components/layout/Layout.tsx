import { ReactNode, useState, useEffect, useRef } from "react";
import { UserProfileResponseDto } from "@/types/auth";

interface LayoutProps {
  children: ReactNode;
  user?: UserProfileResponseDto | null;
  onLogout?: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, user, onLogout }) => {
  console.log('🏗️ Layout: Renderizando con user:', user);
  console.log('🔑 Layout: Role del usuario:', user?.role);
  
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    setShowDropdown(false);
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <div className="layout-main flex flex-col min-h-screen">
      <header className="layout-header">
        <div className="layout-header-content">
          <div className="flex items-center justify-between">
            <h1 className="header-title">📚 Book Store</h1>
            <nav className="flex items-center space-x-4">
              {user && (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center space-x-2 text-sm text-gray-700 hover:text-gray-900 focus:outline-none"
                  >
                    <span className="hidden md:block">
                      {user.username} - [{user.role?.name?.toUpperCase() || 'USER'}]
                    </span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                      <div className="py-1">
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900">{user.username}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50 hover:text-red-900"
                        >
                          🚪 Cerrar Sesión
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </nav>
          </div>
        </div>
      </header>

      <main className="layout-content flex-1">{children}</main>

      <footer className="layout-footer">
        <div className="layout-footer-content">
          <div className="flex justify-between items-center">
            <p className="text-sm text-subtle">Book Store © 2024 - Sistema de gestión de libros</p>
            <div className="flex items-center space-x-4">
              <span className="text-xs text-subtle">v1.0.0</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
