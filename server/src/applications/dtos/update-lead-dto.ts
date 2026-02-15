import type { LeadStatus } from '@/domain/entites/lead'

export interface UpdateLeadDTO {
  name: string
  company: string
  status: LeadStatus
}
