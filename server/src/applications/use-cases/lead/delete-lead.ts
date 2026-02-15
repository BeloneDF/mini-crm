import type { LeadRepository } from '@/domain/repositories/lead-repository'

export interface DeleteLeadByIdUseCaseRequest {
  id: string
}

export class DeleteLeadByIdUseCase {
  constructor(private leadRepository: LeadRepository) {}

  async execute(
    request: DeleteLeadByIdUseCaseRequest
  ): Promise<{ message: string } | null> {
    return this.leadRepository.deleteLeadById(request.id)
  }
}
