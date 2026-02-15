import { z } from 'zod'

export const leadStatusValues = [
  'novo',
  'contactado',
  'qualificado',
  'convertido',
  'perdido',
] as const

export type LeadStatus = (typeof leadStatusValues)[number]

export const leadSchema = z.object({
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres.'),
  company: z.string().min(2, 'Empresa deve ter no mínimo 2 caracteres.'),
  status: z.enum(leadStatusValues, {
    message: 'Selecione um status válido.',
  }),
  contactId: z.string().min(1, 'Selecione um contato.'),
})

export type LeadFormData = z.infer<typeof leadSchema>
