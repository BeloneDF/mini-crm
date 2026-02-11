import { SideBar } from '../sidebar'
import { Skeleton } from '../ui/skeleton'

export function MajorFallbackSkeleton() {
  return (
    <>
      <SideBar />
      <div className="h-[calc(100svh-128px)] flex flex-col rounded-md gap-4">
        <Skeleton className="w-full h-full" />
      </div>
    </>
  )
}
