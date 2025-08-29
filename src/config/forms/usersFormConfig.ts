import { 
  createUserSchema, 
  updateUserSchema, 
  CreateUserFormData, 
  UpdateUserFormData 
} from "@/services/validation/schemas/users";
import { usersApi } from "@/services/api/entities/users";
import { EntityFormConfig } from "@/types/forms";

export const usersFormConfig: EntityFormConfig<CreateUserFormData, UpdateUserFormData> = {
  createSchema: createUserSchema,
  updateSchema: updateUserSchema,
  
  createFields: [
    { name: "username", label: "Nombre de usuario", type: "text", placeholder: "Ej: juan_perez" },
    { name: "email", label: "Correo electrónico", type: "email", placeholder: "usuario@ejemplo.com" },
    { name: "password", label: "Contraseña", type: "password", placeholder: "Mínimo 8 caracteres" },
    { 
      name: "roleId", 
      label: "Rol", 
      type: "select", 
      placeholder: "Seleccionar rol...",
      options: [
        { value: "1", label: "Administrador" },
        { value: "2", label: "Usuario" }
      ]
    }
  ],
  
  editFields: [
    { name: "username", label: "Nombre de usuario", type: "text", placeholder: "Ej: juan_perez" },
    { name: "email", label: "Correo electrónico", type: "email", placeholder: "usuario@ejemplo.com" },
    { name: "password", label: "Nueva contraseña (opcional)", type: "password", placeholder: "Dejar vacío para mantener actual" },
    { 
      name: "roleId", 
      label: "Rol", 
      type: "select", 
      placeholder: "Seleccionar rol...",
      options: [
        { value: "1", label: "Administrador" },
        { value: "2", label: "Usuario" }
      ]
    }
  ],

  entityName: "usuario",
  createSubmitText: "Crear Usuario",
  editSubmitText: "Actualizar Usuario",
  createLoadingText: "Creando usuario...",
  editLoadingText: "Actualizando usuario...",
  createSuccessMessage: "Usuario creado exitosamente",
  editSuccessMessage: "Usuario actualizado exitosamente"
};