export class ValidationError extends Error {
  public readonly errors: Record<string, string[]>;
  
  constructor(errors: Record<string, string[]>, message: string = 'Errores de validación') {
    super(message);
    this.name = 'ValidationError';
    this.errors = errors;
  }

  public getErrorsForField(field: string): string[] {
    return this.errors[field] || [];
  }

  public getFirstErrorForField(field: string): string | undefined {
    const fieldErrors = this.getErrorsForField(field);
    return fieldErrors.length > 0 ? fieldErrors[0] : undefined;
  }

  public getAllErrors(): string[] {
    return Object.values(this.errors).flat();
  }

  public hasErrors(): boolean {
    return Object.keys(this.errors).length > 0;
  }

  public hasErrorsForField(field: string): boolean {
    return this.getErrorsForField(field).length > 0;
  }
}