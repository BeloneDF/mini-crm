import { MajorFallbackSkeleton } from '@/components/fallback/major-fallback-skeleton'
import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'

export default function AuthLayout() {
  return (
    <Suspense fallback={<MajorFallbackSkeleton />}>
      <div className="min-h-screen ">
        <div className="flex flex-col items-center justify-center relative p-5 md:p-0">
          <Outlet />
        </div>
      </div>
    </Suspense>
  )
}
