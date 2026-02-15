import type { DashboardRepository } from '@/domain/repositories/dashboard-repository'
import type { Dashboard } from '@/shared/utils/types'

export class GetDashboardUseCase {
  constructor(private dashboardRepository: DashboardRepository) {}

  async execute(): Promise<Dashboard> {
    return this.dashboardRepository.fetchAll()
  }
}
