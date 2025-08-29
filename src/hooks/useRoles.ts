import { useState, useEffect } from 'react';
import { rolesApi, RoleOption } from '@/services/api/entities/roles';

export function useRoles() {
  const [roles, setRoles] = useState<RoleOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const loadRoles = async () => {
      try {
        setLoading(true);
        setError('');
        const roleOptions = await rolesApi.getSelectOptions();
        setRoles(roleOptions);
      } catch (err) {
        console.error('Error loading roles:', err);
        setError('Error al cargar roles');
        // Fallback a opciones por defecto con IDs reales
        setRoles([
          { value: "bc217994-8e6c-4be4-9178-11a2cddc7b3f", label: "Administrador" },
          { value: "d93fcb38-2b78-4cc3-89b8-a8176c8c7e27", label: "Usuario" }
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadRoles();
  }, []);

  return { roles, loading, error };
}