import type { CreateContactDTO } from '@/applications/dtos/create-contact-dto'
import type { UpdateContactDTO } from '@/applications/dtos/update-contact-dto'
import type { ListContactParams } from '@/applications/use-cases/contact/list-contacts'
import type { Lead } from '../entites/lead'
import type { Contact } from '../entites/contact'

export interface FetchAllContactsResult {
  data: Contact[]
  total: number
  page: number
  pageSize: number
  pageCount: number
}

export interface ContactRepository {
  fetchAll(params: ListContactParams): Promise<FetchAllContactsResult>
  create(contact: CreateContactDTO): Promise<Contact>
  updateContact(id: string, contact: UpdateContactDTO): Promise<Contact>
  findContactById(id: string): Promise<Contact | null>
  findByNameAndEmail(name: string, email: string): Promise<Contact | null>
  findLeadsByContactId(contactId: string): Promise<Lead[]>
  fetchAllContacts(): Promise<Pick<Contact, 'id' | 'name' | 'email'>[]>
  deleteContact(id: string): Promise<{ message: string }>
}
