import { api } from '@/lib/axios'
import type { Contact } from '@/utils/types'

export interface UpdateContactRequest {
  name: string
  email: string
  phone: string
}
export async function updateContact(
  id: string,
  request: UpdateContactRequest
): Promise<Contact> {
  const response = await api.put(`/contact/${id}`, request)

  return response.data
}
