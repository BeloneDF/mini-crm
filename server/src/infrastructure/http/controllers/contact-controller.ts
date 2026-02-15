import type { CreateContactUseCase } from '@/applications/use-cases/contact/create-contact'
import type { ListContactUseCase } from '@/applications/use-cases/contact/list-contacts'
import { contactSchema } from '@/infrastructure/http/schemas/contact-schema'
import type { Context } from 'hono'
import {
  listContactsQuerySchema,
  updateContactSchema,
} from '../params-types/contact-params-type'
import type { FindContactByIdUseCase } from '@/applications/use-cases/contact/find-contact-by-id'
import type { UpdateContactUseCase } from '@/applications/use-cases/contact/update-contact'
import type { FindLeadsByContactIdUseCase } from '@/applications/use-cases/lead/list-leads-by-contact-id'
import type { FetchAllContactsUseCase } from '@/applications/use-cases/contact/fetch-all-contacts'
import type { DeleteContactUseCase } from '@/applications/use-cases/contact/delete-contact'
import { respondWithError } from '@/infrastructure/http/utils/error-response'

export class ContactController {
  constructor(
    private createContact: CreateContactUseCase,
    private listContact: ListContactUseCase,
    private findContactById: FindContactByIdUseCase,
    private updateContact: UpdateContactUseCase,
    private listContactLeads: FindLeadsByContactIdUseCase,
    private fetchAllContactsUseCase: FetchAllContactsUseCase,
    private deleteContact: DeleteContactUseCase
  ) {}
  async create(c: Context) {
    try {
      const body = await c.req.json()

      const parsed = contactSchema.parse(body)

      const contact = await this.createContact.execute({
        email: parsed.email,
        name: parsed.name,
        phone: parsed.phone,
      })

      return c.json(contact, 201)
    } catch (error) {
      return respondWithError(c, error)
    }
  }

  async list(c: Context) {
    try {
      const query = listContactsQuerySchema.parse(c.req.query())

      const contacts = await this.listContact.execute(query)

      return c.json(contacts)
    } catch (error) {
      return respondWithError(c, error)
    }
  }

  async findById(c: Context) {
    try {
      const id = c.req.param('id')

      const contact = await this.findContactById.execute({ id })

      return c.json(contact)
    } catch (error) {
      return respondWithError(c, error)
    }
  }

  async update(c: Context) {
    try {
      const id = c.req.param('id')
      const body = await c.req.json()

      const parsed = updateContactSchema.parse(body)

      const contact = await this.updateContact.execute(id, parsed)

      return c.json(contact)
    } catch (error) {
      return respondWithError(c, error)
    }
  }

  async listLeads(c: Context) {
    try {
      const id = c.req.param('contactId')

      const leads = await this.listContactLeads.execute({ contactId: id })

      return c.json(leads)
    } catch (error) {
      return respondWithError(c, error)
    }
  }

  async fetchAllContacts(c: Context) {
    try {
      const contacts = await this.fetchAllContactsUseCase.execute()

      return c.json(contacts)
    } catch (error) {
      return respondWithError(c, error)
    }
  }

  async delete(c: Context) {
    try {
      const id = c.req.param('id')

      const contact = await this.deleteContact.execute(id)
      return c.json(contact)
    } catch (error) {
      return respondWithError(c, error)
    }
  }
}
