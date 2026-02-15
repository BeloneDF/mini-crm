import type { UpdateContactDTO } from '@/applications/dtos/update-contact-dto'
import type { Contact } from '@/domain/entities/contact'
import { NotFoundError } from '@/domain/errors/app-errors'
import type { ContactRepository } from '@/domain/repositories/contact-repository'

export class UpdateContactUseCase {
  constructor(private contactRepository: ContactRepository) {}

  async execute(id: string, data: UpdateContactDTO): Promise<Contact> {
    const updatedContact = await this.contactRepository.updateContact(id, data)

    if (!updatedContact) {
      throw new NotFoundError('Contact not found')
    }

    return updatedContact
  }
}
