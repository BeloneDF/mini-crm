import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { contactSchema, type ContactFormData } from '../schema/contact-schema'

import { createContact } from '@/api/contact/create-contact'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { queryClient } from '@/lib/react-query'
import type { Contact } from '@/utils/types'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { updateContact } from '@/api/contact/update-contact'
import { findContactById } from '@/api/contact/find-contact-by-id'
import { ContactFormSkeleton } from './contact-form-skeleton'

interface ContactFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  contactId?: string
}

export default function ContactFormDialog({
  open,
  onOpenChange,
  contactId,
}: ContactFormDialogProps) {
  const [formError, setFormError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const toastSuccessMessage = contactId
    ? 'Contato atualizado com sucesso!'
    : 'Contato criado com sucesso!'

  const { mutateAsync: createContactMutation } = useMutation({
    mutationFn: createContact,
    onSuccess: () => {
      toast.success(toastSuccessMessage)
      queryClient.invalidateQueries({ queryKey: ['contacts'] })
      onOpenChange(false)
    },
    onError: err => {
      setFormError(err instanceof Error ? err.message : 'Erro ao salvar')
    },
  })

  const { mutateAsync: updateContactMutation } = useMutation({
    mutationFn: async (data: ContactFormData) => {
      if (!contactId) {
        throw new Error('Contato não encontrado')
      }
      return updateContact(contactId, data)
    },
    onSuccess: () => {
      toast.success(toastSuccessMessage)
      queryClient.invalidateQueries({ queryKey: ['contacts'] })
      onOpenChange(false)
    },
    onError: err => {
      setFormError(err instanceof Error ? err.message : 'Erro ao salvar')
    },
  })

  const { data: contactData, isLoading: isContactLoading } = useQuery<Contact>({
    queryKey: ['contact', contactId],
    queryFn: () => findContactById({ id: contactId! }),
    enabled: !!contactId && open,
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: contactData?.name || '',
      email: contactData?.email || '',
      phone: contactData?.phone || '',
    },
  })

  useEffect(() => {
    if (contactData) {
      reset({
        name: contactData.name,
        email: contactData.email,
        phone: contactData.phone,
      })
    } else {
      reset({
        name: '',
        email: '',
        phone: '',
      })
    }
    setFormError(null)
  }, [contactData, open, reset])

  const onSubmit = async (data: ContactFormData) => {
    setLoading(true)
    setFormError(null)

    try {
      if (contactId) {
        await updateContactMutation(data)
      } else {
        await createContactMutation(data)
      }

      onOpenChange(false)
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Erro ao salvar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-md">
        <DialogHeader>
          <DialogTitle>
            {contactId ? 'Editar Contato' : 'Novo Contato'}
          </DialogTitle>
          <DialogDescription>
            {contactId
              ? 'Atualize as informacoes do contato.'
              : 'Preencha os dados para criar um novo contato.'}
          </DialogDescription>
        </DialogHeader>

        {isContactLoading && <ContactFormSkeleton />}
        {!isContactLoading && (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col gap-2">
              <Label htmlFor="contact-name">Nome</Label>
              <Input
                id="contact-name"
                placeholder="Ex: Ana Silva"
                {...register('name')}
                aria-invalid={!!errors.name}
              />
              {errors.name && (
                <p className="text-xs text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="contact-email">Email</Label>
              <Input
                id="contact-email"
                type="email"
                placeholder="Ex: ana@email.com"
                {...register('email')}
                aria-invalid={!!errors.email}
              />
              {errors.email && (
                <p className="text-xs text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="contact-phone">Telefone</Label>
              <Input
                id="contact-phone"
                placeholder="Ex: (11) 98765-4321"
                {...register('phone')}
                aria-invalid={!!errors.phone}
              />
              {errors.phone && (
                <p className="text-xs text-destructive">
                  {errors.phone.message}
                </p>
              )}
            </div>

            {formError && (
              <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {formError}
              </p>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                Cancelar
              </Button>

              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {contactId ? 'Salvar' : 'Criar Contato'}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
