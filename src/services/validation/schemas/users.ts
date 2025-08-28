import { z } from 'zod';

export const createUserSchema = z.object({
  firstName: z
    .string()
    .min(1, 'El nombre es requerido')
    .max(50, 'El nombre no puede exceder 50 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El nombre solo puede contener letras y espacios'),
  lastName: z
    .string()
    .min(1, 'Los apellidos son requeridos')
    .max(50, 'Los apellidos no pueden exceder 50 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'Los apellidos solo pueden contener letras y espacios'),
  email: z
    .string()
    .min(1, 'El email es requerido')
    .email('El formato del email no es válido')
    .max(100, 'El email no puede exceder 100 caracteres'),
  password: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .max(100, 'La contraseña no puede exceder 100 caracteres')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'La contraseña debe contener al menos una minúscula, una mayúscula y un número'),
  phone: z
    .string()
    .optional()
    .refine((val) => !val || /^\+?[\d\s-()]+$/.test(val), 'El formato del teléfono no es válido'),
  birthDate: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), 'La fecha de nacimiento no es válida')
    .refine((val) => !val || new Date(val) <= new Date(), 'La fecha de nacimiento no puede ser futura'),
  address: z
    .string()
    .optional()
    .refine((val) => !val || val.length <= 255, 'La dirección no puede exceder 255 caracteres'),
  roleId: z
    .string()
    .optional()
    .refine((val) => !val || z.string().uuid().safeParse(val).success, 'El ID del rol debe ser un UUID válido'),
  isActive: z
    .boolean()
    .optional()
    .default(true),
  metadata: z
    .record(z.any())
    .optional(),
});

export const updateUserSchema = z.object({
  firstName: z
    .string()
    .optional()
    .refine((val) => !val || (val.length >= 1 && val.length <= 50), 'El nombre debe tener entre 1 y 50 caracteres')
    .refine((val) => !val || /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(val), 'El nombre solo puede contener letras y espacios'),
  lastName: z
    .string()
    .optional()
    .refine((val) => !val || (val.length >= 1 && val.length <= 50), 'Los apellidos deben tener entre 1 y 50 caracteres')
    .refine((val) => !val || /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(val), 'Los apellidos solo pueden contener letras y espacios'),
  email: z
    .string()
    .optional()
    .refine((val) => !val || z.string().email().safeParse(val).success, 'El formato del email no es válido')
    .refine((val) => !val || val.length <= 100, 'El email no puede exceder 100 caracteres'),
  password: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 8, 'La contraseña debe tener al menos 8 caracteres')
    .refine((val) => !val || val.length <= 100, 'La contraseña no puede exceder 100 caracteres')
    .refine((val) => !val || /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(val), 'La contraseña debe contener al menos una minúscula, una mayúscula y un número'),
  phone: z
    .string()
    .optional()
    .refine((val) => !val || /^\+?[\d\s-()]+$/.test(val), 'El formato del teléfono no es válido'),
  birthDate: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), 'La fecha de nacimiento no es válida')
    .refine((val) => !val || new Date(val) <= new Date(), 'La fecha de nacimiento no puede ser futura'),
  address: z
    .string()
    .optional()
    .refine((val) => !val || val.length <= 255, 'La dirección no puede exceder 255 caracteres'),
  roleId: z
    .string()
    .optional()
    .refine((val) => !val || z.string().uuid().safeParse(val).success, 'El ID del rol debe ser un UUID válido'),
  isActive: z
    .boolean()
    .optional(),
  metadata: z
    .record(z.any())
    .optional(),
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
    .default('lastName'),
  sortOrder: z
    .enum(['ASC', 'DESC'])
    .optional()
    .default('ASC'),
  roleId: z
    .string()
    .uuid('El ID del rol debe ser un UUID válido')
    .optional(),
  isActive: z
    .boolean()
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

export type CreateUserFormData = z.infer<typeof createUserSchema>;
export type UpdateUserFormData = z.infer<typeof updateUserSchema>;
export type UserSearchFormData = z.infer<typeof userSearchSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;