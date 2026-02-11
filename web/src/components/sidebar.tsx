import { DashboardIcon } from '@radix-ui/react-icons'
import { useMutation } from '@tanstack/react-query'
import {
  AlignCenter,
  LogOut,
  Package,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from './ui/button'
import { signOut } from '@/api/sign-out'

export function SideBar() {
  const navigate = useNavigate()
  const location = useLocation()

  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: DashboardIcon, route: '/' },
    { id: 'lead', label: 'Leads', icon: AlignCenter, route: '/leads' },
    { id: 'contact', label: 'Contatos', icon: Package, route: '/contacts' },
  ]

  const { mutate: logoutFn } = useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      navigate('/sign-in')
      toast.success('Até breve!')
    },
  })

  const sidebarWidth = collapsed ? 'w-20' : 'w-64'

  return (
    <>
      {mobileOpen && (
        <Button
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        ></Button>
      )}

      <aside
        className={`
          fixed lg:static top-0 left-0 h-screen min-h-screen bg-sidebar
          flex flex-col justify-between z-40 transition-all duration-300
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${sidebarWidth}
        `}
      >
        <section>
          {/* HEADER */}
          <div className="p-6 border-b border-sidebar-border flex flex-col items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-transparent">
                <div
                  className="w-full h-full bg-contain bg-no-repeat bg-center"
                  style={{ backgroundImage: "url('logo.png')" }}
                  aria-label="logo"
                  role="img"
                />
              </div>
              {!collapsed && (
                <div className="transition-opacity">
                  <h1 className="text-lg font-bold text-sidebar-foreground">
                    Stock Hub
                  </h1>
                  <p className="text-xs text-zinc-300">
                    Armazenamento galax.ia
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={() => setCollapsed(!collapsed)}
              className="text-sidebar-foreground hover:text-white p-2 rounded-md "
            >
              {collapsed ? (
                <PanelLeftOpen size={20} />
              ) : (
                <div className="flex items-center gap-2">
                  <PanelLeftClose size={20} />
                  <span>Retrair</span>
                </div>
              )}
            </button>
          </div>

          <nav className="p-4 space-y-2">
            {menuItems.map(item => {
              const Icon = item.icon
              const isActive = location.pathname === item.route

              return (
                <Button
                  key={item.id}
                  onClick={() => {
                    navigate(item.route)
                    setMobileOpen(false)
                  }}
                  variant={isActive ? 'default' : 'ghost'}
                  className={`
                    w-full flex items-center cursor-pointer gap-3
                    ${collapsed ? 'justify-center px-3' : 'justify-start'}
                    ${
                      isActive
                        ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                        : 'text-sidebar-foreground hover:bg-sidebar-accent'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  {!collapsed && item.label}
                </Button>
              )
            })}
          </nav>
        </section>

        <section className="p-4">
          <Button
            onClick={() => logoutFn()}
            className="bg-sidebar-accent w-full flex gap-2 items-center cursor-pointer hover:bg-blue-950
            justify-center"
          >
            <LogOut className="h-4 w-4" />
            {!collapsed && <span>Sair</span>}
          </Button>

          <div className="h-6 w-full p-4 flex items-center gap-2 justify-center">
            {!collapsed && (
              <>
                <span className="text-zinc-400 text-xs">galax.ia</span>

                <span
                  className="w-5 h-5 inline-block bg-no-repeat bg-contain"
                  style={{ backgroundImage: "url('logo_andromeda.png')" }}
                  aria-label="logo_galax_ia"
                  role="img"
                />
              </>
            )}
          </div>
        </section>
      </aside>

      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-25 left-4 z-20 lg:hidden bg-sidebar text-white p-2 rounded-md shadow"
      >
        <PanelLeftOpen />
      </button>
    </>
  )
}
