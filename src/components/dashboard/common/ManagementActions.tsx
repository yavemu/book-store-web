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
          variant="outline" 
          size="sm" 
          onClick={() => onView(item)} 
          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
        >
          {viewLabel}
        </Button>
      )}
      {onEdit && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onEdit(item)} 
          className="text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
        >
          {editLabel}
        </Button>
      )}
      {onDelete && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onDelete(item)} 
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          {deleteLabel}
        </Button>
      )}
    </div>
  );
}