import type { CreateContactDTO } from '@/applications/dtos/create-contact-dto'
import type { Contact } from '@/domain/entites/contact'
import { AppError } from '@/domain/errors/app-errors'
import type { ContactRepository } from '@/domain/repositories/contact-repository'

export class UpdateContactUseCase {
  constructor(private contactRepository: ContactRepository) {}

  async execute(id: string, data: CreateContactDTO): Promise<Contact> {
    const existingContact = await this.contactRepository.findContactById(id)

    if (!existingContact) {
      throw new AppError('Contact not found', 404)
    }

    const updatedContact = await this.contactRepository.updateContact(id, data)

    return updatedContact
  }
}
