"use client";

import { EntityForm } from ".";
import { usersFormConfig } from "@/config/forms";
import { useRoles } from "@/hooks/useRoles";
import { BaseEntityFormProps } from "@/types/forms";
import { CreateUserFormData, UpdateUserFormData } from "@/services/validation/schemas/users";

type DynamicUserFormProps = BaseEntityFormProps<CreateUserFormData, UpdateUserFormData>;

export function DynamicUserForm(props: DynamicUserFormProps) {
  const { roles, loading: rolesLoading } = useRoles();

  // Crear configuración dinámica con roles actualizados
  const dynamicConfig = {
    ...usersFormConfig,
    createFields: usersFormConfig.createFields.map(field => 
      field.name === 'roleId' ? { ...field, options: roles } : field
    ),
    editFields: usersFormConfig.editFields.map(field => 
      field.name === 'roleId' ? { ...field, options: roles } : field
    ),
  };

  if (rolesLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="text-gray-600">Cargando formulario...</div>
      </div>
    );
  }

  return (
    <EntityForm
      {...props}
      config={dynamicConfig}
    />
  );
}