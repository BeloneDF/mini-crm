import type { Dashboard } from '@/shared/utils/types.js'

export interface DashboardRepository {
  fetchAll(): Promise<Dashboard>
}
