"use client";

import { EntityForm } from ".";
import { publishersFormConfig } from "@/config/forms";
import { BaseEntityFormProps } from "@/types/forms";
import { CreatePublishingHouseFormData, UpdatePublishingHouseFormData } from "@/services/validation/schemas/publishing-houses";

type PublisherFormOptimizedProps = BaseEntityFormProps<CreatePublishingHouseFormData, UpdatePublishingHouseFormData>;

export default function PublisherFormOptimized(props: PublisherFormOptimizedProps) {
  return <EntityForm config={publishersFormConfig} {...props} />;
}