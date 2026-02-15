import { Skeleton } from '../ui/skeleton'

export function MajorFallbackSkeleton() {
  return (
    <div className="flex-1 p-6 space-y-6 animate-pulse">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48 rounded-md" />
        <Skeleton className="h-8 w-32 rounded-md" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Skeleton className="h-32 rounded-xl" />
        <Skeleton className="h-32 rounded-xl" />
        <Skeleton className="h-32 rounded-xl" />
      </div>

      <Skeleton className="h-64 w-full rounded-xl" />
    </div>
  )
}
