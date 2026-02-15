import type { Lead } from '@/domain/entites/lead'
import type { LeadRepository } from '@/domain/repositories/lead-repository'

export interface FindLeadByIdUseCaseRequest {
  id: string
}

export class FindLeadByIdUseCase {
  constructor(private leadRepository: LeadRepository) {}

  async execute(request: FindLeadByIdUseCaseRequest): Promise<Lead | null> {
    return this.leadRepository.findLeadById(request.id)
  }
}
