export interface ApiError {
  message: string;
  error: string;
  statusCode: number;
}

export interface HealthCheckResponse {
  status: string;
  timestamp: string;
  uptime: number;
}