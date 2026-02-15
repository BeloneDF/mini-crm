import type { Contact } from '@/domain/entities/contact'
import type { ContactRepository } from '@/domain/repositories/contact-repository'

export class FetchAllContactsUseCase {
  constructor(private contactRepository: ContactRepository) {}

  async execute(): Promise<Pick<Contact, 'id' | 'name' | 'email'>[]> {
    return this.contactRepository.fetchAllContacts()
  }
}
