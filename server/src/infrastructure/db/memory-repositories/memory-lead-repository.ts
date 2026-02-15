import type { Lead } from '@/domain/entities/lead'
import type { LeadRepository } from '@/domain/repositories/lead-repository'
import { leads } from '../database'
import type {
  CreateLeadRepositoryInput,
  ListLeadsParams,
  UpdateLeadRepositoryInput,
} from '@/domain/repositories/lead-repository'

export class InMemoryLeadRepository implements LeadRepository {
  create(data: CreateLeadRepositoryInput): Promise<Lead> {
    const newLead: Lead = {
      id: crypto.randomUUID(),
      contactId: data.contactId,
      name: data.name,
      company: data.company,
      status: data.status,
      createdAt: new Date().toISOString(),
    }

    leads.push(newLead)
    return Promise.resolve(newLead)
  }

  async findAll(params: ListLeadsParams) {
    const {
      page = 0,
      pageSize = 10,
      search,
      sortBy,
      sortOrder = 'asc',
      status,
    } = params

    let filteredContacts = [...leads]

    if (status && status !== 'all') {
      filteredContacts = filteredContacts.filter(lead => lead.status === status)
    }

    if (search) {
      const lowerSearch = search.toLowerCase()

      filteredContacts = filteredContacts.filter(
        contact =>
          contact.name.toLowerCase().includes(lowerSearch) ||
          contact.company.toLowerCase().includes(lowerSearch)
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

  findLeadById(id: string): Promise<Lead | null> {
    const lead = leads.find(lead => lead.id === id)
    return Promise.resolve(lead || null)
  }

  updateLeadById(id: string, data: UpdateLeadRepositoryInput): Promise<Lead | null> {
    const leadIndex = leads.findIndex(lead => lead.id === id)
    if (leadIndex === -1) {
      return Promise.resolve(null)
    }

    const updatedLead = { ...leads[leadIndex], ...data }
    leads[leadIndex] = updatedLead
    return Promise.resolve(updatedLead)
  }

  findAllLeads(): Promise<Lead[]> {
    return Promise.resolve(leads)
  }

  deleteLeadById(id: string): Promise<{ message: string } | null> {
    const leadIndex = leads.findIndex(lead => lead.id === id)
    if (leadIndex === -1) {
      return Promise.resolve(null)
    }

    leads.splice(leadIndex, 1)
    return Promise.resolve({ message: 'Lead deleted successfully' })
  }
}
