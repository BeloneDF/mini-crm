import type { GetProfileResponse } from '@/api/auth/get-profile'
import { SideBar } from '@/components/sidebar'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Outlet, useLoaderData } from 'react-router-dom'

export default function AppLayout() {
  const user = useLoaderData() as GetProfileResponse

  return (
    <TooltipProvider>
      <div className="flex min-h-screen flex-col lg:flex-row">
        <SideBar user={user} />
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </TooltipProvider>
  )
}
