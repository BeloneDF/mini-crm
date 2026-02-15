import { CreateLeadUseCase } from '@/applications/use-cases/lead/create-lead'
import { FindLeadByIdUseCase } from '@/applications/use-cases/lead/find-lead-by-id'
import { ListLeadUseCase } from '@/applications/use-cases/lead/list-leads'
import { UpdateLeadUseCase } from '@/applications/use-cases/lead/update-lead'
import { InMemoryContactRepository } from '@/infrastructure/db/memory-repositories/memory-contact-repository'
import { InMemoryLeadRepository } from '@/infrastructure/db/memory-repositories/memory-lead-repository'
import { Hono } from 'hono'
import { LeadController } from '../controllers/lead-controller'
import { DeleteLeadByIdUseCase } from '@/applications/use-cases/lead/delete-lead'

const leadRoutes = new Hono()

const leadRepository = new InMemoryLeadRepository()
const contactRepository = new InMemoryContactRepository()

const listLeads = new ListLeadUseCase(leadRepository)
const findLeadByIdUseCase = new FindLeadByIdUseCase(leadRepository)
const createLeadUseCase = new CreateLeadUseCase(
  leadRepository,
  contactRepository
)
const updateLeadUseCase = new UpdateLeadUseCase(leadRepository)
const deleteLeadUseCase = new DeleteLeadByIdUseCase(leadRepository)

const controller = new LeadController(
  listLeads,
  findLeadByIdUseCase,
  createLeadUseCase,
  updateLeadUseCase,
  deleteLeadUseCase
)

leadRoutes.get('/', c => controller.list(c))
leadRoutes.post('/', c => controller.create(c))
leadRoutes.put('/:id', c => controller.update(c))
leadRoutes.get('/:id', c => controller.findLeadById(c))
leadRoutes.delete('/:id', c => controller.delete(c))
export default leadRoutes
