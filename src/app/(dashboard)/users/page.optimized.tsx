"use client";

import GenericDashboardPage from "@/components/Dashboard/GenericDashboardPage";
import { usersConfig } from "@/config/dashboard/users.config";
import { usersApi } from "@/services/api/entities/users";
import UserTable from "@/components/users/UserTable";

// Usando el hook optimizado para Users
export default function UsersPageOptimized() {
  return (
    <GenericDashboardPage
      config={usersConfig}
      apiService={usersApi}
      tableComponent={UserTable}
      customHandlers={{
        // Custom handlers específicos para Users
        onAfterCreate: (user) => {
          console.log('Usuario creado exitosamente:', user.email);
          // Aquí podrías enviar email de bienvenida, etc.
        },
        onAfterUpdate: (user) => {
          console.log('Usuario actualizado:', user.email);
        },
        onBeforeDelete: async (user) => {
          // Validación antes de eliminar
          if (user.role === 'admin') {
            const confirm = window.confirm(
              '¿Estás seguro de eliminar un usuario administrador?'
            );
            if (!confirm) {
              throw new Error('Eliminación cancelada por el usuario');
            }
          }
        }
      }}
    />
  );
}