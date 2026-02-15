import { GetDashboardUseCase } from '@/applications/use-cases/dashboard/get-dashboard'
import { InMemoryContactRepository } from '@/infrastructure/db/memory-repositories/memory-contact-repository'
import { InMemoryDashboardRepository } from '@/infrastructure/db/memory-repositories/memory-dashboard-repository'
import { InMemoryLeadRepository } from '@/infrastructure/db/memory-repositories/memory-lead-repository'
import { Hono } from 'hono'
import { DashboardController } from '../controllers/dashboard-controller'

const dashboardRoutes = new Hono()
const leadRepository = new InMemoryLeadRepository()
const contactRepository = new InMemoryContactRepository()
const dashBoardRepository = new InMemoryDashboardRepository(
  leadRepository,
  contactRepository
)
const useCase = new GetDashboardUseCase(dashBoardRepository)
const controller = new DashboardController(useCase)

dashboardRoutes.get('/', c => controller.list(c))
export default dashboardRoutes
