import { DataTable } from '@/components/data-table/data-table'
import { useQuery } from '@tanstack/react-query'
import type {
  PaginationState,
  SortingState,
  ColumnFiltersState,
} from '@tanstack/react-table'
import { useState } from 'react'
import { LeadColumns } from './lead-columns'
import { fetchLeads, type LeadsResopnse } from '@/api/leads/fetch-leads'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  ALL_STATUSES,
  LEAD_STATUS_CONFIG,
  type LeadStatus,
} from '@/utils/types'

export function LeadTable() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const statusFilter: LeadStatus | null = (() => {
    const value = columnFilters.find(f => f.id === 'status')?.value

    return typeof value === 'string' ? (value as LeadStatus) : null
  })()

  const { data, isLoading, isFetching } = useQuery<LeadsResopnse>({
    queryKey: ['leads', pagination, sorting, globalFilter, columnFilters],
    queryFn: () =>
      fetchLeads(
        pagination.pageIndex,
        pagination.pageSize,
        sorting,
        globalFilter,
        statusFilter
      ),
    placeholderData: previousData => previousData,
    staleTime: 0,
  })

  const handleGlobalFilterChange = (value: string) => {
    setGlobalFilter(value)
    setPagination(prev => ({ ...prev, pageIndex: 0 }))
  }

  const handleStatusChange = (value: string) => {
    setColumnFilters(prev => {
      const otherFilters = prev.filter(f => f.id !== 'status')

      if (!value) return otherFilters

      return [...otherFilters, { id: 'status', value }]
    })

    setPagination(prev => ({ ...prev, pageIndex: 0 }))
  }

  return (
    <main className="w-full space-y-4">
      <div className="flex gap-4">
        <Select onValueChange={handleStatusChange}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem key="all" value="all">
              Todos os status
            </SelectItem>
            {ALL_STATUSES.map(status => (
              <SelectItem key={status} value={status}>
                {LEAD_STATUS_CONFIG[status].label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <DataTable
        columns={LeadColumns}
        data={data?.data ?? []}
        pageCount={data?.pageCount ?? -1}
        pagination={pagination}
        onPaginationChange={setPagination}
        sorting={sorting}
        onSortingChange={setSorting}
        globalFilter={globalFilter}
        onGlobalFilterChange={handleGlobalFilterChange}
        columnFilters={columnFilters}
        onColumnFiltersChange={setColumnFilters}
        isLoading={isLoading || isFetching}
        searchPlaceholder="Buscar leads por nome ou empresa..."
        manualPagination
        manualSorting
        manualFiltering
      />
    </main>
  )
}
