import type { CreateContactUseCase } from '@/applications/use-cases/contact/create-contact'
import type { ListContactUseCase } from '@/applications/use-cases/contact/list-contacts'
import { AppError } from '@/domain/errors/app-errors'
import { contactSchema } from '@/shared/schemas/contact-schema'
import type { Context } from 'hono'
import type { ContentfulStatusCode } from 'hono/utils/http-status'
import {
  listContactsQuerySchema,
  updateContactSchema,
} from '../params-types/contact-params-type'
import z from 'zod'
import type { FindContactByIdUseCase } from '@/applications/use-cases/contact/find-contact-by-id'
import type { UpdateContactUseCase } from '@/applications/use-cases/contact/update-contact'
import type { FindLeadsByContactIdUseCase } from '@/applications/use-cases/lead/list-leads-by-contact-id'
import type { FetchAllContactsUseCase } from '@/applications/use-cases/contact/fetch-all-contacts'
import type { DeleteContactUseCase } from '@/applications/use-cases/contact/delete-contact'

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

      const parsed = contactSchema.safeParse(body)

      if (!parsed.success) {
        return c.json({ error: z.treeifyError(parsed.error) }, 400)
      }

      const contact = await this.createContact.execute({
        email: parsed.data.email,
        name: parsed.data.name,
        phone: parsed.data.phone,
      })

      return c.json(contact, 201)
    } catch (error) {
      if (error instanceof AppError) {
        return c.json(
          { error: error.message },
          error.statusCode as ContentfulStatusCode
        )
      }

      return c.json({ error: 'Internal server error' }, 500)
    }
  }

  async list(c: Context) {
    try {
      const query = listContactsQuerySchema.parse(c.req.query())

      const contacts = await this.listContact.execute(query)

      return c.json(contacts)
    } catch (error) {
      if (error instanceof z.ZodError) {
        return c.json(
          { error: 'Invalid query params', details: z.treeifyError(error) },
          400
        )
      }

      return c.json({ error: 'Internal server error' }, 500)
    }
  }

  async findById(c: Context) {
    try {
      const id = c.req.param('id')

      const contact = await this.findContactById.execute({ id })

      return c.json(contact)
    } catch (error) {
      if (error instanceof AppError) {
        return c.json(
          { error: error.message },
          error.statusCode as ContentfulStatusCode
        )
      }

      return c.json({ error: 'Internal server error' }, 500)
    }
  }

  async update(c: Context) {
    try {
      const id = c.req.param('id')
      const body = await c.req.json()

      const parsed = updateContactSchema.safeParse(body)

      if (!parsed.success) {
        return c.json({ error: z.treeifyError(parsed.error) }, 400)
      }

      const contact = await this.updateContact.execute(id, parsed.data)

      return c.json(contact)
    } catch (error) {
      if (error instanceof AppError) {
        return c.json(
          { error: error.message },
          error.statusCode as ContentfulStatusCode
        )
      }

      return c.json({ error: 'Internal server error' }, 500)
    }
  }

  async listLeads(c: Context) {
    try {
      const id = c.req.param('contactId')

      const leads = await this.listContactLeads.execute({ contactId: id })

      return c.json(leads)
    } catch (error) {
      if (error instanceof AppError) {
        return c.json(
          { error: error.message },
          error.statusCode as ContentfulStatusCode
        )
      }

      return c.json({ error: 'Internal server error' }, 500)
    }
  }

  async fetchAllContacts(c: Context) {
    try {
      const contacts = await this.fetchAllContactsUseCase.execute()

      return c.json(contacts)
    } catch (error) {
      if (error instanceof AppError) {
        return c.json(
          { error: error.message },
          error.statusCode as ContentfulStatusCode
        )
      }

      return c.json({ error: 'Internal server error' }, 500)
    }
  }

  async delete(c: Context) {
    try {
      const id = c.req.param('id')

      const contact = await this.deleteContact.execute(id)
      return c.json(contact)
    } catch (error) {
      if (error instanceof AppError) {
        return c.json(
          { error: error.message },
          error.statusCode as ContentfulStatusCode
        )
      }

      return c.json({ error: 'Internal server error' }, 500)
    }
  }
}
