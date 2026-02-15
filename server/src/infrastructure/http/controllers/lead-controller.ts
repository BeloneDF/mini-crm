import type { Context } from 'hono'
import { listLeadsQuerySchema } from '../params-types/lead-params-type'
import z from 'zod'
import type { ListLeadUseCase } from '@/applications/use-cases/lead/list-leads'
import { AppError } from '@/domain/errors/app-errors'
import type { ContentfulStatusCode } from 'hono/utils/http-status'
import type { FindLeadByIdUseCase } from '@/applications/use-cases/lead/find-lead-by-id'
import type { CreateLeadUseCase } from '@/applications/use-cases/lead/create-lead'
import { createLeadSchema } from '@/shared/schemas/lead-schema'
import type { UpdateLeadUseCase } from '@/applications/use-cases/lead/update-lead'
import type { DeleteLeadByIdUseCase } from '@/applications/use-cases/lead/delete-lead'

export class LeadController {
  constructor(
    private listLeads: ListLeadUseCase,
    private findLeadByIdUseCase: FindLeadByIdUseCase,
    private createLeadUseCase: CreateLeadUseCase,
    private updateLeadUseCase: UpdateLeadUseCase,
    private deleteLeadUseCase: DeleteLeadByIdUseCase
  ) {}

  async list(c: Context) {
    try {
      const query = listLeadsQuerySchema.parse(c.req.query())

      const leads = await this.listLeads.execute(query)

      return c.json(leads)
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

  async findLeadById(c: Context) {
    try {
      const id = c.req.param('id')

      const lead = await this.findLeadByIdUseCase.execute({ id })

      return c.json(lead)
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

  async create(c: Context) {
    try {
      const body = await c.req.json()

      const parsed = createLeadSchema.safeParse(body)

      if (!parsed.success) {
        return c.json({ error: 'Invalid body', details: parsed.error }, 400)
      }

      const lead = await this.createLeadUseCase.execute(parsed.data)
      return c.json(lead, 201)
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
      const parsed = createLeadSchema.safeParse(body)

      if (!parsed.success) {
        return c.json({ error: 'Invalid body', details: parsed.error }, 400)
      }

      const updatedLead = await this.updateLeadUseCase.execute(id, parsed.data)
      return c.json(updatedLead)
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

      const result = await this.deleteLeadUseCase.execute({ id })

      return c.json(result)
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
