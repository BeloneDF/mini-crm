import { z } from 'zod'

export const contactSchema = z.object({
  name: z.string().min(2, 'Nome deve ter no minimo 2 caracteres'),
  email: z.email('Email invalido'),
  phone: z
    .string()
    .min(1, 'Telefone e obrigatorio')
    .max(15, 'Telefone deve ter no maximo 15 caracteres'),
})
