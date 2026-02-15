import type { Context } from 'hono'
import { listLeadsQuerySchema } from '../params-types/lead-params-type'
import type { ListLeadUseCase } from '@/applications/use-cases/lead/list-leads'
import type { FindLeadByIdUseCase } from '@/applications/use-cases/lead/find-lead-by-id'
import type { CreateLeadUseCase } from '@/applications/use-cases/lead/create-lead'
import {
  createLeadSchema,
  updateLeadSchema,
} from '@/infrastructure/http/schemas/lead-schema'
import type { UpdateLeadUseCase } from '@/applications/use-cases/lead/update-lead'
import type { DeleteLeadByIdUseCase } from '@/applications/use-cases/lead/delete-lead'
import { respondWithError } from '@/infrastructure/http/utils/error-response'

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
      return respondWithError(c, error)
    }
  }

  async findLeadById(c: Context) {
    try {
      const id = c.req.param('id')

      const lead = await this.findLeadByIdUseCase.execute({ id })

      return c.json(lead)
    } catch (error) {
      return respondWithError(c, error)
    }
  }

  async create(c: Context) {
    try {
      const body = await c.req.json()

      const parsed = createLeadSchema.parse(body)

      const lead = await this.createLeadUseCase.execute(parsed)
      return c.json(lead, 201)
    } catch (error) {
      return respondWithError(c, error)
    }
  }

  async update(c: Context) {
    try {
      const id = c.req.param('id')
      const body = await c.req.json()
      const parsed = updateLeadSchema.parse(body)

      const updatedLead = await this.updateLeadUseCase.execute(id, parsed)
      return c.json(updatedLead)
    } catch (error) {
      return respondWithError(c, error)
    }
  }

  async delete(c: Context) {
    try {
      const id = c.req.param('id')

      const result = await this.deleteLeadUseCase.execute({ id })

      return c.json(result)
    } catch (error) {
      return respondWithError(c, error)
    }
  }
}
