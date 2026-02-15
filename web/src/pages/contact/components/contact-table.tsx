import { DataTable } from '@/components/data-table/data-table'
import { useQuery } from '@tanstack/react-query'
import type { PaginationState, SortingState } from '@tanstack/react-table'
import { useState } from 'react'
import { ContactColumns } from './contact-columns'
import {
  fetchContacts,
  type ContactsResponse,
} from '@/api/contact/fetch-contacts'

export function ContactTable() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState('')

  const { data, isLoading, isFetching } = useQuery<ContactsResponse>({
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
  const handleGlobalFilterChange = (value: string) => {
    setGlobalFilter(value)
    setPagination(prev => ({
      ...prev,
      pageIndex: 0,
    }))
  }

  return (
    <main className="w-full">
      <DataTable
        columns={ContactColumns}
        data={data?.data ?? []}
        pageCount={data?.pageCount ?? -1}
        pagination={pagination}
        onPaginationChange={setPagination}
        sorting={sorting}
        onSortingChange={setSorting}
        globalFilter={globalFilter}
        onGlobalFilterChange={handleGlobalFilterChange}
        isLoading={isLoading || isFetching}
        searchPlaceholder="Buscar contatos por nome ou email..."
        manualPagination
        manualSorting
        manualFiltering
      />
    </main>
  )
}
