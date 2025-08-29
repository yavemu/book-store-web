"use client";

import { CreateEditForm } from ".";
import { BaseEntityFormProps, EntityFormConfig } from "@/types/forms";

interface EntityFormProps<CreateT, UpdateT> extends BaseEntityFormProps<CreateT, UpdateT> {
  config: EntityFormConfig<CreateT, UpdateT>;
}

function EntityForm<CreateT, UpdateT>({
  mode,
  config,
  onCreateSubmit,
  onUpdateSubmit,
  onCreateSuccess,
  onEditSuccess,
  initialData = {},
  createLoading = false,
  editLoading = false,
  errorMessage,
  showErrorMessage = false
}: EntityFormProps<CreateT, UpdateT>) {
  const handleCreateSubmit = async (validatedData: CreateT) => {
    if (onCreateSubmit) {
      await onCreateSubmit(validatedData);
    }
  };

  const handleUpdateSubmit = async (validatedData: UpdateT) => {
    if (onUpdateSubmit) {
      await onUpdateSubmit(validatedData);
    }
  };

  return (
    <CreateEditForm
      mode={mode}
      createSchema={config.createSchema}
      updateSchema={config.updateSchema}
      createFields={config.createFields}
      editFields={config.editFields}
      onCreateSubmit={handleCreateSubmit}
      onUpdateSubmit={handleUpdateSubmit}
      createSubmitText={config.createSubmitText}
      editSubmitText={config.editSubmitText}
      createLoadingText={config.createLoadingText}
      editLoadingText={config.editLoadingText}
      createSuccessMessage={config.createSuccessMessage}
      editSuccessMessage={config.editSuccessMessage}
      onCreateSuccess={onCreateSuccess}
      onEditSuccess={onEditSuccess}
      initialData={initialData}
      createLoading={createLoading}
      editLoading={editLoading}
      errorMessage={errorMessage}
      showErrorMessage={showErrorMessage}
    />
  );
}

export default EntityForm;