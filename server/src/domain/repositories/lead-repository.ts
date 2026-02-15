import type { CreateLeadDTO } from '@/applications/dtos/create-lead-dto'
import type { Lead } from '../entites/lead'
import type { UpdateLeadDTO } from '@/applications/dtos/update-lead-dto'
import type { ListLeadsParams } from '@/applications/use-cases/lead/list-leads'

export interface FetchAllLeadsResult {
  data: Lead[]
  total: number
  page: number
  pageSize: number
  pageCount: number
}

export interface LeadRepository {
  create(contact: CreateLeadDTO): Promise<Lead>
  updateLeadById(id: string, data: UpdateLeadDTO): Promise<Lead>
  findAll(params: ListLeadsParams): Promise<FetchAllLeadsResult>
  findLeadById(id: string): Promise<Lead | null>
  findAllLeads(): Promise<Lead[]>
  deleteLeadById(id: string): Promise<{ message: string }>
}
