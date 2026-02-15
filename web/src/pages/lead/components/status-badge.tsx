import { cn } from '@/lib/utils'
import { LEAD_STATUS_CONFIG, type LeadStatus } from '@/utils/types'

export function StatusBadge({ status }: { status: LeadStatus }) {
  const config = LEAD_STATUS_CONFIG[status]
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold',
        config.color,
        config.bgColor
      )}
    >
      {config.label}
    </span>
  )
}
