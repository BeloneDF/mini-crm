import type { Contact } from '../entities/contact'
import type { Lead } from '../entities/lead'

export type CreateContactRepositoryInput = Pick<Contact, 'name' | 'email' | 'phone'>
export type UpdateContactRepositoryInput = CreateContactRepositoryInput

export interface ListContactsParams {
  page?: number
  pageSize?: number
  search?: string
  sortBy?: keyof Contact
  sortOrder?: 'asc' | 'desc'
}

export interface FetchAllContactsResult {
  data: Contact[]
  total: number
  page: number
  pageSize: number
  pageCount: number
}

export interface ContactRepository {
  fetchAll(params: ListContactsParams): Promise<FetchAllContactsResult>
  create(contact: CreateContactRepositoryInput): Promise<Contact>
  updateContact(
    id: string,
    contact: UpdateContactRepositoryInput
  ): Promise<Contact | null>
  findContactById(id: string): Promise<Contact | null>
  findByNameAndEmail(name: string, email: string): Promise<Contact | null>
  findLeadsByContactId(contactId: string): Promise<Lead[]>
  fetchAllContacts(): Promise<Pick<Contact, 'id' | 'name' | 'email'>[]>
  deleteContact(id: string): Promise<{ message: string } | null>
}
