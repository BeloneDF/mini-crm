import { AppError } from '@/domain/errors/app-errors'
import type { ContactRepository } from '@/domain/repositories/contact-repository'

export class DeleteContactUseCase {
  constructor(private deleteRepository: ContactRepository) {}

  async execute(id: string): Promise<{ message: string }> {
    const existingContact = await this.deleteRepository.findContactById(id)

    if (!existingContact) {
      throw new AppError('Contact not found', 404)
    }

    const deletedContact = await this.deleteRepository.deleteContact(id)
    return deletedContact
  }
}
