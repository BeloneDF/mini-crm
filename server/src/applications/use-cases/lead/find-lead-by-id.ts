import type { Lead } from '@/domain/entities/lead'
import { NotFoundError } from '@/domain/errors/app-errors'
import type { LeadRepository } from '@/domain/repositories/lead-repository'

export interface FindLeadByIdUseCaseRequest {
  id: string
}

export class FindLeadByIdUseCase {
  constructor(private leadRepository: LeadRepository) {}

  async execute(request: FindLeadByIdUseCaseRequest): Promise<Lead> {
    const lead = await this.leadRepository.findLeadById(request.id)

    if (!lead) {
      throw new NotFoundError('Lead not found')
    }

    return lead
  }
}
