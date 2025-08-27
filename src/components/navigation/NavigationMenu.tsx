"use client";

import { UserProfileResponseDto } from "@/types/auth";

interface MenuItem {
  id: string;
  title: string;
  icon: string;
  adminOnly?: boolean;
}

interface NavigationMenuProps {
  user: UserProfileResponseDto;
  onMenuItemClick: (menuItemId: string) => void;
  activeMenuItem?: string;
}

const menuItems: MenuItem[] = [
  // For all users
  { id: "catalog", title: "Catálogo de Libros", icon: "📚" },
  { id: "search", title: "Búsqueda de Libros", icon: "🔍" },
  { id: "profile", title: "Mi Perfil", icon: "👤" },
  
  // Admin only
  { id: "books", title: "Gestión de Libros", icon: "➕", adminOnly: true },
  { id: "authors", title: "Gestión de Autores", icon: "✍️", adminOnly: true },
  { id: "publishers", title: "Gestión de Editoriales", icon: "🏢", adminOnly: true },
  { id: "genres", title: "Gestión de Géneros", icon: "🏷️", adminOnly: true },
  { id: "users", title: "Gestión de Usuarios", icon: "👥", adminOnly: true },
  { id: "audit", title: "Registros de Auditoría", icon: "📊", adminOnly: true },
];

export default function NavigationMenu({ user, onMenuItemClick, activeMenuItem }: NavigationMenuProps) {
  const isAdmin = user.role.name.toLowerCase() === 'admin';

  const filteredMenuItems = menuItems.filter(item => 
    !item.adminOnly || (item.adminOnly && isAdmin)
  );

  return (
    <nav className="bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="p-4 bg-gray-50 border-b">
        <h2 className="text-lg font-semibold text-gray-800">
          {isAdmin ? "Panel de Administración" : "Dashboard"}
        </h2>
        <p className="text-sm text-gray-600">
          Bienvenido, {user.username}
        </p>
      </div>
      
      <div className="py-2">
        {filteredMenuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onMenuItemClick(item.id)}
            className={`w-full text-left px-4 py-3 flex items-center space-x-3 transition-colors hover:bg-gray-50 ${
              activeMenuItem === item.id 
                ? 'bg-primary bg-opacity-10 border-r-4 border-primary text-primary' 
                : 'text-gray-700'
            } ${item.adminOnly ? 'border-l-4 border-purple-200' : ''}`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="font-medium">{item.title}</span>
            {item.adminOnly && (
              <span className="ml-auto px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">
                ADMIN
              </span>
            )}
          </button>
        ))}
      </div>
      
      {/* Quick Actions Section */}
      <div className="border-t bg-gray-50 p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Acciones Rápidas</h3>
        <div className="flex flex-wrap gap-2">
          <button className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded hover:bg-blue-200 transition-colors">
            📖 Ver Disponibles
          </button>
          <button className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded hover:bg-green-200 transition-colors">
            🔍 Búsqueda Avanzada
          </button>
          {isAdmin && (
            <>
              <button className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded hover:bg-purple-200 transition-colors">
                ➕ Agregar Libro
              </button>
              <button className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded hover:bg-purple-200 transition-colors">
                📋 Reportes
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}