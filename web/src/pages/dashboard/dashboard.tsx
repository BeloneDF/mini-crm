import { getDashboard } from '@/api/dashboard/get-dashboard'
import { useQuery } from '@tanstack/react-query'
import { LayoutDashboard, Target, TrendingUp, Users } from 'lucide-react'
import {
  DashboardCard,
  type DashboardCardProps,
} from './components/dashboard-cards'
import { DashboardStatusDistribuition } from './components/dashboard-status-distribuition'
import { DashboardRecentLeads } from './components/dashboard-recent-leads'

export default function Dashboard() {
  const { data: dasboardData, isLoading: isLoadingDashboard } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => getDashboard(),
    staleTime: 0,
  })

  const DASHBOARD_CARDS: DashboardCardProps[] = [
    {
      title: 'Total de Leads',
      value: dasboardData?.totalLeads,
      description: 'Leads Cadastrados no sistema',
      loading: isLoadingDashboard,
      icon: Target,
    },
    {
      title: 'Total de Contatos',
      value: dasboardData?.totalContacts,
      description: 'Contatos Cadastrados no sistema',
      loading: isLoadingDashboard,
      icon: Users,
    },
    {
      title: 'Taxa de Conversão',
      value: dasboardData
        ? `${(dasboardData.conversionRate * 100).toFixed(2)}%`
        : `-`,
      description: 'Percentual convertidos',
      loading: isLoadingDashboard,
      icon: TrendingUp,
    },
  ]

  return (
    <main className="flex flex-col gap-6 p-4 md:p-8">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <LayoutDashboard className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">
              Visualize as métricas e o desempenho do seu funil de vendas
            </p>
            Dashboard
          </div>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {DASHBOARD_CARDS.map(card => (
          <DashboardCard key={card.title} {...card} />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <DashboardStatusDistribuition
          stats={dasboardData?.leadsByStatus}
          loading={isLoadingDashboard}
        />
        <DashboardRecentLeads
          leads={dasboardData?.recentLeads}
          loading={isLoadingDashboard}
        />
      </div>
    </main>
  )
}
