import type { Contact } from '@/domain/entities/contact'
import { NotFoundError } from '@/domain/errors/app-errors'
import type { ContactRepository } from '@/domain/repositories/contact-repository'

export interface FindContactByIdUseCaseRequest {
  id: string
}

export class FindContactByIdUseCase {
  constructor(private contactRepository: ContactRepository) {}

  async execute(
    request: FindContactByIdUseCaseRequest
  ): Promise<Contact> {
    const contact = await this.contactRepository.findContactById(request.id)

    if (!contact) {
      throw new NotFoundError('Contact not found')
    }

    return contact
  }
}
