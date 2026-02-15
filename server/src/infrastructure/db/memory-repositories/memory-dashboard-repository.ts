import type { LeadStatus } from '@/domain/entites/lead'
import type { ContactRepository } from '@/domain/repositories/contact-repository'
import type { DashboardRepository } from '@/domain/repositories/dashboard-repository'
import type { LeadRepository } from '@/domain/repositories/lead-repository'
import type { Dashboard } from '@/shared/utils/types'

export class InMemoryDashboardRepository implements DashboardRepository {
  constructor(
    private leadRepository: LeadRepository,
    private contactRepository: ContactRepository
  ) {}

  async fetchAll(): Promise<Dashboard> {
    const leads = await this.leadRepository.findAllLeads()
    const contacts = await this.contactRepository.fetchAllContacts()

    const totalLeads = leads.length ?? 0
    const leadsByStatusMap = leads.reduce(
      (acc, lead) => {
        acc[lead.status] = (acc[lead.status] || 0) + 1
        return acc
      },
      {} as Record<LeadStatus, number>
    )

    const leadsByStatus =
      (Object.keys(leadsByStatusMap) as LeadStatus[]).map(status => {
        const count = leadsByStatusMap[status]
        return {
          status,
          count,
          percentage: totalLeads > 0 ? count / totalLeads : 0,
        }
      }) ?? []

    const recentLeads = leads
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 5)
      .map(lead => {
        const contact = contacts.find(c => c.id === lead.contactId)
        return {
          ...lead,
          contact: {
            name: contact?.name ?? 'Desconecido',
            email: contact?.email ?? 'Desconecido',
          },
        }
      })

    const conversionRate =
      totalLeads > 0 ? (leadsByStatusMap['convertido'] || 0) / totalLeads : 0

    const totalContacts = contacts.length ?? 0

    return {
      totalLeads,
      totalContacts,
      conversionRate,
      leadsByStatus,
      recentLeads,
    }
  }
}
