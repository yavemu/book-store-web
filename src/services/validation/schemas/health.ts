import { z } from 'zod';

// Esquema para respuesta del health check
export const healthResponseSchema = z.object({
  status: z.string(),
  timestamp: z.string(),
  uptime: z.number()
});

// Esquema vacío para peticiones GET que no requieren body
export const healthRequestSchema = z.object({});

export type HealthRequestData = z.infer<typeof healthRequestSchema>;
export type HealthResponseData = z.infer<typeof healthResponseSchema>;