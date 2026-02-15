import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { leadSchema, type LeadFormData } from '../schema/lead-schema'

import { createLead } from '@/api/leads/create-lead'
import { fetchAllContacts } from '@/api/contact/fetch-all-contacts'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
} from '@/components/ui/command'
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { getApiErrorMessage } from '@/lib/get-api-error-message'
import { queryClient } from '@/lib/react-query'
import { cn } from '@/lib/utils'
import type { Lead, LeadStatus } from '@/utils/types'
import { useMutation, useQuery } from '@tanstack/react-query'
import { CommandGroup } from 'cmdk'
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { LeadFormSkeleton } from './lead-form-skeleton'
import { findLeadById } from '@/api/leads/find-lead-by-id'
import { updateLead } from '@/api/leads/update-lead'

const LEAD_STATUS_OPTIONS: LeadStatus[] = [
  'novo',
  'contactado',
  'convertido',
  'perdido',
  'qualificado',
]

interface LeadDialogFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  leadId?: string
}

export default function LeadDialogForm({
  open,
  onOpenChange,
  leadId,
}: LeadDialogFormProps) {
  const [formError, setFormError] = useState<string | null>(null)

  const [openContactSelect, setOpenContactSelect] = useState(false)

  const {
    data: allContacts,
    isLoading: isAllContactsLoading,
    isError: isAllContactsError,
    error: allContactsError,
    refetch: refetchAllContacts,
  } = useQuery({
    queryKey: ['all-contacts'],
    queryFn: () => fetchAllContacts(),
    enabled: !!open,
  })

  const toastSuccessMessage = leadId
    ? 'Lead atualizado com sucesso!'
    : 'Lead criado com sucesso!'

  const createLeadMutation = useMutation({
    mutationFn: createLead,
    onSuccess: () => {
      toast.success(toastSuccessMessage)
      queryClient.invalidateQueries({ queryKey: ['leads'] })
      onOpenChange(false)
    },
    onError: err => {
      setFormError(getApiErrorMessage(err, 'Erro ao salvar lead.'))
    },
  })

  const updateLeadMutation = useMutation({
    mutationFn: async (data: LeadFormData) => {
      if (!leadId) {
        throw new Error('Lead não encontrado')
      }

      return updateLead(leadId, data)
    },
    onSuccess: () => {
      toast.success(toastSuccessMessage)
      queryClient.invalidateQueries({ queryKey: ['leads'] })
      onOpenChange(false)
    },
    onError: err => {
      setFormError(getApiErrorMessage(err, 'Erro ao salvar lead.'))
    },
  })

  const {
    data: leadData,
    isLoading: isLeadLoading,
    isError: isLeadError,
    error: leadError,
    refetch: refetchLead,
  } = useQuery<Lead>({
    queryKey: ['lead', leadId],
    queryFn: () => findLeadById({ id: leadId! }),
    enabled: !!leadId && open,
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
    watch,
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      name: leadData?.name || '',
      company: leadData?.company || '',
      status: leadData?.status || 'novo',
      contactId: leadData?.contactId || '',
    },
  })

  const selectedValue = watch('contactId')
  const selectedContact = allContacts?.find(c => c.id === selectedValue)

  useEffect(() => {
    if (leadData) {
      reset({
        name: leadData.name,
        company: leadData.company,
        status: leadData.status,
        contactId: leadData.contactId,
      })
    } else {
      reset({
        name: '',
        company: '',
        status: 'novo',
        contactId: '',
      })
    }
    setFormError(null)
  }, [leadData, open, reset])

  const onSubmit = async (data: LeadFormData) => {
    setFormError(null)

    try {
      if (leadId) {
        await updateLeadMutation.mutateAsync(data)
      } else {
        await createLeadMutation.mutateAsync(data)
      }
    } catch {
      // Error state is set by mutation onError handlers.
    }
  }

  const isSubmitting = createLeadMutation.isPending || updateLeadMutation.isPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-md">
        <DialogHeader>
          <DialogTitle>{leadId ? 'Editar Lead' : 'Novo Lead'}</DialogTitle>
          <DialogDescription>
            {leadId
              ? 'Atualize as informacoes do Lead.'
              : 'Preencha os dados para criar um novo Lead.'}
          </DialogDescription>
        </DialogHeader>

        {isLeadLoading && <LeadFormSkeleton />}
        {isLeadError && (
          <div className="space-y-3 rounded-md border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
            <p>
              {getApiErrorMessage(
                leadError,
                'Não foi possível carregar os dados do lead.'
              )}
            </p>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => refetchLead()}
            >
              Tentar novamente
            </Button>
          </div>
        )}
        {!isLeadLoading && !isLeadError && (
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
                disabled={isSubmitting}
              />
              {errors.name && (
                <p className="text-xs text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="lead-company">Empresa</Label>
              <Input
                id="lead-company"
                placeholder="Ex: Empresa X"
                {...register('company')}
                aria-invalid={!!errors.company}
                disabled={isSubmitting}
              />
              {errors.company && (
                <p className="text-xs text-destructive">
                  {errors.company.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="lead-status">Status</Label>
              <select
                id="lead-status"
                {...register('status')}
                className="rounded-md border border-input bg-transparent px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isSubmitting}
              >
                {LEAD_STATUS_OPTIONS.map(status => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
              {errors.status && (
                <p className="text-xs text-destructive">
                  {errors.status.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label>Contato Associado</Label>

              <Popover
                open={openContactSelect}
                onOpenChange={setOpenContactSelect}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openContactSelect}
                    className="justify-between"
                    disabled={isSubmitting}
                  >
                    {selectedContact
                      ? `${selectedContact.name} (${selectedContact.email})`
                      : 'Selecione um contato'}

                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="w-full p-0" align="start">
                  {isAllContactsError ? (
                    <div className="space-y-2 p-3 text-sm">
                      <p className="text-destructive">
                        {getApiErrorMessage(
                          allContactsError,
                          'Não foi possível carregar os contatos.'
                        )}
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() => refetchAllContacts()}
                      >
                        Tentar novamente
                      </Button>
                    </div>
                  ) : (
                    <Command>
                      <CommandInput placeholder="Buscar por nome ou email..." />

                      <CommandEmpty>
                        {isAllContactsLoading
                          ? 'Carregando contatos...'
                          : 'Nenhum contato encontrado.'}
                      </CommandEmpty>

                      <CommandGroup className="max-h-64 overflow-y-auto">
                        <CommandItem
                          value="none"
                          onSelect={() => {
                            setValue('contactId', '', { shouldValidate: true })
                            setOpenContactSelect(false)
                          }}
                        >
                          Nenhum contato associado
                        </CommandItem>

                        {allContacts?.map(contact => (
                          <CommandItem
                            key={contact.id}
                            value={`${contact.name} ${contact.email}`}
                            onSelect={() => {
                              setValue('contactId', contact.id, {
                                shouldValidate: true,
                              })
                              setOpenContactSelect(false)
                            }}
                          >
                            <div className="flex flex-col">
                              <span>{contact.name}</span>
                              <span className="text-xs text-muted-foreground">
                                {contact.email}
                              </span>
                            </div>

                            <Check
                              className={cn(
                                'ml-auto h-4 w-4',
                                selectedContact?.id === contact.id
                                  ? 'opacity-100'
                                  : 'opacity-0'
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  )}
                </PopoverContent>
              </Popover>

              {errors.contactId && (
                <p className="text-xs text-destructive">
                  {errors.contactId.message as string}
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
                disabled={isSubmitting}
              >
                Cancelar
              </Button>

              <Button type="submit" disabled={isSubmitting} aria-busy={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {leadId ? 'Salvar' : 'Criar Lead'}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
