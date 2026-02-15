import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { leadStatusValues } from '@/pages/lead/schema/lead-schema'
import type { LeadStatus } from '@/utils/types'

type StatsItem = {
  status: LeadStatus
  count: number
  percentage: number
}

const LEAD_STATUS_CONFIG: Record<LeadStatus, { label: string; color: string }> =
  {
    novo: { label: 'Novo', color: 'bg-blue-500' },
    contactado: { label: 'Contactado', color: 'bg-amber-500' },
    qualificado: { label: 'Qualificado', color: 'bg-cyan-500' },
    convertido: { label: 'Convertido', color: 'bg-emerald-500' },
    perdido: { label: 'Perdido', color: 'bg-rose-500' },
  }

export function DashboardStatusDistribuition({
  stats,
  loading,
}: {
  stats: StatsItem[] | undefined
  loading: boolean
}) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Distribuição de Leads por Status
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col gap-3">
          {Array.from({ length: leadStatusValues.length }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-full" />
          ))}
        </CardContent>
      </Card>
    )
  }

  const statsMap = Object.fromEntries(
    stats?.map(s => [s.status, s]) ?? []
  ) as Partial<Record<LeadStatus, StatsItem>>

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base text-foreground">
          Distribuição de Leads por STATUS
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-3">
        {leadStatusValues.map(status => {
          const item = statsMap[status]
          const count = item?.count ?? 0
          const pct = item ? Math.round(item.percentage * 100) : 0
          const config = LEAD_STATUS_CONFIG[status]

          return (
            <div key={status} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{config.label}</span>

                <span className="text-sm text-muted-foreground">
                  {count} ({pct}%)
                </span>
              </div>

              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${config.color}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
