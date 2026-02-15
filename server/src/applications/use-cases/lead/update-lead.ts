import type { UpdateLeadDTO } from '@/applications/dtos/update-lead-dto'
import type { Lead } from '@/domain/entities/lead'
import { NotFoundError } from '@/domain/errors/app-errors'
import type { LeadRepository } from '@/domain/repositories/lead-repository'

export class UpdateLeadUseCase {
  constructor(private leadRepository: LeadRepository) {}

  async execute(id: string, data: UpdateLeadDTO): Promise<Lead> {
    const updatedLead = await this.leadRepository.updateLeadById(id, data)
    if (!updatedLead) {
      throw new NotFoundError('Lead not found')
    }

    return updatedLead
  }
}
