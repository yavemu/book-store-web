import { apiClient } from './client';
import { HealthCheckResponse } from '@/types/api';

export const healthService = {
  checkHealth: async (): Promise<HealthCheckResponse> => {
    return apiClient.get<HealthCheckResponse>('/health');
  },
};