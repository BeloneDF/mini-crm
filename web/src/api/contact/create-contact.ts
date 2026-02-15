import { api } from '@/lib/axios'
import type { Contact } from '@/utils/types'

export interface CreateContactRequest {
  name: string
  email: string
  phone: string
}

export async function createContact(
  request: CreateContactRequest
): Promise<Contact> {
  const response = await api.post('/contact', request)

  return response.data
}
