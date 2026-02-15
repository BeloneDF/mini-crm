import type { Dashboard } from '@/domain/entities/dashboard.js'

export interface DashboardRepository {
  fetchAll(): Promise<Dashboard>
}
