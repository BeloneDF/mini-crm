import { api } from '@/lib/axios'
import type { Contact, Lead } from '@/utils/types'

export interface GetLeadsByContactIdRequest {
  id: string
}

export interface GetLeadsByContactIdResponse {
  leads: Lead[]
  contact: Contact
}

export async function getLeadsByContactId(
  request: GetLeadsByContactIdRequest
): Promise<GetLeadsByContactIdResponse> {
  const response = await api.get(`/contact/${request.id}/leads`)

  return response.data
}
