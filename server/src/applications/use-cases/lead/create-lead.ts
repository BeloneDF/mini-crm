import type { CreateLeadDTO } from '@/applications/dtos/create-lead-dto'
import type { Lead } from '@/domain/entites/lead'
import { AppError } from '@/domain/errors/app-errors'
import type { ContactRepository } from '@/domain/repositories/contact-repository'
import type { LeadRepository } from '@/domain/repositories/lead-repository'

export class CreateLeadUseCase {
  constructor(
    private leadRepository: LeadRepository,
    private contactRepository: ContactRepository
  ) {}

  async execute(data: CreateLeadDTO): Promise<Lead> {
    const existingContact = await this.contactRepository.findContactById(
      data.contactId
    )

    if (!existingContact) {
      throw new AppError('Associated contact not found', 400)
    }

    const createdLead = await this.leadRepository.create(data)

    return createdLead
  }
}
