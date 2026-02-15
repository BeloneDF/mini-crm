import { api } from '@/lib/axios'
import type { Contact, LeadStatus } from '@/utils/types'

export interface UpdateLeadRequest {
  name: string
  company: string
  status: LeadStatus
  contactId: string
}
export async function updateLead(
  id: string,
  request: UpdateLeadRequest
): Promise<Contact> {
  const response = await api.put(`/lead/${id}`, request)

  return response.data
}
