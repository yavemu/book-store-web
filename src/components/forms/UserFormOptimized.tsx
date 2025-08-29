"use client";

import { EntityForm } from ".";
import { usersFormConfig } from "@/config/forms";
import { BaseEntityFormProps } from "@/types/forms";
import { CreateUserFormData, UpdateUserFormData } from "@/services/validation/schemas/users";

type UserFormOptimizedProps = BaseEntityFormProps<CreateUserFormData, UpdateUserFormData>;

export default function UserFormOptimized(props: UserFormOptimizedProps) {
  return <EntityForm config={usersFormConfig} {...props} />;
}