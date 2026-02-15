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

import type { Lead } from '@/utils/types'
import type { ColumnDef } from '@tanstack/react-table'
import dayjs from 'dayjs'
import { Building, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { lazy, Suspense, useState } from 'react'

import { StatusBadge } from './status-badge'
import { deleteLead } from '@/api/leads/delete-lead'

const LeadDialogForm = lazy(() => import('./lead-dialog-form'))
const DialogDeleteConfirmation = lazy(
  () => import('@/components/dialog-delete-confirmation')
)

export const LeadColumns: ColumnDef<Lead>[] = [
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
    accessorKey: 'company',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Empresa" enableFilter />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <Building className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{row.getValue('company')}</span>
        </div>
      )
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Status"
        enableFilter={true}
      />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <StatusBadge status={row.getValue('status')} />
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
    cell: ({ row }) => {
      const contact = row.original
      const [createOpen, setCreateOpen] = useState(false)
      const [deleteOpen, setDeleteOpen] = useState(false)

      return (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <span className="sr-only">Abrir menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Ações</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setCreateOpen(true)}>
                <Pencil className="mr-2 h-4 w-4" />
                Editar lead
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer text-white bg-red-600 hover:bg-red-500 focus:bg-red-500 data-[state=open]:bg-red-500"
                onClick={() => setDeleteOpen(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Deletar Lead
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Suspense fallback={null}>
            <DialogDeleteConfirmation
              id={contact.id}
              open={deleteOpen}
              setOpen={setDeleteOpen}
              title="Excluir lead"
              description="Tem certeza que deseja excluir este lead? Esta ação não pode ser desfeita."
              mutate={deleteLead}
              invalidateQueries={['leads']}
            />
          </Suspense>
          <Suspense fallback={null}>
            <LeadDialogForm
              open={createOpen}
              onOpenChange={setCreateOpen}
              leadId={contact.id}
            />
          </Suspense>
        </div>
      )
    },
  },
]
