import type { LeadStatus } from '@/domain/entites/lead'

export interface CreateLeadDTO {
  name: string
  company: string
  status: LeadStatus
  contactId: string
}
