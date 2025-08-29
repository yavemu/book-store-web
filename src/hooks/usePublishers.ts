import { useState, useEffect } from 'react';
import { publishingHousesApi } from '@/services/api/entities/publishing-houses';

export function usePublishers() {
  const [publishers, setPublishers] = useState<Array<{ value: string; label: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const loadPublishers = async () => {
      try {
        setLoading(true);
        setError('');
        const publisherOptions = await publishingHousesApi.getSelectOptions();
        setPublishers(publisherOptions);
      } catch (err) {
        console.error('Error loading publishers:', err);
        setError('Error al cargar editoriales');
        // Fallback ya manejado en el API
        setPublishers([]);
      } finally {
        setLoading(false);
      }
    };

    loadPublishers();
  }, []);

  return { publishers, loading, error };
}