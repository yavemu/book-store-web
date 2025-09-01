'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export interface GlobalPaginationState {
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: 'ASC' | 'DESC';
}

export interface GlobalPaginationContextType {
  // Global state
  globalPagination: GlobalPaginationState;
  setGlobalPagination: (pagination: Partial<GlobalPaginationState>) => void;
  
  // Per-entity pagination states
  entityPaginations: Record<string, GlobalPaginationState>;
  
  // Entity-specific methods
  getEntityPagination: (entityName: string) => GlobalPaginationState;
  updateEntityPagination: (entityName: string, pagination: Partial<GlobalPaginationState>) => void;
  resetEntityPagination: (entityName: string) => void;
  
  // Global methods
  handlePageChange: (entityName: string, page: number) => void;
  handleSortChange: (entityName: string, field: string, direction: 'ASC' | 'DESC') => void;
  handleLimitChange: (entityName: string, limit: number) => void;
  updateFromApiMeta: (entityName: string, meta: any) => void;
  
  // Clear methods
  clearEntityParameter: (entityName: string, param: keyof GlobalPaginationState) => void;
  resetAllPagination: () => void;
}

const defaultPaginationState: GlobalPaginationState = {
  page: 1,
  limit: 10,
  sortBy: 'createdAt',
  sortOrder: 'DESC'
};

const GlobalPaginationContext = createContext<GlobalPaginationContextType | undefined>(undefined);

interface GlobalPaginationProviderProps {
  children: ReactNode;
}

export function GlobalPaginationProvider({ children }: GlobalPaginationProviderProps) {
  // Global default pagination
  const [globalPagination, setGlobalPaginationState] = useState<GlobalPaginationState>(defaultPaginationState);
  
  // Per-entity pagination states
  const [entityPaginations, setEntityPaginations] = useState<Record<string, GlobalPaginationState>>({});
  
  // Get pagination for specific entity (with fallback to global)
  const getEntityPagination = useCallback((entityName: string): GlobalPaginationState => {
    return entityPaginations[entityName] || { ...globalPagination };
  }, [entityPaginations, globalPagination]);
  
  // Update global pagination
  const setGlobalPagination = useCallback((pagination: Partial<GlobalPaginationState>) => {
    setGlobalPaginationState(prev => ({ ...prev, ...pagination }));
  }, []);
  
  // Update entity-specific pagination
  const updateEntityPagination = useCallback((entityName: string, pagination: Partial<GlobalPaginationState>) => {
    setEntityPaginations(prev => ({
      ...prev,
      [entityName]: { ...getEntityPagination(entityName), ...pagination }
    }));
  }, [getEntityPagination]);
  
  // Reset entity pagination to global defaults
  const resetEntityPagination = useCallback((entityName: string) => {
    setEntityPaginations(prev => {
      const newState = { ...prev };
      delete newState[entityName];
      return newState;
    });
  }, []);
  
  // Handle page change
  const handlePageChange = useCallback((entityName: string, page: number) => {
    updateEntityPagination(entityName, { page });
  }, [updateEntityPagination]);
  
  // Handle sort change
  const handleSortChange = useCallback((entityName: string, field: string, direction: 'ASC' | 'DESC') => {
    updateEntityPagination(entityName, { sortBy: field, sortOrder: direction, page: 1 });
  }, [updateEntityPagination]);
  
  // Handle limit change
  const handleLimitChange = useCallback((entityName: string, limit: number) => {
    updateEntityPagination(entityName, { limit, page: 1 });
  }, [updateEntityPagination]);
  
  // Update from API meta response
  const updateFromApiMeta = useCallback((entityName: string, meta: any) => {
    if (meta) {
      const updates: Partial<GlobalPaginationState> = {};
      if (meta.currentPage) updates.page = meta.currentPage;
      if (meta.itemsPerPage) updates.limit = meta.itemsPerPage;
      
      if (Object.keys(updates).length > 0) {
        updateEntityPagination(entityName, updates);
      }
    }
  }, [updateEntityPagination]);
  
  // Clear specific parameter for entity
  const clearEntityParameter = useCallback((entityName: string, param: keyof GlobalPaginationState) => {
    const defaultValue = defaultPaginationState[param];
    updateEntityPagination(entityName, { [param]: defaultValue });
  }, [updateEntityPagination]);
  
  // Reset all pagination to defaults
  const resetAllPagination = useCallback(() => {
    setGlobalPaginationState(defaultPaginationState);
    setEntityPaginations({});
  }, []);
  
  const value: GlobalPaginationContextType = {
    // Global state
    globalPagination,
    setGlobalPagination,
    
    // Per-entity states
    entityPaginations,
    
    // Entity-specific methods
    getEntityPagination,
    updateEntityPagination,
    resetEntityPagination,
    
    // Global methods
    handlePageChange,
    handleSortChange,
    handleLimitChange,
    updateFromApiMeta,
    
    // Clear methods
    clearEntityParameter,
    resetAllPagination
  };
  
  return (
    <GlobalPaginationContext.Provider value={value}>
      {children}
    </GlobalPaginationContext.Provider>
  );
}

export function useGlobalPagination(): GlobalPaginationContextType {
  const context = useContext(GlobalPaginationContext);
  if (context === undefined) {
    throw new Error('useGlobalPagination must be used within a GlobalPaginationProvider');
  }
  return context;
}