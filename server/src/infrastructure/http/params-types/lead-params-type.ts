import { leadStatusValues } from '@/infrastructure/http/schemas/lead-schema'
import { z } from 'zod'

const leadStatusAndAllState = ['all', ...leadStatusValues] as const

export type LeadStatusAndAllState = (typeof leadStatusAndAllState)[number]

export const listLeadsQuerySchema = z.object({
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

  sortBy: z.enum(['name', 'company', 'status', 'createdAt']).optional(),

  sortOrder: z.enum(['asc', 'desc']).optional(),

  status: z
    .enum(leadStatusAndAllState, {
      message:
        'Status deve ser um dos seguintes: novo, contactado, qualificado, convertido, perdido',
    })
    .optional(),
})
