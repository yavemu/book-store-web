export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

export interface HealthCheckResponse {
  status: string;
  timestamp: string;
  uptime: number;
  environment?: string;
}