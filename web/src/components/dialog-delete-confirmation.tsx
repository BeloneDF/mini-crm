import { useMutation, useQueryClient } from '@tanstack/react-query'
import * as React from 'react'
import { Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { getApiErrorMessage } from '@/lib/get-api-error-message'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface DialogDeleteConfirmationProps {
  id: string
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  mutate: (id: string) => Promise<unknown>
  invalidateQueries: string[]
  title: string
  description: string
}

export default function DialogDeleteConfirmation({
  id: idTodelete,
  open,
  setOpen,
  mutate,
  invalidateQueries,
  title,
  description,
}: DialogDeleteConfirmationProps) {
  const queryClient = useQueryClient()
  const [mutationError, setMutationError] = React.useState<string | null>(null)

  const { mutateAsync, isPending } = useMutation<unknown, unknown, string>({
    mutationFn: mutate,
    onSuccess: () => {
      setMutationError(null)
      invalidateQueries.forEach(queryKey => {
        queryClient.invalidateQueries({ queryKey: [queryKey] })
      })
      setOpen(false)
    },
    onError: error => {
      setMutationError(
        getApiErrorMessage(error, 'Não foi possível excluir o registro.')
      )
    },
  })

  React.useEffect(() => {
    if (open) {
      setMutationError(null)
    }
  }, [open])

  async function handleDelete() {
    try {
      await mutateAsync(idTodelete)
    } catch {
      // Error state is handled by mutation onError.
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {mutationError && (
          <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {mutationError}
          </p>
        )}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isPending}
          >
            Cancelar
          </Button>

          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
            aria-busy={isPending}
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isPending ? 'Excluindo...' : 'Confirmar exclusão'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
