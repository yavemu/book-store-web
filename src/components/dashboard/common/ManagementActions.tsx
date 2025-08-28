"use client";

import { Button } from "@/components/forms";

interface ManagementActionsProps<T> {
  item: T;
  onView?: (item: T) => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  viewLabel?: string;
  editLabel?: string;
  deleteLabel?: string;
}

export default function ManagementActions<T>({
  item,
  onView,
  onEdit,
  onDelete,
  viewLabel = "Ver",
  editLabel = "Editar",
  deleteLabel = "Eliminar",
}: ManagementActionsProps<T>) {
  return (
    <div className="flex items-center space-x-2">
      {onView && (
        <Button 
          onClick={() => onView(item)} 
          className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 border border-blue-300 rounded"
        >
          {viewLabel}
        </Button>
      )}
      {onEdit && (
        <Button 
          onClick={() => onEdit(item)} 
          className="px-3 py-1 text-sm text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50 border border-yellow-300 rounded"
        >
          {editLabel}
        </Button>
      )}
      {onDelete && (
        <Button 
          onClick={() => onDelete(item)} 
          className="px-3 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-300 rounded"
        >
          {deleteLabel}
        </Button>
      )}
    </div>
  );
}