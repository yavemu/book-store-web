'use client';

import { ConfirmationModal } from '@/components/ui';
import { bookCatalogApi } from '@/services/api';
import { BookCatalog } from '@/types/domain';

interface DeleteBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  book: BookCatalog | null;
}

export function DeleteBookModal({ isOpen, onClose, onSuccess, book }: DeleteBookModalProps) {
  const handleDelete = async () => {
    if (!book) return;
    await bookCatalogApi.delete(book.id);
    onSuccess();
  };

  if (!book) return null;

  const bookDetails = `${book.title} (ISBN: ${book.isbnCode || 'N/A'})`;

  return (
    <ConfirmationModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleDelete}
      title="Eliminar Libro"
      message="¿Estás seguro de que deseas eliminar este libro? Esta acción no se puede deshacer y el libro será removido permanentemente del catálogo."
      confirmText="Eliminar"
      cancelText="Cancelar"
      variant="danger"
      itemName={bookDetails}
    />
  );
}