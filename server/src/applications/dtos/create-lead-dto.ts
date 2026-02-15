import type { LeadStatus } from '@/domain/entities/lead'

export interface CreateLeadDTO {
  name: string
  company: string
  status: LeadStatus
  contactId: string
}
