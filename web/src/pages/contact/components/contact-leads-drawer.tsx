import { getLeadsByContactId } from '@/api/leads/get-leads-by-contact-id'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import { StatusBadge } from '@/pages/lead/components/status-badge'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { Mail, Phone, Target } from 'lucide-react'

export default function ContactLeadsDrawer({
  contactId,
  open,
  onOpenChange,
}: {
  contactId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['contactLeads', contactId],
    queryFn: async () => getLeadsByContactId({ id: contactId }),
    enabled: !!open,
    staleTime: 0,
  })

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger
        asChild
        className="flex w-full items-center rounded-md px-2 py-1 text-sm hover:bg-muted hover:text-indigo-900 border cursor-pointer"
      >
        <Button>
          <Target className="mr-2 h-4 w-4" />
          Ver leads
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-medium">
              {data?.contact?.name.charAt(0).toUpperCase()}
            </div>
            {data?.contact?.name}
          </SheetTitle>
          <SheetDescription>Leads vinculados a este contato</SheetDescription>
        </SheetHeader>

        {data?.contact && (
          <div className="mt-4 flex flex-col gap-2 rounded-lg border bg-muted/50 p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4 shrink-0" />
              {data.contact.email}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="h-4 w-4 shrink-0" />
              {data.contact.phone}
            </div>
          </div>
        )}

        <div className="mt-6 flex flex-col gap-3 max-h-[70dvh]  overflow-auto">
          <h3 className="text-sm font-semibold text-foreground">
            Leads ({isLoading || isFetching ? '...' : data?.leads?.length || 0})
          </h3>

          {isLoading ||
            (isFetching && (
              <div className="flex flex-col gap-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={`skel-${i}`} className="rounded-lg border p-4">
                    <Skeleton className="mb-2 h-4 w-32" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                ))}
              </div>
            ))}

          {!isLoading &&
            !isFetching &&
            data?.leads &&
            data.leads.length === 0 && (
              <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                Nenhum lead vinculado a este contato.
              </p>
            )}

          {!isLoading &&
            !isFetching &&
            data?.leads &&
            data.leads.map(lead => (
              <div key={lead.id} className="rounded-lg border bg-card p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-foreground">{lead.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {lead.company}
                    </p>
                  </div>
                  <StatusBadge status={lead.status} />
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  {dayjs(lead.createdAt).format('DD MMM YYYY')}
                </p>
              </div>
            ))}
        </div>
      </SheetContent>
    </Sheet>
  )
}
