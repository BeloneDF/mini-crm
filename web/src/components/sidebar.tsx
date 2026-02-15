import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Users, Target, Menu, X, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import type { GetProfileResponse } from '@/api/auth/get-profile'
import { useMutation } from '@tanstack/react-query'
import { signOut } from '@/api/auth/sign-out'
import { toast } from 'sonner'

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/leads', label: 'Leads', icon: Target },
  { href: '/contacts', label: 'Contatos', icon: Users },
]

export function SideBar({ user }: { user: GetProfileResponse }) {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const { mutate: logout } = useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      toast.success('Até logo!')
      navigate('/sign-in')
    },
    onError: () => {
      toast.error('Erro ao sair. Tente novamente.')
    },
  })

  return (
    <>
      <div className="flex items-center justify-between border-b border-sidebar-border bg-sidebar px-4 py-3 lg:hidden">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
            <Target className="h-4 w-4 text-sidebar-primary-foreground" />
          </div>
          <span className="text-base font-semibold text-sidebar-accent-foreground">
            Crm - Belone
          </span>
        </div>
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-md p-2 text-sidebar-foreground hover:bg-sidebar-accent"
          aria-label="Abrir menu"
        >
          {mobileOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
          onKeyDown={e => {
            if (e.key === 'Escape') setMobileOpen(false)
          }}
          role="button"
          tabIndex={0}
          aria-label="Fechar menu"
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-sidebar transition-transform duration-300 lg:static lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary">
            <Target className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-sidebar-accent-foreground">
              CRM - Belone
            </h1>
            <p className="text-xs text-sidebar-foreground">{user.name}</p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4" aria-label="Menu principal">
          <ul className="flex flex-col gap-1">
            {navItems.map(item => {
              const isActive =
                item.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(item.href)
              return (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                        : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                    )}
                  >
                    <item.icon className="h-5 w-5 shrink-0" />
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="px-3 py-4">
          <button
            onClick={() => logout()}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <LogOut className="h-5 w-5" />
            Sair
          </button>
        </div>

        <footer className="border-t border-sidebar-border px-6 py-4">
          <p className="text-xs text-sidebar-foreground">Prova Tecnica</p>
          <p className="text-xs text-sidebar-foreground/60">
            React + TypeScript
          </p>
        </footer>
      </aside>
    </>
  )
}
