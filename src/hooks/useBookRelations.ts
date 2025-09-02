import { useState, useEffect } from 'react';
import { useApiRequest } from './useApiRequest';
import { genresApi } from '@/services/api/entities/genres';
import { publishingHousesApi } from '@/services/api/entities/publishing-houses';
import { authorsApi } from '@/services/api/entities/authors';

export interface BookRelationOption {
  value: string;
  label: string;
}

export interface BookRelations {
  genres: BookRelationOption[];
  publishers: BookRelationOption[];
  authors: BookRelationOption[];
  loading: boolean;
  error: string | null;
}

export function useBookRelations(): BookRelations {
  // Load genres with useApiRequest
  const {
    data: genresData,
    loading: genresLoading,
    error: genresError
  } = useApiRequest({
    apiFunction: () => genresApi.list({ page: 1, limit: 1000, sortBy: 'name', sortOrder: 'ASC' }),
    executeOnMount: true
  });

  // Load publishers with useApiRequest
  const {
    data: publishersData,
    loading: publishersLoading,
    error: publishersError
  } = useApiRequest({
    apiFunction: () => publishingHousesApi.list({ page: 1, limit: 1000, sortBy: 'name', sortOrder: 'ASC' }),
    executeOnMount: true
  });

  // Load authors with useApiRequest
  const {
    data: authorsData,
    loading: authorsLoading,
    error: authorsError
  } = useApiRequest({
    apiFunction: () => authorsApi.list({ page: 1, limit: 1000, sortBy: 'name', sortOrder: 'ASC' }),
    executeOnMount: true
  });

  // Transform data to options format
  const genres: BookRelationOption[] = genresData?.data?.map((genre: any) => ({
    value: genre.id,
    label: genre.name
  })) || [];

  const publishers: BookRelationOption[] = publishersData?.data?.map((publisher: any) => ({
    value: publisher.id,
    label: publisher.name
  })) || [];

  const authors: BookRelationOption[] = authorsData?.data?.map((author: any) => ({
    value: author.id,
    label: author.name || `${author.firstName || ''} ${author.lastName || ''}`.trim()
  })) || [];

  // Overall loading and error states
  const loading = genresLoading || publishersLoading || authorsLoading;
  const error = genresError || publishersError || authorsError;

  return {
    genres,
    publishers,
    authors,
    loading,
    error: error?.message || null
  };
}