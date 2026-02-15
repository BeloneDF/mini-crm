import type { GetDashboardUseCase } from '@/applications/use-cases/dashboard/get-dashboard'
import { respondWithError } from '@/infrastructure/http/utils/error-response'
import type { Context } from 'hono'

export class DashboardController {
  constructor(private getDashboard: GetDashboardUseCase) {}

  async list(c: Context) {
    try {
      const dashboardData = await this.getDashboard.execute()

      return c.json(dashboardData)
    } catch (error) {
      return respondWithError(c, error)
    }
  }
}
