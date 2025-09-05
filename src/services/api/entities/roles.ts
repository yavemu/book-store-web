import { apiClient } from "../client";
import { CommonListParams, ApiListResponse } from "@/types/api/entities";

export interface RoleResponseDto {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRoleDto {
  name: string;
  description?: string;
}

export interface UpdateRoleDto {
  name?: string;
  description?: string;
}

export interface RoleOption {
  value: string;
  label: string;
}

export interface RoleListResponseDto extends ApiListResponse<RoleResponseDto> {}

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

export const rolesApi = {
  // Crear nuevo rol (solo admin)
  create: (data: CreateRoleDto): Promise<RoleResponseDto> => {
    return apiClient.post("/roles", data);
  },

  // Obtener lista paginada de roles (admin y user)
  list: (params?: CommonListParams): Promise<RoleListResponseDto> => {
    const defaultParams = {
      page: 1,
      limit: 10,
      sortBy: "createdAt",
      sortOrder: "DESC" as const,
      ...params,
    };

    const url = buildUrl("/roles", defaultParams);
    return apiClient.get(url);
  },

  // Obtener rol por ID (admin y user)
  getById: (id: string): Promise<RoleResponseDto> => {
    return apiClient.get(`/roles/${id}`);
  },

  // Actualizar rol (solo admin)
  update: (id: string, data: UpdateRoleDto): Promise<RoleResponseDto> => {
    return apiClient.put(`/roles/${id}`, data);
  },

  // Eliminar rol (soft delete - solo admin)
  delete: (id: string): Promise<{ success: boolean; message: string }> => {
    return apiClient.delete(`/roles/${id}`);
  },

  // Convertir roles a opciones para formularios
  getSelectOptions: async (): Promise<RoleOption[]> => {
    const response = await rolesApi.list({ limit: 100 });
    const roles = response.data || [];
    return roles
      .filter(role => role.isActive)
      .map(role => ({
        value: role.id,
        label: role.name === 'admin' ? 'Administrador' : role.name === 'user' ? 'Usuario' : role.name
      }));
  }
};