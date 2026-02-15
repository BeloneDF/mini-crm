import type { Lead } from '../entities/lead'

export type CreateLeadRepositoryInput = Pick<
  Lead,
  'name' | 'company' | 'status' | 'contactId'
>
export type UpdateLeadRepositoryInput = Pick<
  Lead,
  'name' | 'company' | 'status'
> & { contactId?: string }

export interface ListLeadsParams {
  page?: number
  pageSize?: number
  search?: string
  sortBy?: keyof Lead
  sortOrder?: 'asc' | 'desc'
  status?: Lead['status'] | 'all'
}

export interface FetchAllLeadsResult {
  data: Lead[]
  total: number
  page: number
  pageSize: number
  pageCount: number
}

export interface LeadRepository {
  create(contact: CreateLeadRepositoryInput): Promise<Lead>
  updateLeadById(
    id: string,
    data: UpdateLeadRepositoryInput
  ): Promise<Lead | null>
  findAll(params: ListLeadsParams): Promise<FetchAllLeadsResult>
  findLeadById(id: string): Promise<Lead | null>
  findAllLeads(): Promise<Lead[]>
  deleteLeadById(id: string): Promise<{ message: string } | null>
}
