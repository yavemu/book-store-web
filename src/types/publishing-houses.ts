import { BaseEntity, PaginationMeta } from './domain';

export interface PublishingHouse extends BaseEntity {
  name: string;
  description?: string;
  country?: string;
  city?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  logoUrl?: string;
  foundedYear?: number;
  isActive: boolean;
}

export interface CreatePublishingHouseDto {
  name: string;
  description?: string;
  country?: string;
  city?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  logoUrl?: string;
  foundedYear?: number;
  isActive?: boolean;
}

export type UpdatePublishingHouseDto = Partial<CreatePublishingHouseDto>;

export interface PublishingHouseResponseDto {
  success: boolean;
  message: string;
  data: PublishingHouse;
}

export interface PublishingHouseListResponseDto {
  success: boolean;
  message: string;
  data: PublishingHouse[];
  meta: PaginationMeta;
}

export interface CreatePublishingHouseResponseDto {
  success: boolean;
  message: string;
  data: PublishingHouse;
}

export interface UpdatePublishingHouseResponseDto {
  success: boolean;
  message: string;
  data: PublishingHouse;
}

export interface DeletePublishingHouseResponseDto {
  success: boolean;
  message: string;
}

export interface PublishingHouseListParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface PublishingHouseSearchParams extends PublishingHouseListParams {
  term: string;
}

export interface PublishingHouseFiltersDto {
  name?: string;
  country?: string;
  city?: string;
  isActive?: boolean;
  foundedYearFrom?: number;
  foundedYearTo?: number;
}