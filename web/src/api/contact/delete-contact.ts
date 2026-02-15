import { api } from '@/lib/axios'
import type { Contact } from '@/utils/types'

export async function deleteContact(id: string): Promise<Contact> {
  const response = await api.delete(`/contact/${id}`)

  return response.data
}
