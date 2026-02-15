import { api } from '@/lib/axios'
import type { Lead } from '@/utils/types'

export interface FindContactByIdRequest {
  id: string
}

export async function findLeadById(
  request: FindContactByIdRequest
): Promise<Lead> {
  const response = await api.get(`/lead/${request.id}`)

  return response.data
}
