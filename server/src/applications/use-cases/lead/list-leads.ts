import type { Lead, LeadStatus } from '@/domain/entites/lead'
import type {
  FetchAllLeadsResult,
  LeadRepository,
} from '@/domain/repositories/lead-repository'

export interface ListLeadsParams {
  page?: number
  pageSize?: number
  search?: string
  sortBy?: keyof Lead
  sortOrder?: 'asc' | 'desc'
  status?: LeadStatus | 'all'
}

export class ListLeadUseCase {
  constructor(private leadRepository: LeadRepository) {}

  async execute(params: ListLeadsParams): Promise<FetchAllLeadsResult> {
    return this.leadRepository.findAll(params)
  }
}
