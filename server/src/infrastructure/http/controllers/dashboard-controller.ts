import type { GetDashboardUseCase } from '@/applications/use-cases/dashboard/get-dashboard'
import type { Context } from 'hono'
import z from 'zod'

export class DashboardController {
  constructor(private getDashboard: GetDashboardUseCase) {}

  async list(c: Context) {
    try {
      const dashboardData = await this.getDashboard.execute()

      return c.json(dashboardData)
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
}
