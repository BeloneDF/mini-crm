import { NotFoundError } from '@/domain/errors/app-errors'
import type { LeadRepository } from '@/domain/repositories/lead-repository'

export interface DeleteLeadByIdUseCaseRequest {
  id: string
}

export class DeleteLeadByIdUseCase {
  constructor(private leadRepository: LeadRepository) {}

  async execute(
    request: DeleteLeadByIdUseCaseRequest
  ): Promise<{ message: string }> {
    const deletedLead = await this.leadRepository.deleteLeadById(request.id)

    if (!deletedLead) {
      throw new NotFoundError('Lead not found')
    }

    return deletedLead
  }
}
