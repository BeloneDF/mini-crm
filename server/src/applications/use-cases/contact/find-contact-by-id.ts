import type { Contact } from '@/domain/entites/contact'
import type { ContactRepository } from '@/domain/repositories/contact-repository'

export interface FindContactByIdUseCaseRequest {
  id: string
}

export class FindContactByIdUseCase {
  constructor(private contactRepository: ContactRepository) {}

  async execute(
    request: FindContactByIdUseCaseRequest
  ): Promise<Contact | null> {
    return this.contactRepository.findContactById(request.id)
  }
}
