import { DataTable } from '@/components/data-table/data-table'
import { getApiErrorMessage } from '@/lib/get-api-error-message'
import { useQuery } from '@tanstack/react-query'
import type {
  OnChangeFn,
  PaginationState,
  SortingState,
  ColumnFiltersState,
} from '@tanstack/react-table'
import { useSearchParams } from 'react-router-dom'
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

const DEFAULT_PAGE_INDEX = 0
const DEFAULT_PAGE_SIZE = 10

function parseNonNegativeInt(value: string | null, fallback: number) {
  const parsed = Number(value)

  if (!Number.isFinite(parsed) || parsed < 0) {
    return fallback
  }

  return Math.floor(parsed)
}

function parsePositiveInt(value: string | null, fallback: number) {
  const parsed = Number(value)

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback
  }

  return Math.floor(parsed)
}

function resolveUpdater<T>(updaterOrValue: T | ((old: T) => T), oldValue: T): T {
  if (typeof updaterOrValue === 'function') {
    return (updaterOrValue as (old: T) => T)(oldValue)
  }

  return updaterOrValue
}

export function LeadTable() {
  const [searchParams, setSearchParams] = useSearchParams()

  const pagination: PaginationState = {
    pageIndex: parseNonNegativeInt(
      searchParams.get('page'),
      DEFAULT_PAGE_INDEX
    ),
    pageSize: parsePositiveInt(searchParams.get('pageSize'), DEFAULT_PAGE_SIZE),
  }

  const sortBy = searchParams.get('sortBy')
  const sortOrder = searchParams.get('sortOrder')
  const sorting: SortingState =
    sortBy && (sortOrder === 'asc' || sortOrder === 'desc')
      ? [{ id: sortBy, desc: sortOrder === 'desc' }]
      : []

  const globalFilter = searchParams.get('search') ?? ''

  const statusParam = searchParams.get('status')
  const statusFilter: LeadStatus | null =
    statusParam && ALL_STATUSES.includes(statusParam as LeadStatus)
      ? (statusParam as LeadStatus)
      : null

  const columnFilters: ColumnFiltersState = statusFilter
    ? [{ id: 'status', value: statusFilter }]
    : []

  const updateUrlParams = (updater: (params: URLSearchParams) => void) => {
    setSearchParams(
      previous => {
        const nextParams = new URLSearchParams(previous)
        updater(nextParams)
        return nextParams
      },
      { replace: true }
    )
  }

  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery<LeadsResopnse>({
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

  const handlePaginationChange: OnChangeFn<PaginationState> = updater => {
    const nextPagination = resolveUpdater(updater, pagination)

    updateUrlParams(params => {
      if (nextPagination.pageIndex === DEFAULT_PAGE_INDEX) {
        params.delete('page')
      } else {
        params.set('page', String(nextPagination.pageIndex))
      }

      if (nextPagination.pageSize === DEFAULT_PAGE_SIZE) {
        params.delete('pageSize')
      } else {
        params.set('pageSize', String(nextPagination.pageSize))
      }
    })
  }

  const handleSortingChange: OnChangeFn<SortingState> = updater => {
    const nextSorting = resolveUpdater(updater, sorting)
    const firstSort = nextSorting[0]

    updateUrlParams(params => {
      if (!firstSort) {
        params.delete('sortBy')
        params.delete('sortOrder')
      } else {
        params.set('sortBy', String(firstSort.id))
        params.set('sortOrder', firstSort.desc ? 'desc' : 'asc')
      }

      params.delete('page')
    })
  }

  const handleColumnFiltersChange: OnChangeFn<ColumnFiltersState> = updater => {
    const nextFilters = resolveUpdater(updater, columnFilters)
    const nextStatusValue = nextFilters.find(f => f.id === 'status')?.value
    const nextStatus =
      typeof nextStatusValue === 'string' &&
      ALL_STATUSES.includes(nextStatusValue as LeadStatus)
        ? (nextStatusValue as LeadStatus)
        : null

    updateUrlParams(params => {
      if (nextStatus) {
        params.set('status', nextStatus)
      } else {
        params.delete('status')
      }

      params.delete('page')
    })
  }

  const handleGlobalFilterChange = (value: string) => {
    updateUrlParams(params => {
      if (value) {
        params.set('search', value)
      } else {
        params.delete('search')
      }

      params.delete('page')
    })
  }

  const handleStatusChange = (value: string) => {
    updateUrlParams(params => {
      if (!value || value === 'all') {
        params.delete('status')
      } else {
        params.set('status', value)
      }

      params.delete('page')
    })
  }

  return (
    <main className="w-full space-y-4">
      <div className="flex gap-4">
        <Select onValueChange={handleStatusChange} value={statusFilter ?? 'all'}>
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
        onPaginationChange={handlePaginationChange}
        sorting={sorting}
        onSortingChange={handleSortingChange}
        globalFilter={globalFilter}
        onGlobalFilterChange={handleGlobalFilterChange}
        columnFilters={columnFilters}
        onColumnFiltersChange={handleColumnFiltersChange}
        isLoading={isLoading && !data}
        isRefreshing={isFetching && !!data}
        errorMessage={
          isError
            ? getApiErrorMessage(error, 'Não foi possível carregar os leads.')
            : undefined
        }
        onRetry={() => refetch()}
        searchPlaceholder="Buscar leads por nome ou empresa..."
        manualPagination
        manualSorting
        manualFiltering
      />
    </main>
  )
}
