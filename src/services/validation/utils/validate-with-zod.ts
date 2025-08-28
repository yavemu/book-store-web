import { z } from 'zod';
import { ValidationError } from './validation-error';

export function validateWithZod<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string[]> = {};
      
      error.errors.forEach((err) => {
        const path = err.path.join('.');
        if (!errors[path]) {
          errors[path] = [];
        }
        errors[path].push(err.message);
      });
      
      throw new ValidationError(errors, 'Los datos proporcionados no son válidos');
    }
    
    throw error;
  }
}

export function validateWithZodSafe<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: Record<string, string[]> } {
  try {
    const validatedData = validateWithZod(schema, data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof ValidationError) {
      return { success: false, errors: error.errors };
    }
    
    return { 
      success: false, 
      errors: { 
        _general: ['Ha ocurrido un error inesperado durante la validación'] 
      } 
    };
  }
}

export function getZodErrorMessages(error: z.ZodError): Record<string, string[]> {
  const errors: Record<string, string[]> = {};
  
  error.errors.forEach((err) => {
    const path = err.path.join('.');
    if (!errors[path]) {
      errors[path] = [];
    }
    errors[path].push(err.message);
  });
  
  return errors;
}