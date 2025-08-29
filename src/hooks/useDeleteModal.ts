import { useState } from 'react';

interface UseDeleteModalOptions {
  onSuccess?: () => void;
}

interface UseDeleteModalReturn {
  isOpen: boolean;
  entityId: string | null;
  entityName: string | null;
  open: (id: string, name?: string) => void;
  close: () => void;
  handleSuccess: () => void;
}

export function useDeleteModal(options: UseDeleteModalOptions = {}): UseDeleteModalReturn {
  const [isOpen, setIsOpen] = useState(false);
  const [entityId, setEntityId] = useState<string | null>(null);
  const [entityName, setEntityName] = useState<string | null>(null);

  const open = (id: string, name?: string) => {
    setEntityId(id);
    setEntityName(name || null);
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    setEntityId(null);
    setEntityName(null);
  };

  const handleSuccess = () => {
    if (options.onSuccess) {
      options.onSuccess();
    }
    close();
  };

  return {
    isOpen,
    entityId,
    entityName,
    open,
    close,
    handleSuccess
  };
}