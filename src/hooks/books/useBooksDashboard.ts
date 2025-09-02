/**
 * Hook especializado para el Dashboard de Books
 * Integra validación ISBN, manejo de géneros/editoriales y todas las funcionalidades CRUD
 */

import { useDashboardOptimized } from '../dashboard/useDashboardOptimized';
import { useIsbnValidation } from './useIsbnValidation';
import { useGenreEditorialManager } from './useGenreEditorialManager';
import { booksApi } from '@/services/api/entities/books';
import { booksConfig } from '@/config/dashboard/books.config';
import { useState, useCallback, useMemo } from 'react';

interface BookFormData {
  title: string;
  isbn: string;
  description?: string;
  publishedDate: string;
  price: number;
  stock: number;
  genreId: string;
  publisherId: string;
  authors?: string[]; // Array of author IDs
}

interface UseBooksDashboardProps {
  customHandlers?: any;
  initialIsbn?: string;
}

export function useBooksDashboard({ 
  customHandlers = {},
  initialIsbn 
}: UseBooksDashboardProps = {}) {
  
  // Form state específico para Books
  const [bookFormData, setBookFormData] = useState<Partial<BookFormData>>({
    title: '',
    isbn: initialIsbn || '',
    description: '',
    publishedDate: '',
    price: 0,
    stock: 0,
    authors: []
  });

  // Specialized hooks
  const isbnValidation = useIsbnValidation(bookFormData.isbn);
  const genreEditorialManager = useGenreEditorialManager();

  // Update form data
  const updateBookFormData = useCallback((updates: Partial<BookFormData>) => {
    setBookFormData(prev => ({ ...prev, ...updates }));
    
    // Sync ISBN with validation hook
    if (updates.isbn !== undefined) {
      isbnValidation.setIsbn(updates.isbn);
    }
  }, [isbnValidation]);

  // Custom handlers for Books
  const booksCustomHandlers = useMemo(() => ({
    // Override form submit to include specialized validation
    onFormSubmit: async (formData: any) => {
      // 1. Validate ISBN
      if (!isbnValidation.canSubmit) {
        throw new Error('ISBN no válido o duplicado');
      }

      // 2. Validate genre and publisher
      if (!genreEditorialManager.hasValidSelections) {
        throw new Error('Debe seleccionar género y editorial');
      }

      // 3. Combine all form data
      const { genreId, publisherId } = genreEditorialManager.getSelectedIds();
      
      const completeFormData = {
        ...bookFormData,
        ...formData,
        isbn: isbnValidation.isbn,
        genreId,
        publisherId
      };

      // 4. Call the original form submit
      return dashboardHook.handlers.onFormSubmit?.(completeFormData);
    },

    // Override form cancel to reset specialized hooks
    onFormCancel: () => {
      genreEditorialManager.clearSelections();
      setBookFormData({
        title: '',
        isbn: '',
        description: '',
        publishedDate: '',
        price: 0,
        stock: 0,
        authors: []
      });
      isbnValidation.setIsbn('');
      
      // Call original cancel
      dashboardHook.handlers.onFormCancel?.();
    },

    // Override create to prepare form
    onCreate: () => {
      // Reset all form data
      genreEditorialManager.clearSelections();
      setBookFormData({
        title: '',
        isbn: '',
        description: '',
        publishedDate: '',
        price: 0,
        stock: 0,
        authors: []
      });
      isbnValidation.setIsbn('');
      
      // Call original create
      dashboardHook.handlers.onCreate?.();
    },

    // Override edit to populate form
    onEdit: (book: any) => {
      // Populate book form data
      setBookFormData({
        title: book.title || '',
        isbn: book.isbn || '',
        description: book.description || '',
        publishedDate: book.publishedDate || '',
        price: book.price || 0,
        stock: book.stock || 0,
        authors: book.authors?.map((author: any) => author.id) || []
      });

      // Set ISBN validation
      isbnValidation.setIsbn(book.isbn || '');

      // Set genre and publisher
      if (book.genre) {
        genreEditorialManager.selectGenre(book.genre);
      }
      if (book.publisher) {
        genreEditorialManager.selectPublisher(book.publisher);
      }

      // Call original edit
      dashboardHook.handlers.onEdit?.(book);
    },

    // Custom handlers passed from parent
    ...customHandlers
  }), [
    isbnValidation,
    genreEditorialManager,
    bookFormData,
    customHandlers
  ]);

  // Main dashboard hook with Books configuration
  const dashboardHook = useDashboardOptimized({
    config: booksConfig,
    apiService: booksApi,
    customHandlers: booksCustomHandlers,
    specializedHooks: {
      isbnValidation,
      genreEditorialManager
    }
  });

  // ===== ADDITIONAL BOOK-SPECIFIC METHODS =====

  // Search books by ISBN specifically
  const searchByIsbn = useCallback(async (isbn: string) => {
    if (!isbn || isbn.length < 10) return;
    
    try {
      await dashboardHook.apiCall.refetch();
      return await booksApi.advancedFilter(
        { isbn }, 
        { page: 1, limit: 10 }
      );
    } catch (error) {
      console.error('Error searching by ISBN:', error);
      throw error;
    }
  }, [dashboardHook.apiCall]);

  // Search books by genre
  const searchByGenre = useCallback(async (genreId: string) => {
    if (!genreId) return;
    
    try {
      return await booksApi.advancedFilter(
        { genreId }, 
        { page: 1, limit: 10 }
      );
    } catch (error) {
      console.error('Error searching by genre:', error);
      throw error;
    }
  }, []);

  // Search books by publisher
  const searchByPublisher = useCallback(async (publisherId: string) => {
    if (!publisherId) return;
    
    try {
      return await booksApi.advancedFilter(
        { publisherId }, 
        { page: 1, limit: 10 }
      );
    } catch (error) {
      console.error('Error searching by publisher:', error);
      throw error;
    }
  }, []);

  // Bulk update stock
  const bulkUpdateStock = useCallback(async (books: any[], newStock: number) => {
    try {
      const updates = books.map(book => 
        booksApi.update(book.id, { ...book, stock: newStock })
      );
      
      await Promise.all(updates);
      await dashboardHook.utils.loadData();
      
      return { success: true, updated: books.length };
    } catch (error) {
      console.error('Error in bulk stock update:', error);
      throw error;
    }
  }, [dashboardHook.utils]);

  // ===== DERIVED STATE AND VALIDATION =====

  const booksState = useMemo(() => ({
    // Original dashboard state
    ...dashboardHook.state,
    
    // Book-specific form data
    bookFormData,
    
    // Validation states
    isbnValidation: {
      ...isbnValidation,
      isValidating: isbnValidation.isValidating,
      isValid: isbnValidation.isValid,
      errorMessage: isbnValidation.errorMessage,
      suggestion: isbnValidation.suggestion
    },
    
    // Genre/Publisher management
    genreEditorial: {
      ...genreEditorialManager.state,
      hasValidSelections: genreEditorialManager.hasValidSelections,
      canCreateGenre: genreEditorialManager.canCreateGenre,
      canCreatePublisher: genreEditorialManager.canCreatePublisher
    },
    
    // Combined validation
    canSubmitForm: isbnValidation.canSubmit && 
                   genreEditorialManager.hasValidSelections &&
                   bookFormData.title?.trim() &&
                   bookFormData.publishedDate &&
                   (bookFormData.price || 0) >= 0,
    
    // Loading states
    isFormLoading: dashboardHook.state.formLoading || 
                   genreEditorialManager.isLoading,
    
    // Error states
    hasValidationErrors: !isbnValidation.canSubmit || 
                        !genreEditorialManager.hasValidSelections ||
                        isbnValidation.hasError
  }), [
    dashboardHook.state,
    bookFormData,
    isbnValidation,
    genreEditorialManager
  ]);

  return {
    // Main dashboard state and handlers
    ...dashboardHook,
    
    // Override state with book-specific data
    state: booksState,
    
    // Book-specific form methods
    bookForm: {
      data: bookFormData,
      updateData: updateBookFormData,
      resetForm: booksCustomHandlers.onFormCancel,
      canSubmit: booksState.canSubmitForm
    },
    
    // ISBN validation methods
    isbn: {
      ...isbnValidation,
      searchByIsbn
    },
    
    // Genre/Publisher management methods
    genreEditorial: {
      ...genreEditorialManager,
      searchByGenre,
      searchByPublisher
    },
    
    // Book-specific operations
    books: {
      searchByIsbn,
      searchByGenre,
      searchByPublisher,
      bulkUpdateStock
    }
  };
}