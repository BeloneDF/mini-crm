import { DataTable } from '@/components/data-table/data-table'
import { getApiErrorMessage } from '@/lib/get-api-error-message'
import { useQuery } from '@tanstack/react-query'
import type {
  OnChangeFn,
  PaginationState,
  SortingState,
} from '@tanstack/react-table'
import { useSearchParams } from 'react-router-dom'
import { ContactColumns } from './contact-columns'
import {
  fetchContacts,
  type ContactsResponse,
} from '@/api/contact/fetch-contacts'

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

export function ContactTable() {
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
  } = useQuery<ContactsResponse>({
    queryKey: ['contacts', pagination, sorting, globalFilter],
    queryFn: () =>
      fetchContacts(
        pagination.pageIndex,
        pagination.pageSize,
        sorting,
        globalFilter
      ),
    placeholderData: previousData => previousData,
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

  return (
    <main className="w-full">
      <DataTable
        columns={ContactColumns}
        data={data?.data ?? []}
        pageCount={data?.pageCount ?? -1}
        pagination={pagination}
        onPaginationChange={handlePaginationChange}
        sorting={sorting}
        onSortingChange={handleSortingChange}
        globalFilter={globalFilter}
        onGlobalFilterChange={handleGlobalFilterChange}
        isLoading={isLoading && !data}
        isRefreshing={isFetching && !!data}
        errorMessage={
          isError
            ? getApiErrorMessage(error, 'Não foi possível carregar os contatos.')
            : undefined
        }
        onRetry={() => refetch()}
        searchPlaceholder="Buscar contatos por nome ou email..."
        manualPagination
        manualSorting
        manualFiltering
      />
    </main>
  )
}
