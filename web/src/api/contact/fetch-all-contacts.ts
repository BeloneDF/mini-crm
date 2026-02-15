import { api } from '@/lib/axios'
import type { Contact } from '@/utils/types'

export async function fetchAllContacts(): Promise<
  Pick<Contact, 'id' | 'name' | 'email'>[]
> {
  const response = await api.get('/contact/all-contacts')

  return response.data
}
