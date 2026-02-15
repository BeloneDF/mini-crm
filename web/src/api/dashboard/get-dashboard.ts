import { api } from '@/lib/axios'
import type { LeadStatus, LeadWithContact } from '@/utils/types'

export interface getDashboardResponse {
  totalLeads: number
  totalContacts: number
  conversionRate: number
  leadsByStatus: {
    status: LeadStatus
    count: number
    percentage: number
  }[]
  recentLeads: LeadWithContact[]
}

export async function getDashboard(): Promise<getDashboardResponse> {
  const response = await api.get('/dashboard')

  return response.data
}
