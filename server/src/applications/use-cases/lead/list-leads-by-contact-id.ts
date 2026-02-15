import type { Contact } from '@/domain/entities/contact'
import type { Lead } from '@/domain/entities/lead'
import { NotFoundError } from '@/domain/errors/app-errors'
import type { ContactRepository } from '@/domain/repositories/contact-repository'

export interface FindLeadsByContactIdUseCaseRequest {
  contactId: string
}

interface FindLeadsByContactIdUseCaseResponse {
  contact: Contact
  leads: Lead[]
}

export class FindLeadsByContactIdUseCase {
  constructor(private contactRepository: ContactRepository) {}

  async execute(
    request: FindLeadsByContactIdUseCaseRequest
  ): Promise<FindLeadsByContactIdUseCaseResponse> {
    const existingContact = await this.contactRepository.findContactById(
      request.contactId
    )

    if (!existingContact) {
      throw new NotFoundError('Contact not found')
    }

    const leadsAndContact = {
      contact: existingContact,
      leads: await this.contactRepository.findLeadsByContactId(
        request.contactId
      ),
    }

    return leadsAndContact
  }
}
