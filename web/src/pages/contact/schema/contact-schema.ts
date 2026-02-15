import { z } from 'zod'

export const contactSchema = z.object({
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres.'),
  email: z.email('E-mail inválido.'),
  phone: z.string().min(1, 'Telefone é obrigatório.'),
})

export type ContactFormData = z.infer<typeof contactSchema>
