import { apiClient } from "../client";
import {
  CreateUserDto,
  UpdateUserDto,
  UserResponseDto,
  UserListResponseDto,
  CreateUserResponseDto,
  UpdateUserResponseDto,
  DeleteUserResponseDto,
} from "@/types/api/entities";

/**
 * Construye una cadena de consulta URL a partir de un objeto de par metros
 * @param params Objeto de par metros a convertir en una cadena de consulta
 * @returns Cadena de consulta URL
 */
const buildQueryString = (params: Record<string, unknown>): string => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, String(value));
    }
  });

  return searchParams.toString();
};

const buildUrl = (basePath: string, queryParams?: Record<string, unknown>): string => {
  if (!queryParams) return basePath;

  const queryString = buildQueryString(queryParams);
  return queryString ? `${basePath}?${queryString}` : basePath;
};

export interface UserListParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
}

export interface UserAdvancedSearchParams extends UserListParams {
  username?: string;
  email?: string;
  role?: string;
  isActive?: boolean;
  startDate?: string;
  endDate?: string;
}

export interface UserSearchParams {
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  roleId?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
}

export interface UserAdvancedFilterDto {
  name?: string;
  email?: string;
  role?: "admin" | "user";
  isActive?: boolean;
  createdAfter?: string;
  createdBefore?: string;
}

export interface UserExportParams {
  name?: string;
  email?: string;
  role?: "admin" | "user";
  isActive?: boolean;
  createdDateFrom?: string;
  createdDateTo?: string;
  updatedDateFrom?: string;
  updatedDateTo?: string;
}

export const usersApi = {
  // Crear nuevo usuario (solo admin)
  create: (data: CreateUserDto): Promise<CreateUserResponseDto> => {
    return apiClient.post("/users", data);
  },

  // Obtener lista paginada de usuarios (solo admin)
  list: (params?: UserListParams): Promise<UserListResponseDto> => {
    const defaultParams = {
      page: 1,
      limit: 10,
      sortBy: "createdAt",
      sortOrder: "DESC" as const,
      ...params,
    };

    const url = buildUrl("/users", defaultParams);
    return apiClient.get(url);
  },

  // Obtener usuario por ID (admin solamente)
  getById: (id: string): Promise<UserResponseDto> => {
    return apiClient.get(`/users/${id}`);
  },

  // Actualizar usuario (solo admin)
  update: (id: string, data: UpdateUserDto): Promise<UpdateUserResponseDto> => {
    return apiClient.put(`/users/${id}`, data);
  },

  // Eliminar usuario (soft delete - solo admin)
  delete: (id: string): Promise<DeleteUserResponseDto> => {
    return apiClient.delete(`/users/${id}`);
  },

  // Buscar usuarios por término - POST /search (búsqueda exacta)
  search: (params: UserSearchParams): Promise<UserListResponseDto> => {
    const { page = 1, limit = 10, sortBy = "createdAt", sortOrder = "DESC", ...searchData } = params;
    
    const queryParams = {
      page,
      limit,
      sortBy,
      sortOrder
    };

    const url = buildUrl("/users/search", queryParams);
    return apiClient.post(url, searchData);
  },


  // Filtro rápido para búsqueda en tiempo real - GET /filter
  quickFilter: (term: string, params?: { page?: number; limit?: number }): Promise<UserListResponseDto> => {
    if (term.length < 3) {
      throw new Error('Filter term must be at least 3 characters long');
    }

    const queryParams = {
      term,
      page: params?.page || 1,
      limit: Math.min(params?.limit || 10, 50),
      sortBy: 'createdAt',
      sortOrder: 'DESC' as const,
    };

    const url = buildUrl("/users/filter", queryParams);
    return apiClient.get(url);
  },

  // Filtro avanzado con múltiples criterios - POST /advanced-filter
  advancedFilter: (params: UserAdvancedFilterDto & { pagination?: UserListParams }): Promise<UserListResponseDto> => {
    const { pagination, ...filterData } = params;
    
    const queryParams = {
      page: pagination?.page || 1,
      limit: pagination?.limit || 10,
      sortBy: pagination?.sortBy || 'createdAt',
      sortOrder: pagination?.sortOrder || 'DESC',
    };

    const url = buildUrl("/users/advanced-filter", queryParams);
    return apiClient.post(url, filterData);
  },

  // Exportar usuarios a CSV (solo admin)
  exportToCsv: (params?: UserExportParams): Promise<string> => {
    const url = buildUrl("/users/export/csv", params);
    return apiClient.get(url);
  },
};
