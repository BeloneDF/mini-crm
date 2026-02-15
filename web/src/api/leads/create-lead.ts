import { api } from '@/lib/axios'
import type { Contact, LeadStatus } from '@/utils/types'

export interface CreateLeadRequest {
  name: string
  company: string
  status: LeadStatus
  contactId: string
}

export async function createLead(request: CreateLeadRequest): Promise<Contact> {
  const response = await api.post('/lead', request)

  return response.data
}
