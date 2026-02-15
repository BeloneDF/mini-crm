import type { UpdateLeadDTO } from '@/applications/dtos/update-lead-dto'
import type { Lead } from '@/domain/entites/lead'
import { AppError } from '@/domain/errors/app-errors'
import type { LeadRepository } from '@/domain/repositories/lead-repository'

export class UpdateLeadUseCase {
  constructor(private leadRepository: LeadRepository) {}

  async execute(id: string, data: UpdateLeadDTO): Promise<Lead> {
    const existingLead = await this.leadRepository.findLeadById(id)

    if (!existingLead) {
      throw new AppError('Lead not found', 404)
    }

    const updatedLead = await this.leadRepository.updateLeadById(id, data)
    return updatedLead
  }
}
