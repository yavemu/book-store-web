"use client";

import { EntityForm } from ".";
import { genresFormConfig } from "@/config/forms";
import { BaseEntityFormProps } from "@/types/forms";
import { CreateGenreFormData, UpdateGenreFormData } from "@/services/validation/schemas/genres";

type GenreFormOptimizedProps = BaseEntityFormProps<CreateGenreFormData, UpdateGenreFormData>;

export default function GenreFormOptimized(props: GenreFormOptimizedProps) {
  return <EntityForm config={genresFormConfig} {...props} />;
}