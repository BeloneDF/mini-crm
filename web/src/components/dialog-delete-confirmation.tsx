import { useMutation, useQueryClient } from '@tanstack/react-query'
import * as React from 'react'

import { Button } from '@/components/ui/button'
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

  const { mutateAsync, isPending } = useMutation<unknown, unknown, string>({
    mutationFn: mutate,
    onSuccess: () => {
      invalidateQueries.forEach(queryKey => {
        queryClient.invalidateQueries({ queryKey: [queryKey] })
      })
      setOpen(false)
    },
  })

  async function handleDelete() {
    await mutateAsync(idTodelete)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

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
          >
            {isPending ? 'Excluindo...' : 'Confirmar exclusão'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
