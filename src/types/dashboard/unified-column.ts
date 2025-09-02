/**
 * Unified column configuration that serves both table display and search functionality
 * Following Next.js best practices for type safety and reusability
 */

export interface UnifiedColumnConfig<T = any> {
  // Core column properties
  key: keyof T | string;
  label: string;
  
  // Table display properties
  sortable?: boolean;
  render?: (value: any, record: T, index: number) => React.ReactNode | string;
  width?: string | number;
  
  // Search functionality properties
  searchable?: boolean;
  searchType?: 'text' | 'select' | 'date' | 'number' | 'boolean' | 'range';
  searchPlaceholder?: string;
  searchOptions?: { value: any; label: string }[];
  searchValidation?: {
    minLength?: number;
    maxLength?: number;
    required?: boolean;
    pattern?: RegExp;
  };
  
  // Type inference helpers
  dataType?: 'string' | 'number' | 'boolean' | 'date' | 'object' | 'array';
  
  // Advanced search configuration
  advancedSearchConfig?: {
    enabled?: boolean;
    fuzzySearch?: boolean;
    exactMatch?: boolean;
  };
}

/**
 * Helper type to extract search field configuration from unified column
 */
export interface GeneratedSearchField {
  key: string;
  label: string;
  type: 'text' | 'select' | 'date' | 'number' | 'boolean';
  placeholder?: string;
  validation?: {
    minLength?: number;
    maxLength?: number;
    required?: boolean;
  };
  options?: { value: any; label: string }[];
}

/**
 * Utility function to generate search fields from unified columns
 */
export function generateSearchFieldsFromColumns<T = any>(
  columns: UnifiedColumnConfig<T>[]
): GeneratedSearchField[] {
  return columns
    .filter(column => column.searchable !== false) // Include by default unless explicitly disabled
    .map(column => {
      const searchField: GeneratedSearchField = {
        key: column.key as string,
        label: column.label,
        type: inferSearchTypeFromColumn(column),
      };

      // Add placeholder if specified
      if (column.searchPlaceholder) {
        searchField.placeholder = column.searchPlaceholder;
      }

      // Add validation if specified
      if (column.searchValidation) {
        searchField.validation = {
          minLength: column.searchValidation.minLength,
          maxLength: column.searchValidation.maxLength,
          required: column.searchValidation.required,
        };
      }

      // Add options for select/boolean types
      if (column.searchOptions) {
        searchField.options = column.searchOptions;
      }

      return searchField;
    });
}

/**
 * Infer search type from column configuration and data type
 */
function inferSearchTypeFromColumn<T = any>(column: UnifiedColumnConfig<T>): 'text' | 'select' | 'date' | 'number' | 'boolean' {
  // Explicit search type takes precedence
  if (column.searchType && column.searchType !== 'range') {
    return column.searchType;
  }

  // Infer from data type
  switch (column.dataType) {
    case 'number':
      return 'number';
    case 'boolean':
      return 'boolean';
    case 'date':
      return 'date';
    case 'string':
    default:
      // If options are provided, it's likely a select
      return column.searchOptions && column.searchOptions.length > 0 ? 'select' : 'text';
  }
}

/**
 * Helper to generate placeholder text based on column configuration
 */
export function generatePlaceholderForColumn<T = any>(column: UnifiedColumnConfig<T>): string {
  if (column.searchPlaceholder) {
    return column.searchPlaceholder;
  }

  // Generate default placeholder based on type and label
  switch (column.dataType) {
    case 'number':
      return `Ej: 100`;
    case 'date':
      return `Seleccionar fecha`;
    case 'boolean':
      return `Seleccionar estado`;
    default:
      return `Buscar ${column.label.toLowerCase()}...`;
  }
}