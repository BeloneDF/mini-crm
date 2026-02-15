import { NotFoundError } from '@/domain/errors/app-errors'
import type { ContactRepository } from '@/domain/repositories/contact-repository'

export class DeleteContactUseCase {
  constructor(private deleteRepository: ContactRepository) {}

  async execute(id: string): Promise<{ message: string }> {
    const deletedContact = await this.deleteRepository.deleteContact(id)
    if (!deletedContact) {
      throw new NotFoundError('Contact not found')
    }

    return deletedContact
  }
}
