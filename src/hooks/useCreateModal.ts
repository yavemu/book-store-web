import { useState } from 'react';

interface UseCreateModalOptions {
  onSuccess?: () => void;
}

interface UseCreateModalReturn {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  handleSuccess: () => void;
}

export function useCreateModal(options: UseCreateModalOptions = {}): UseCreateModalReturn {
  const [isOpen, setIsOpen] = useState(false);

  const open = () => {
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
  };

  const handleSuccess = () => {
    if (options.onSuccess) {
      options.onSuccess();
    }
    close();
  };

  return {
    isOpen,
    open,
    close,
    handleSuccess
  };
}