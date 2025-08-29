import { useState, useEffect } from 'react';
import { genresApi } from '@/services/api/entities/genres';

export function useGenres() {
  const [genres, setGenres] = useState<Array<{ value: string; label: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const loadGenres = async () => {
      try {
        setLoading(true);
        setError('');
        const genreOptions = await genresApi.getSelectOptions();
        setGenres(genreOptions);
      } catch (err) {
        console.error('Error loading genres:', err);
        setError('Error al cargar géneros');
        // Fallback ya manejado en el API
        setGenres([]);
      } finally {
        setLoading(false);
      }
    };

    loadGenres();
  }, []);

  return { genres, loading, error };
}