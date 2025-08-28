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
  { id: "books", title: "Libros", icon: "📚" }, // Ahora accesible para ambos roles
  { id: "authors", title: "Autores", icon: "✍️", adminOnly: true },
  { id: "publishers", title: "Editoriales", icon: "🏢", adminOnly: true },
  { id: "genres", title: "Géneros", icon: "🏷️", adminOnly: true },
  { id: "users", title: "Usuarios", icon: "👥", adminOnly: true },
  { id: "audit", title: "Auditoría", icon: "📊", adminOnly: true },
];

export default function NavigationMenu({ user, onMenuItemClick, activeMenuItem }: NavigationMenuProps) {
  const isAdmin = user.role?.name?.toLowerCase() === "admin";

  const filteredMenuItems = menuItems.filter((item) => !item.adminOnly || (item.adminOnly && isAdmin));

  const itemClasses = (isActive: boolean) =>
    `flex items-center gap-2 px-4 py-2 rounded-md transition-colors cursor-pointer 
     ${isActive ? "bg-primary bg-opacity-20 text-primary font-semibold" : "text-gray-600 hover:bg-gray-100"}`;

  return (
    <nav className="bg-white shadow rounded-lg p-2">
      {/* Header */}
      <div className="flex items-center justify-between mb-2 px-4 py-2">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">{isAdmin ? "Admin Panel" : "Dashboard"}</h2>
          <p className="text-sm text-gray-500">Hola, {user.username}</p>
        </div>
      </div>

      {/* Horizontal Menu */}
      <ul className="flex space-x-2 overflow-x-auto px-2 py-1">
        {filteredMenuItems.map((item) => (
          <li key={item.id}>
            <div onClick={() => onMenuItemClick(item.id)} className={itemClasses(activeMenuItem === item.id)}>
              <span className="text-lg">{item.icon}</span>
              <span>{item.title}</span>
            </div>
          </li>
        ))}
      </ul>
    </nav>
  );
}
