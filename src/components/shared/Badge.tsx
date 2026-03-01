import { STATUS_COLORS, STATUS_DISPLAY } from '@/lib/constants'
import { VisitStatus } from '@/types'

export function StatusBadge({ status }: { status: VisitStatus }) {
  const colors = STATUS_COLORS[status]
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colors.bg} ${colors.text}`}>
      {STATUS_DISPLAY[status]}
    </span>
  )
}

export function WarningBadge({
  type,
}: {
  type: 'overwrite' | 'multi_clinician'
}) {
  if (type === 'overwrite') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-medium text-orange-800">
        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        Overwrite
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
      <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
      </svg>
      Multi-clinician
    </span>
  )
}
