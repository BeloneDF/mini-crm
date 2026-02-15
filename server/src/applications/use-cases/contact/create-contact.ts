import type { CreateContactDTO } from '@/applications/dtos/create-contact-dto'
import type { Contact } from '@/domain/entities/contact'
import { ConflictError } from '@/domain/errors/app-errors'
import type { ContactRepository } from '@/domain/repositories/contact-repository'

export class CreateContactUseCase {
  constructor(private contactRepository: ContactRepository) {}

  async execute(data: CreateContactDTO): Promise<Contact> {
    const existingContact = await this.contactRepository.findByNameAndEmail(
      data.name,
      data.email
    )

    if (existingContact) {
      throw new ConflictError('Contact already registered')
    }

    return this.contactRepository.create(data)
  }
}
