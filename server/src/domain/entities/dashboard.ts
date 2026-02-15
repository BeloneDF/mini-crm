import type { LeadStatus } from './lead'

export type LeadWithContact = {
  id: string
  contactId: string
  name: string
  company: string
  status: LeadStatus
  createdAt: string
  contact: {
    name: string
    email: string
  }
}

export interface Dashboard {
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
