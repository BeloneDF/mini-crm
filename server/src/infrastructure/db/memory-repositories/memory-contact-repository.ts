import type { ContactRepository } from '@/domain/repositories/contact-repository'
import type { Contact } from '@/shared/utils/types'
import { contacts, leads } from '../database'
import type { ListContactParams } from '@/applications/use-cases/contact/list-contacts'
import { randomUUID } from 'crypto'
import type { CreateContactDTO } from '@/applications/dtos/create-contact-dto'
import type { Lead } from '@/domain/entites/lead'

export class InMemoryContactRepository implements ContactRepository {
  async fetchAll(params: ListContactParams) {
    const {
      page = 0,
      pageSize = 10,
      search,
      sortBy,
      sortOrder = 'asc',
    } = params

    let filteredContacts = [...contacts]

    if (search) {
      const lowerSearch = search.toLowerCase()

      filteredContacts = filteredContacts.filter(
        contact =>
          contact.name.toLowerCase().includes(lowerSearch) ||
          contact.email.toLowerCase().includes(lowerSearch)
      )
    }

    if (sortBy) {
      filteredContacts.sort((a, b) => {
        const aValue = a[sortBy]
        const bValue = b[sortBy]

        if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1
        if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1
        return 0
      })
    }

    const total = filteredContacts.length
    const pageCount = Math.ceil(total / pageSize)

    const startIndex = page * pageSize
    const paginated = filteredContacts.slice(startIndex, startIndex + pageSize)

    return {
      data: paginated,
      total,
      page,
      pageSize,
      pageCount,
    }
  }

  async create(contact: CreateContactDTO): Promise<Contact> {
    const newContact: Contact = {
      id: randomUUID(),
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      createdAt: new Date().toISOString(),
    }
    contacts.push(newContact)
    return Promise.resolve(newContact)
  }

  async updateContact(id: string, contact: CreateContactDTO): Promise<Contact> {
    const index = contacts.findIndex(c => c.id === id)
    if (index === -1) {
      throw new Error('Contact not found')
    }
    contacts[index] = { ...contacts[index], ...contact }
    return Promise.resolve(contacts[index])
  }

  async findContactById(id: string): Promise<Contact | null> {
    const contact = contacts.find(c => c.id === id)

    if (!contact) {
      throw new Error('Contact not found')
    }

    return Promise.resolve(contact || null)
  }

  async findByNameAndEmail(
    name: string,
    email: string
  ): Promise<Contact | null> {
    const contact = contacts.find(c => c.name === name && c.email === email)

    if (contact) {
      throw new Error('Contact already exists')
    }

    return Promise.resolve(null)
  }

  async findLeadsByContactId(contactId: string): Promise<Lead[]> {
    const filteredLeads = leads.filter(lead => lead.contactId === contactId)

    if (filteredLeads.length === 0) {
      return Promise.resolve([])
    }
    return Promise.resolve(filteredLeads)
  }

  async fetchAllContacts(): Promise<Pick<Contact, 'id' | 'name' | 'email'>[]> {
    return contacts.map(contact => ({
      id: contact.id,
      name: contact.name,
      email: contact.email,
    }))
  }

  async deleteContact(id: string): Promise<{ message: string }> {
    const index = contacts.findIndex(c => c.id === id)

    if (index === -1) {
      throw new Error('Contact not found')
    }

    if (leads.some(lead => lead.contactId === id)) {
      for (let i = leads.length - 1; i >= 0; i--) {
        if (leads[i].contactId === id) {
          leads.splice(i, 1)
        }
      }
    }

    contacts.splice(index, 1)
    return Promise.resolve({ message: 'Contact deleted successfully' })
  }
}
