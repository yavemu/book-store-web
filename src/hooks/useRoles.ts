import { useApiRequest } from './useApiRequest';
import { rolesApi } from '@/services/api/entities/roles';

export interface RoleOption {
  value: string;
  label: string;
}

export function useRoles() {
  const {
    data: roles,
    loading,
    error,
    execute
  } = useApiRequest({
    apiFunction: () => rolesApi.getSelectOptions(),
    executeOnMount: true
  });

  return {
    roles: roles || [],
    loading,
    error,
    refetch: execute
  };
}