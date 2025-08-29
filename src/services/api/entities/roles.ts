export interface Role {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
}

export interface RoleOption {
  value: string;
  label: string;
}

export const rolesApi = {
  // Obtener lista de roles disponibles
  // Como no hay endpoint específico de roles, devolvemos los roles reales obtenidos de la API
  list: async (): Promise<Role[]> => {
    // Basado en la respuesta real de la API de usuarios y login:
    // - admin: bc217994-8e6c-4be4-9178-11a2cddc7b3f
    // - user: d93fcb38-2b78-4cc3-89b8-a8176c8c7e27
    return [
      {
        id: "bc217994-8e6c-4be4-9178-11a2cddc7b3f",
        name: "admin", 
        description: "Administrator role with full access",
        isActive: true
      },
      {
        id: "d93fcb38-2b78-4cc3-89b8-a8176c8c7e27", 
        name: "user",
        description: "Standard user role with basic access",
        isActive: true
      }
    ];
  },

  // Convertir roles a opciones para formularios
  getSelectOptions: async (): Promise<RoleOption[]> => {
    const roles = await rolesApi.list();
    return roles
      .filter(role => role.isActive)
      .map(role => ({
        value: role.id,
        label: role.name === 'admin' ? 'Administrador' : 'Usuario'
      }));
  }
};