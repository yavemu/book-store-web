import { z } from 'zod';

export const createUserSchema = z.object({
  username: z
    .string()
    .min(3, 'El nombre de usuario debe tener al menos 3 caracteres')
    .max(50, 'El nombre de usuario no puede exceder 50 caracteres')
    .regex(/^[a-zA-Z0-9_-]+$/, 'El nombre de usuario solo puede contener letras, números, guiones y guiones bajos'),
  email: z
    .string()
    .min(1, 'El email es requerido')
    .email('El formato del email no es válido')
    .max(255, 'El email no puede exceder 255 caracteres'),
  password: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .max(255, 'La contraseña no puede exceder 255 caracteres')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'La contraseña debe contener al menos una minúscula, una mayúscula y un número'),
  roleId: z
    .string()
    .uuid('El ID del rol debe ser un UUID válido'),
});

export const updateUserSchema = z.object({
  username: z
    .string()
    .optional()
    .refine((val) => !val || (val.length >= 1 && val.length <= 50), 'El nombre de usuario debe tener entre 1 y 50 caracteres')
    .refine((val) => !val || /^[a-zA-Z0-9_-]+$/.test(val), 'El nombre de usuario solo puede contener letras, números, guiones y guiones bajos'),
  email: z
    .string()
    .optional()
    .refine((val) => !val || z.string().email().safeParse(val).success, 'El formato del email no es válido')
    .refine((val) => !val || val.length <= 100, 'El email no puede exceder 100 caracteres'),
  password: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 8, 'La contraseña debe tener al menos 8 caracteres')
    .refine((val) => !val || val.length <= 255, 'La contraseña no puede exceder 255 caracteres')
    .refine((val) => !val || /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(val), 'La contraseña debe contener al menos una minúscula, una mayúscula y un número'),
  roleId: z
    .string()
    .optional()
    .refine((val) => !val || z.string().uuid().safeParse(val).success, 'El ID del rol debe ser un UUID válido'),
});

export const userSearchSchema = z.object({
  term: z
    .string()
    .min(1, 'El término de búsqueda es requerido')
    .max(100, 'El término de búsqueda no puede exceder 100 caracteres'),
  page: z
    .number()
    .min(1, 'La página debe ser mayor a 0')
    .optional()
    .default(1),
  limit: z
    .number()
    .min(1, 'El límite debe ser mayor a 0')
    .max(100, 'El límite no puede exceder 100')
    .optional()
    .default(10),
  sortBy: z
    .string()
    .optional()
    .default('username'),
  sortOrder: z
    .enum(['ASC', 'DESC'])
    .optional()
    .default('ASC'),
  roleId: z
    .string()
    .uuid('El ID del rol debe ser un UUID válido')
    .optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(1, 'La contraseña actual es requerida'),
  newPassword: z
    .string()
    .min(8, 'La nueva contraseña debe tener al menos 8 caracteres')
    .max(100, 'La nueva contraseña no puede exceder 100 caracteres')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'La nueva contraseña debe contener al menos una minúscula, una mayúscula y un número'),
  confirmPassword: z
    .string()
    .min(1, 'La confirmación de contraseña es requerida'),
})
.refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
})
.refine((data) => data.currentPassword !== data.newPassword, {
  message: 'La nueva contraseña debe ser diferente a la actual',
  path: ['newPassword'],
});

// Schema para filtro rápido de usuarios
export const userFilterSchema = z.object({
  filter: z
    .string()
    .min(3, 'El filtro debe tener al menos 3 caracteres')
    .max(100, 'El filtro no puede exceder 100 caracteres'),
  pagination: z.object({
    page: z.number().min(1).default(1),
    limit: z.number().min(1).max(50).default(10),
    sortBy: z.string().default('createdAt').optional(),
    sortOrder: z.enum(['ASC', 'DESC']).default('DESC').optional(),
  }),
});

// Schema para filtro avanzado de usuarios
export const userAdvancedFilterSchema = z.object({
  name: z.string().optional(),
  email: z.string().email('El formato del email no es válido').optional(),
  role: z.enum(['admin', 'user']).optional(),
  isActive: z.boolean().optional(),
  createdAfter: z.string().datetime('Fecha de inicio inválida').optional(),
  createdBefore: z.string().datetime('Fecha de fin inválida').optional(),
});

// Schema para exportar usuarios a CSV
export const userExportSchema = z.object({
  name: z.string().optional(),
  email: z.string().email('El formato del email no es válido').optional(),
  role: z.enum(['admin', 'user']).optional(),
  isActive: z.boolean().optional(),
  createdDateFrom: z.string().optional(),
  createdDateTo: z.string().optional(),
  updatedDateFrom: z.string().optional(),
  updatedDateTo: z.string().optional(),
});

// Schema para respuesta de usuario
export const userResponseSchema = z.object({
  id: z.string().uuid(),
  username: z.string(),
  email: z.string().email(),
  role: z.object({
    name: z.string(),
  }),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const userAdvancedSearchSchema = z.object({
  page: z.number().min(1).default(1).optional(),
  limit: z.number().min(1).max(100).default(10).optional(),
  username: z.string().optional(),
  email: z.string().optional(),
  role: z.string().optional(),
  isActive: z.boolean().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

export type CreateUserFormData = z.infer<typeof createUserSchema>;
export type UpdateUserFormData = z.infer<typeof updateUserSchema>;
export type UserSearchFormData = z.infer<typeof userSearchSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
export type UserFilterFormData = z.infer<typeof userFilterSchema>;
export type UserAdvancedFilterFormData = z.infer<typeof userAdvancedFilterSchema>;
export type UserExportFormData = z.infer<typeof userExportSchema>;
export type UserAdvancedSearchParams = z.infer<typeof userAdvancedSearchSchema>;
export type UserResponse = z.infer<typeof userResponseSchema>;