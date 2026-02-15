import type { Contact } from '@/utils/types'

import type { SortingState } from '@tanstack/react-table'
import { api } from '@/lib/axios'

export type ContactsResponse = {
  data: Contact[]
  total: number
  page: number
  pageSize: number
  pageCount: number
}

export async function fetchContacts(
  page: number,
  pageSize: number,
  sorting?: SortingState,
  search?: string
): Promise<ContactsResponse> {
  const params = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
  })

  if (sorting?.length) {
    params.append('sortBy', sorting[0].id)
    params.append('sortOrder', sorting[0].desc ? 'desc' : 'asc')
  }

  if (search) {
    params.append('search', search)
  }

  const { data } = await api.get<ContactsResponse>(
    `/contact?${params.toString()}`
  )

  return data
}
