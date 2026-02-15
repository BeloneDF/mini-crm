import type { LeadStatus } from '@/domain/entities/lead'

export interface UpdateLeadDTO {
  name: string
  company: string
  status: LeadStatus
  contactId?: string
}
