import type {
  FetchAllLeadsResult,
  ListLeadsParams,
  LeadRepository,
} from '@/domain/repositories/lead-repository'

export class ListLeadUseCase {
  constructor(private leadRepository: LeadRepository) {}

  async execute(params: ListLeadsParams): Promise<FetchAllLeadsResult> {
    return this.leadRepository.findAll(params)
  }
}
