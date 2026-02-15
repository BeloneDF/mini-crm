import { deleteContact } from '@/api/contact/delete-contact'
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { Contact } from '@/utils/types'
import type { ColumnDef } from '@tanstack/react-table'
import dayjs from 'dayjs'
import { Copy, Mail, MoreHorizontal, Pencil, Phone, Trash2 } from 'lucide-react'
import { lazy, Suspense, useState } from 'react'

const ContactFormDialog = lazy(() => import('./contact-dialog-form'))
const ContactLeadsDrawer = lazy(() => import('./contact-leads-drawer'))
const DialogDeleteConfirmation = lazy(
  () => import('@/components/dialog-delete-confirmation')
)

export const ContactColumns: ColumnDef<Contact>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nome" enableFilter />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-medium">
            {row.getValue<string>('name').charAt(0).toUpperCase()}
          </div>
          <span className="font-medium">{row.getValue('name')}</span>
        </div>
      )
    },
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" enableFilter />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{row.getValue('email')}</span>
        </div>
      )
    },
  },
  {
    accessorKey: 'phone',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Celular" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{row.getValue('phone')}</span>
        </div>
      )
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Criado Em" />
    ),
    cell: ({ getValue }) => {
      const date = new Date(getValue() as string)
      return (
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="font-normal">
            {dayjs(date).format('DD/MM/YYYY')}
          </Badge>
        </div>
      )
    },
  },
  {
    id: 'actions',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ações" />
    ),
    cell: ({ row }) => {
      const contact = row.original
      const [createOpen, setCreateOpen] = useState(false)
      const [leadsOpen, setLeadsOpen] = useState(false)
      const [deleteOpen, setDeleteOpen] = useState(false)
      return (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-8 w-8 p-0 transition-opacity cursor-pointer"
              >
                <span className="sr-only">Abrir menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Ações</DropdownMenuLabel>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => navigator.clipboard.writeText(contact.email)}
              >
                <Copy className="mr-2 h-4 w-4" />
                Copiar email
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setCreateOpen(true)}
                className="cursor-pointer"
              >
                <Pencil className="mr-2 h-4 w-4" />
                Editar contato
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer text-white bg-red-600 hover:bg-red-500 focus:bg-red-500 data-[state=open]:bg-red-500"
                onClick={() => setDeleteOpen(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Deletar contato
              </DropdownMenuItem>
              <DropdownMenuSeparator />

              <DropdownMenuItem asChild>
                <Suspense fallback={null}>
                  <ContactLeadsDrawer
                    open={leadsOpen}
                    onOpenChange={setLeadsOpen}
                    contactId={contact.id}
                  />
                </Suspense>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Suspense fallback={null}>
            <DialogDeleteConfirmation
              id={contact.id}
              open={deleteOpen}
              setOpen={setDeleteOpen}
              title="Excluir contato"
              description="Tem certeza que deseja excluir este contato? Todos os leads associados a este contato também serão excluídos. Esta ação não pode ser desfeita."
              mutate={deleteContact}
              invalidateQueries={['contacts', 'all-contacts']}
            />
          </Suspense>
          <Suspense fallback={null}>
            <ContactFormDialog
              open={createOpen}
              onOpenChange={setCreateOpen}
              contactId={contact.id}
            />
          </Suspense>
        </div>
      )
    },
  },
]
