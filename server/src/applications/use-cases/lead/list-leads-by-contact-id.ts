import type { Contact } from '@/domain/entites/contact'
import type { Lead } from '@/domain/entites/lead'
import type { ContactRepository } from '@/domain/repositories/contact-repository'

export interface FindLeadsByContactIdUseCaseRequest {
  contactId: string
}

interface FindLeadsByContactIdUseCaseResponse {
  contact: Contact | null
  leads: Lead[]
}

export class FindLeadsByContactIdUseCase {
  constructor(private contactRepository: ContactRepository) {}

  async execute(
    request: FindLeadsByContactIdUseCaseRequest
  ): Promise<FindLeadsByContactIdUseCaseResponse | null> {
    console.log(
      'Executing FindLeadsByContactIdUseCase with contactId:',
      request.contactId
    )
    const existingContact = this.contactRepository.findContactById(
      request.contactId
    )

    if (!existingContact) {
      return null
    }

    const leadsAndContact = {
      contact: await existingContact,
      leads: await this.contactRepository.findLeadsByContactId(
        request.contactId
      ),
    }

    return leadsAndContact
  }
}
