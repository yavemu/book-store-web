"use client";

import { EntityForm } from ".";
import { authorsFormConfig } from "@/config/forms";
import { BaseEntityFormProps } from "@/types/forms";
import { CreateAuthorFormData, UpdateAuthorFormData } from "@/services/validation/schemas/authors";

type AuthorFormOptimizedProps = BaseEntityFormProps<CreateAuthorFormData, UpdateAuthorFormData>;

export default function AuthorFormOptimized(props: AuthorFormOptimizedProps) {
  return <EntityForm config={authorsFormConfig} {...props} />;
}