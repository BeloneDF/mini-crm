import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { StatusBadge } from '@/pages/lead/components/status-badge'
import type { LeadWithContact } from '@/utils/types'
import dayjs from 'dayjs'
import { ArrowRight, Building, Clock, User } from 'lucide-react'
import { Link } from 'react-router-dom'

export function DashboardRecentLeads({
  leads,
  loading,
}: {
  leads: LeadWithContact[] | undefined
  loading: boolean
}) {
  return (
    <Card>
      <CardContent>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base text-foreground">
            Leads Recentes
          </CardTitle>
          <Link
            to="/leads"
            className="inline-flex items-center text-sm text-primary hover:underline"
          >
            Ver todos
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </CardHeader>
        {loading ? (
          <div className="flex flex-col gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={`skel-${i}`} className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="mb-1 h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
            ))}
          </div>
        ) : !leads || leads.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Nenhum lead ainda.
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {leads.slice(0, 5).map(lead => (
              <div key={lead.id} className="flex items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold text-muted-foreground">
                  {lead.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">
                    {lead.name}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <User className="h-3 w-3" />
                    {lead.contact.name}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Building className="h-3 w-3" />
                    {lead.company}
                    <span className="mx-1">-</span>
                    <Clock className="h-3 w-3" />
                    {dayjs(lead.createdAt).locale('pt-br').format('DD/MM/YYYY')}
                  </div>
                </div>
                <StatusBadge status={lead.status} />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
