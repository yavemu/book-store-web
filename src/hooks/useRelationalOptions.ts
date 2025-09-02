import { useState, useEffect, useMemo } from 'react';
import { useApiRequest } from './useApiRequest';
import { genresApi } from '@/services/api/entities/genres';
import { publishingHousesApi } from '@/services/api/entities/publishing-houses';
import { authorsApi } from '@/services/api/entities/authors';
import { usersApi } from '@/services/api/entities/users';

export interface RelationalOption {
  value: string;
  label: string;
}

export interface RelationalOptionsMap {
  [fieldKey: string]: RelationalOption[];
}

// Define the mapping of field keys to their respective APIs and transformers
const FIELD_MAPPINGS: Record<string, {
  api: () => Promise<any>;
  transform: (item: any) => RelationalOption;
}> = {
  // Books relations
  genreId: {
    api: () => genresApi.list({ page: 1, limit: 1000, sortBy: 'name', sortOrder: 'ASC' }),
    transform: (genre: any) => ({ value: genre.id, label: genre.name })
  },
  publisherId: {
    api: () => publishingHousesApi.list({ page: 1, limit: 1000, sortBy: 'name', sortOrder: 'ASC' }),
    transform: (publisher: any) => ({ value: publisher.id, label: publisher.name })
  },
  authorId: {
    api: () => authorsApi.list({ page: 1, limit: 1000, sortBy: 'name', sortOrder: 'ASC' }),
    transform: (author: any) => ({ 
      value: author.id, 
      label: author.name || `${author.firstName || ''} ${author.lastName || ''}`.trim()
    })
  },
  // Users relations
  roleId: {
    api: () => usersApi.list({ page: 1, limit: 1000 }), // This should actually be roles API when available
    transform: (role: any) => ({ value: role.id, label: role.name })
  },
  // Inventory movements relations
  bookId: {
    api: () => genresApi.list({ page: 1, limit: 1000, sortBy: 'title', sortOrder: 'ASC' }), // This should be books API
    transform: (book: any) => ({ value: book.id, label: `${book.title} (${book.isbn})` })
  }
};

// Custom hook to load relational options for form fields
export function useRelationalOptions(fieldKeys: string[]): {
  options: RelationalOptionsMap;
  loading: boolean;
  error: string | null;
} {
  const [options, setOptions] = useState<RelationalOptionsMap>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter only field keys that need relational data
  const relationalFields = useMemo(() => 
    fieldKeys.filter(key => FIELD_MAPPINGS[key]), 
    [fieldKeys]
  );

  useEffect(() => {
    if (relationalFields.length === 0) {
      setOptions({});
      setLoading(false);
      return;
    }

    const loadOptions = async () => {
      setLoading(true);
      setError(null);

      try {
        const optionsMap: RelationalOptionsMap = {};

        // Load all relational data in parallel
        await Promise.all(
          relationalFields.map(async (fieldKey) => {
            const mapping = FIELD_MAPPINGS[fieldKey];
            if (mapping) {
              try {
                const response = await mapping.api();
                const data = response.data || response;
                optionsMap[fieldKey] = Array.isArray(data) 
                  ? data.map(mapping.transform)
                  : [];
              } catch (fieldError) {
                console.error(`Error loading options for ${fieldKey}:`, fieldError);
                optionsMap[fieldKey] = [];
              }
            }
          })
        );

        setOptions(optionsMap);
      } catch (globalError: any) {
        setError(globalError.message || 'Error cargando opciones relacionales');
        setOptions({});
      } finally {
        setLoading(false);
      }
    };

    loadOptions();
  }, [relationalFields]);

  return { options, loading, error };
}