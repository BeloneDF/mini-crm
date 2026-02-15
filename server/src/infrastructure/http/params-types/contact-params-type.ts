import { z } from 'zod'

export const listContactsQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .default('0')
    .transform(val => Number(val))
    .refine(val => !Number.isNaN(val) && val >= 0, {
      message: 'page deve ser um numero valido',
    }),

  pageSize: z
    .string()
    .optional()
    .default('10')
    .transform(val => Number(val))
    .refine(val => !Number.isNaN(val) && val > 0, {
      message: 'pageSize deve ser um numero valido',
    }),

  search: z.string().optional().default(''),

  sortBy: z.enum(['createdAt', 'name', 'email', 'phone']).optional(),

  sortOrder: z.enum(['asc', 'desc']).optional(),
})

export const updateContactSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  email: z.string().email({ message: 'Email is required' }),
  phone: z.string().min(1, { message: 'Phone is required' }),
})
