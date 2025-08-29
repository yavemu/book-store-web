"use client";

import { EntityForm } from ".";
import { booksFormConfig } from "@/config/forms";
import { BaseEntityFormProps } from "@/types/forms";
import { CreateBookFormData, UpdateBookFormData } from "@/services/validation/schemas/books";

type BookFormOptimizedProps = BaseEntityFormProps<CreateBookFormData, UpdateBookFormData>;

export default function BookFormOptimized(props: BookFormOptimizedProps) {
  return <EntityForm config={booksFormConfig} {...props} />;
}