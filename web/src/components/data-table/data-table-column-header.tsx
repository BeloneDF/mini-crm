import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { type Column } from '@tanstack/react-table'
import { ArrowDown, ArrowUp, ChevronsUpDown, EyeOff } from 'lucide-react'

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>
  title: string
  enableFilter?: boolean
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
  enableFilter = false,
}: DataTableColumnHeaderProps<TData, TValue>) {
  const isSorted = column.getIsSorted()

  if (!column.getCanSort() && !enableFilter) {
    return <div className={cn('font-medium', className)}>{title}</div>
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 data-[state=open]:bg-accent -ml-3 hover:bg-accent/50"
          >
            <span className="font-medium">{title}</span>
            {isSorted === 'desc' ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : isSorted === 'asc' ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : (
              <ChevronsUpDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-40">
          {column.getCanSort() && (
            <>
              <DropdownMenuItem
                onClick={() => column.toggleSorting(false)}
                className="gap-2"
              >
                <ArrowUp className="h-3.5 w-3.5 text-muted-foreground" />
                Crescente
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => column.toggleSorting(true)}
                className="gap-2"
              >
                <ArrowDown className="h-3.5 w-3.5 text-muted-foreground" />
                Decrescente
              </DropdownMenuItem>
            </>
          )}
          {column.getCanSort() && column.getCanHide() && (
            <DropdownMenuSeparator />
          )}
          {column.getCanHide() && (
            <DropdownMenuItem
              onClick={() => column.toggleVisibility(false)}
              className="gap-2"
            >
              <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />
              Ocultar
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
