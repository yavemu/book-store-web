/**
 * Hook especializado para validación ISBN en tiempo real
 * Usa advanced-filter para verificar unicidad del ISBN
 */

import { useState, useEffect, useCallback } from 'react';
import { useDebounce } from '../useDebounce';
import { booksApi } from '@/services/api/entities/books';

interface IsbnValidationState {
  isValidating: boolean;
  isValid: boolean;
  isDuplicate: boolean;
  errorMessage: string | null;
  suggestion: string | null;
}

export function useIsbnValidation(initialIsbn?: string) {
  const [isbn, setIsbn] = useState(initialIsbn || '');
  const [validationState, setValidationState] = useState<IsbnValidationState>({
    isValidating: false,
    isValid: false,
    isDuplicate: false,
    errorMessage: null,
    suggestion: null
  });

  // Debounce para evitar validaciones excesivas
  const debouncedIsbn = useDebounce(isbn, 500);

  // Validar formato ISBN
  const validateIsbnFormat = useCallback((isbnCode: string): boolean => {
    // ISBN-10 o ISBN-13 validation
    const cleanIsbn = isbnCode.replace(/[-\s]/g, '');
    
    if (cleanIsbn.length === 10) {
      // ISBN-10 validation
      const chars = cleanIsbn.split('');
      let sum = 0;
      for (let i = 0; i < 9; i++) {
        sum += parseInt(chars[i]) * (10 - i);
      }
      const checkDigit = chars[9] === 'X' ? 10 : parseInt(chars[9]);
      return (sum + checkDigit) % 11 === 0;
    } else if (cleanIsbn.length === 13) {
      // ISBN-13 validation
      const chars = cleanIsbn.split('').map(Number);
      let sum = 0;
      for (let i = 0; i < 12; i++) {
        sum += chars[i] * (i % 2 === 0 ? 1 : 3);
      }
      const checkDigit = (10 - (sum % 10)) % 10;
      return checkDigit === chars[12];
    }
    
    return false;
  }, []);

  // Verificar duplicados usando advanced-filter
  const checkDuplicateIsbn = useCallback(async (isbnCode: string): Promise<boolean> => {
    try {
      const result = await booksApi.advancedFilter(
        { isbn: isbnCode }, 
        { page: 1, limit: 1 }
      );
      return result?.data && result.data.length > 0;
    } catch (error) {
      console.error('Error checking ISBN duplicate:', error);
      return false;
    }
  }, []);

  // Generar sugerencias de ISBN válido
  const generateIsbnSuggestion = useCallback((invalidIsbn: string): string => {
    const cleanIsbn = invalidIsbn.replace(/[-\s]/g, '');
    
    if (cleanIsbn.length === 9) {
      // Generar ISBN-10 check digit
      let sum = 0;
      for (let i = 0; i < 9; i++) {
        sum += parseInt(cleanIsbn[i]) * (10 - i);
      }
      const checkDigit = (11 - (sum % 11)) % 11;
      const finalDigit = checkDigit === 10 ? 'X' : checkDigit.toString();
      return `${cleanIsbn}${finalDigit}`;
    } else if (cleanIsbn.length === 12) {
      // Generar ISBN-13 check digit
      const chars = cleanIsbn.split('').map(Number);
      let sum = 0;
      for (let i = 0; i < 12; i++) {
        sum += chars[i] * (i % 2 === 0 ? 1 : 3);
      }
      const checkDigit = (10 - (sum % 10)) % 10;
      return `${cleanIsbn}${checkDigit}`;
    }
    
    return cleanIsbn;
  }, []);

  // Validación completa
  const validateIsbn = useCallback(async (isbnCode: string) => {
    if (!isbnCode || isbnCode.length < 10) {
      setValidationState({
        isValidating: false,
        isValid: false,
        isDuplicate: false,
        errorMessage: 'ISBN debe tener al menos 10 dígitos',
        suggestion: null
      });
      return;
    }

    setValidationState(prev => ({ ...prev, isValidating: true }));

    try {
      // 1. Validar formato
      const isFormatValid = validateIsbnFormat(isbnCode);
      
      if (!isFormatValid) {
        const suggestion = generateIsbnSuggestion(isbnCode);
        setValidationState({
          isValidating: false,
          isValid: false,
          isDuplicate: false,
          errorMessage: 'Formato de ISBN inválido',
          suggestion: suggestion !== isbnCode ? suggestion : null
        });
        return;
      }

      // 2. Verificar duplicados
      const isDuplicate = await checkDuplicateIsbn(isbnCode);
      
      if (isDuplicate) {
        setValidationState({
          isValidating: false,
          isValid: false,
          isDuplicate: true,
          errorMessage: 'Este ISBN ya existe en el sistema',
          suggestion: null
        });
        return;
      }

      // 3. ISBN válido y único
      setValidationState({
        isValidating: false,
        isValid: true,
        isDuplicate: false,
        errorMessage: null,
        suggestion: null
      });

    } catch (error) {
      setValidationState({
        isValidating: false,
        isValid: false,
        isDuplicate: false,
        errorMessage: 'Error validando ISBN. Intente nuevamente.',
        suggestion: null
      });
    }
  }, [validateIsbnFormat, checkDuplicateIsbn, generateIsbnSuggestion]);

  // Efecto para validar cuando cambia el ISBN debounced
  useEffect(() => {
    if (debouncedIsbn) {
      validateIsbn(debouncedIsbn);
    } else {
      setValidationState({
        isValidating: false,
        isValid: false,
        isDuplicate: false,
        errorMessage: null,
        suggestion: null
      });
    }
  }, [debouncedIsbn, validateIsbn]);

  // Manual validation trigger
  const validateManually = useCallback(() => {
    if (isbn) {
      validateIsbn(isbn);
    }
  }, [isbn, validateIsbn]);

  // Apply suggestion
  const applySuggestion = useCallback(() => {
    if (validationState.suggestion) {
      setIsbn(validationState.suggestion);
    }
  }, [validationState.suggestion]);

  return {
    // Estado del ISBN
    isbn,
    setIsbn,
    
    // Estado de validación
    ...validationState,
    
    // Métodos
    validateManually,
    applySuggestion,
    
    // Utilidades
    canSubmit: validationState.isValid && !validationState.isValidating,
    hasError: !!validationState.errorMessage,
    hasSuggestion: !!validationState.suggestion
  };
}