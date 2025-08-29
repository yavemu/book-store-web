"use client";

import { Modal } from "@/components/ui";
import { useEntityApi } from "@/hooks/useEntityApi";

type EntityType = "authors" | "genres" | "publishers" | "books" | "users";

interface DeleteModalOptimizedProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  entityType: EntityType;
  entityId: string;
  entityName?: string;
  apiService: {
    delete: (id: string) => Promise<unknown>;
  };
}

const entityLabels = {
  authors: "autor",
  genres: "género", 
  publishers: "editorial",
  books: "libro",
  users: "usuario"
};

export default function DeleteModalOptimized({
  isOpen,
  onClose,
  onSuccess,
  entityType,
  entityId,
  entityName,
  apiService
}: DeleteModalOptimizedProps) {
  const entityLabel = entityLabels[entityType];
  const displayName = entityName || `${entityLabel} #${entityId}`;

  const entityApi = useEntityApi(apiService, {
    onDeleteSuccess: () => {
      onSuccess();
      onClose();
    },
    entityName: entityLabel
  });

  const handleConfirmDelete = async () => {
    await entityApi.delete(entityId);
  };

  const handleCancel = () => {
    entityApi.reset.delete();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      title={`Eliminar ${entityLabel}`}
      size="md"
    >
      <div className="p-6">
        <p className="text-gray-700 mb-6">
          ¿Estás seguro de que deseas eliminar{" "}
          <span className="font-semibold">&quot;{displayName}&quot;</span>?
        </p>
        
        <p className="text-sm text-gray-500 mb-6">
          Esta acción no se puede deshacer.
        </p>

        {entityApi.states.delete.error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">
              {entityApi.states.delete.error}
            </p>
          </div>
        )}

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={handleCancel}
            disabled={entityApi.states.delete.loading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
          
          <button
            type="button"
            onClick={handleConfirmDelete}
            disabled={entityApi.states.delete.loading}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {entityApi.states.delete.loading && (
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {entityApi.states.delete.loading ? "Eliminando..." : "Eliminar"}
          </button>
        </div>
      </div>
    </Modal>
  );
}