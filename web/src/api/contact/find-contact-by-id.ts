import { api } from '@/lib/axios'
import type { Contact } from '@/utils/types'

export interface FindContactByIdRequest {
  id: string
}

export async function findContactById(
  request: FindContactByIdRequest
): Promise<Contact> {
  const response = await api.get(`/contact/${request.id}`)

  return response.data
}
