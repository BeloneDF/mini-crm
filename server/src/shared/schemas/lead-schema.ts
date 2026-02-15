import { z } from 'zod'

export const leadStatusValues = [
  'novo',
  'contactado',
  'qualificado',
  'convertido',
  'perdido',
] as const

export type LeadStatus = (typeof leadStatusValues)[number]

export const createLeadSchema = z.object({
  name: z.string().min(2, 'Nome deve ter no minimo 2 caracteres'),
  company: z.string().min(2, 'Empresa deve ter no minimo 2 caracteres'),
  status: z.enum(leadStatusValues, {
    message:
      'Status deve ser um dos seguintes: novo, contactado, qualificado, convertido, perdido',
  }),
  contactId: z.string().min(1, ' O contato é obrigatório'),
})
