import { useApiRequest } from './useApiRequest';
import { useAppSelector } from '@/store/hooks';

interface UseInventoryMovementsOptions {
  onSuccess?: (response: any) => void;
  onError?: (error: any) => void;
}

interface SearchFilters {
  type?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  userId?: string;
  userRole?: string;
}

export function useInventoryMovements(options?: UseInventoryMovementsOptions) {
  const { user } = useAppSelector(state => state.auth);
  
  const { loading, error, data, execute } = useApiRequest({
    endpoint: '',
    method: 'GET',
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });

  const isAdmin = () => {
    return user?.role?.toLowerCase() === 'admin';
  };

  const addUserIdIfNeeded = (endpoint: string): string => {
    // If user is not authenticated, don't make the request
    if (!user) {
      return endpoint;
    }

    // If user is admin, don't add userId automatically
    if (isAdmin()) {
      return endpoint;
    }

    // For regular users, add their userId to ensure they only see their own data
    const separator = endpoint.includes('?') ? '&' : '?';
    return `${endpoint}${separator}userId=${user.id}`;
  };

  const fetchMovementsByBookId = async (bookId: string) => {
    if (!bookId || !user) {
      return;
    }

    const baseEndpoint = `/inventory/book/${bookId}`;
    const endpoint = addUserIdIfNeeded(baseEndpoint);
    
    return execute({ endpoint });
  };

  const fetchMovementsByUserId = async (userId: string, userRole?: string) => {
    if (!userId || !user) {
      return;
    }

    // Regular users can only fetch their own movements
    const targetUserId = isAdmin() ? userId : user.id;
    
    let endpoint = `/inventory-movements/search?userId=${encodeURIComponent(targetUserId)}`;
    
    if (userRole && isAdmin()) {
      endpoint += `&userRole=${encodeURIComponent(userRole)}`;
    }

    return execute({ endpoint });
  };

  const searchMovements = async (filters: SearchFilters) => {
    if (!user) {
      return;
    }

    // Clean filters to remove empty values
    const cleanFilters = Object.entries(filters).reduce((acc, [key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, string>);

    const queryString = new URLSearchParams(cleanFilters).toString();
    const baseEndpoint = `/inventory-movements/search?${queryString}`;
    const endpoint = addUserIdIfNeeded(baseEndpoint);
    
    return execute({ endpoint });
  };

  return {
    loading,
    error,
    movements: data,
    fetchMovementsByBookId,
    fetchMovementsByUserId,
    searchMovements,
  };
}