import type { Lead, LeadStatus } from '@/utils/types'

import type { SortingState } from '@tanstack/react-table'
import { api } from '@/lib/axios'

export type LeadsResopnse = {
  data: Lead[]
  total: number
  page: number
  pageSize: number
  pageCount: number
  statusFilter?: LeadStatus | null
}

export async function fetchLeads(
  page: number,
  pageSize: number,
  sorting?: SortingState,
  search?: string,
  statusFilter?: LeadStatus | null
): Promise<LeadsResopnse> {
  const params = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
  })

  if (statusFilter) {
    params.append('status', statusFilter)
  }

  if (sorting?.length) {
    params.append('sortBy', sorting[0].id)
    params.append('sortOrder', sorting[0].desc ? 'desc' : 'asc')
  }

  if (search) {
    params.append('search', search)
  }

  const { data } = await api.get<LeadsResopnse>(`/lead?${params.toString()}`)

  return data
}
