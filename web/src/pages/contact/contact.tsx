import { Button } from '@/components/ui/button'
import { Plus, Users } from 'lucide-react'
import { ContactTable } from './components/contact-table'
import { lazy, Suspense, useState } from 'react'

const ContactFormDialog = lazy(() => import('./components/contact-dialog-form'))

export default function Contact() {
  const [createOpen, setCreateOpen] = useState(false)

  return (
    <main className="flex flex-col gap-6 p-4 md:p-8">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">
              Gerencie sua base de contatos
            </p>
            Contatos
          </div>
        </div>
        <Button onClick={() => setCreateOpen(true)} className="shrink-0">
          <Plus className="mr-2 h-4 w-4" />
          Novo Contato
        </Button>
      </section>
      <section>
        <ContactTable />
      </section>

      <Suspense fallback={null}>
        <ContactFormDialog open={createOpen} onOpenChange={setCreateOpen} />
      </Suspense>
    </main>
  )
}
