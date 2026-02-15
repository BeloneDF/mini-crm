import { api } from '@/lib/axios'
import type { Contact } from '@/utils/types'

export async function deleteLead(id: string): Promise<Contact> {
  const response = await api.delete(`/lead/${id}`)

  return response.data
}
