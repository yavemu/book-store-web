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
  term: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
  offset?: number;
}

export interface UserFilterParams {
  filter: string;
  pagination: {
    page: number;
    limit: number;
    sortBy?: string;
    sortOrder?: "ASC" | "DESC";
  };
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

  // Buscar usuarios por término (admin y user)
  search: (params: UserSearchParams): Promise<UserListResponseDto> => {
    const defaultParams = {
      page: 1,
      limit: 10,
      sortBy: "createdAt",
      sortOrder: "DESC" as const,
      ...params,
    };

    const url = buildUrl("/users/search", defaultParams);
    return apiClient.get(url);
  },

  // Filtrar usuarios en tiempo real (admin y user)
  filter: (params: UserFilterParams): Promise<UserListResponseDto> => {
    return apiClient.post("/users/filter", params);
  },

  // Filtro avanzado de usuarios (admin y user)
  advancedFilter: (filterData: UserAdvancedFilterDto, params?: UserListParams): Promise<UserListResponseDto> => {
    const queryParams = {
      page: 1,
      limit: 10,
      sortBy: "createdAt",
      sortOrder: "DESC" as const,
      ...params,
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
