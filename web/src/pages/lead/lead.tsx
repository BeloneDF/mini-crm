import { Button } from '@/components/ui/button'
import { Plus, Target } from 'lucide-react'
import { lazy, Suspense, useState } from 'react'
import { LeadTable } from './components/lead-table'

const LeadDialogForm = lazy(() => import('./components/lead-dialog-form'))

export default function Lead() {
  const [createOpen, setCreateOpen] = useState(false)

  return (
    <main className="flex flex-col gap-6 p-4 md:p-8">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Target className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Gerencie seus Leads</p>
            Leads
          </div>
        </div>
        <Button onClick={() => setCreateOpen(true)} className="shrink-0">
          <Plus className="mr-2 h-4 w-4" />
          Adicionar novo Lead
        </Button>
      </section>

      <section>
        <LeadTable />
      </section>

      <Suspense fallback={<div>Carregando...</div>}>
        <LeadDialogForm open={createOpen} onOpenChange={setCreateOpen} />
      </Suspense>
    </main>
  )
}
