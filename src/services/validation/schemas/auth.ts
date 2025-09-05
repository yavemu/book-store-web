import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'El email es requerido')
    .email('El formato del email no es válido'),
  password: z
    .string()
    .min(1, 'La contraseña es requerida')
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export const registerSchema = z.object({
  username: z
    .string()
    .min(3, 'El nombre de usuario debe tener al menos 3 caracteres')
    .max(50, 'El nombre de usuario no puede exceder 50 caracteres')
    .regex(/^[a-zA-Z0-9_-]+$/, 'El nombre de usuario solo puede contener letras, números, guiones y guiones bajos'),
  email: z
    .string()
    .min(1, 'El email es requerido')
    .email('El formato del email no es válido'),
  password: z
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export const updateProfileSchema = z.object({
  username: z
    .string()
    .min(3, 'El nombre de usuario debe tener al menos 3 caracteres')
    .max(50, 'El nombre de usuario no puede exceder 50 caracteres')
    .regex(/^[a-zA-Z0-9_-]+$/, 'El nombre de usuario solo puede contener letras, números, guiones y guiones bajos')
    .optional(),
  email: z
    .string()
    .email('El formato del email no es válido')
    .optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(1, 'La contraseña actual es requerida'),
  newPassword: z
    .string()
    .min(6, 'La nueva contraseña debe tener al menos 6 caracteres'),
}).refine(data => data.currentPassword !== data.newPassword, {
  message: "La nueva contraseña debe ser diferente a la actual",
  path: ["newPassword"],
});

export const passwordResetRequestSchema = z.object({
  email: z
    .string()
    .min(1, 'El email es requerido')
    .email('El formato del email no es válido'),
});

export const passwordResetConfirmSchema = z.object({
  token: z
    .string()
    .min(1, 'El token es requerido'),
  newPassword: z
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

// Response schemas
export const loginResponseSchema = z.object({
  access_token: z.string(),
  user: z.object({
    id: z.string(),
    username: z.string(),
    email: z.string().email(),
    role: z.object({
      id: z.string(),
      name: z.string(),
      description: z.string().optional(),
    }),
    isActive: z.boolean(),
    createdAt: z.string(),
    updatedAt: z.string(),
  }),
});

export const userProfileResponseSchema = z.object({
  id: z.string(),
  username: z.string(),
  email: z.string().email(),
  role: z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().optional(),
  }),
  isActive: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const registerResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: userProfileResponseSchema,
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
export type PasswordResetRequestFormData = z.infer<typeof passwordResetRequestSchema>;
export type PasswordResetConfirmFormData = z.infer<typeof passwordResetConfirmSchema>;