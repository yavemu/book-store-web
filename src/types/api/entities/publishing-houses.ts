import { BaseEntity, PaginationMeta } from '../../domain';

export interface PublishingHouse extends BaseEntity {
  name: string;
  country?: string;
  websiteUrl?: string;
}

export interface CreatePublishingHouseDto {
  name: string;
  country?: string;
  websiteUrl?: string;
}

export type UpdatePublishingHouseDto = Partial<CreatePublishingHouseDto>;

export interface PublishingHouseResponseDto {
  id: string;
  name: string;
  country?: string;
  websiteUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PublishingHouseListResponseDto {
  data: PublishingHouseResponseDto[];
  meta: PaginationMeta;
}

export interface CreatePublishingHouseResponseDto {
  message: string;
  publisher: PublishingHouseResponseDto;
}

export interface UpdatePublishingHouseResponseDto {
  message: string;
  publisher: PublishingHouseResponseDto;
}

export interface DeletePublishingHouseResponseDto {
  message: string;
  deletedPublisherId: string;
}

export interface PublishingHouseListParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
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
