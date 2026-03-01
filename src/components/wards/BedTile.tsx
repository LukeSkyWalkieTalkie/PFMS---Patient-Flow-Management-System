'use client'

import { Visit } from '@/types'
import { STATUS_COLORS, ACTIVE_STATUSES } from '@/lib/constants'
import { getInitials } from '@/lib/formatters'

export default function BedTile({
  bedNumber,
  visit,
  style,
  onClick,
}: {
  bedNumber: string
  visit: Visit | null
  style: React.CSSProperties
  onClick: () => void
}) {
  const isOccupied = visit && ACTIVE_STATUSES.includes(visit.visit_status)
  const colors = isOccupied
    ? STATUS_COLORS[visit!.visit_status]
    : { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-400' }

  return (
    <button
      onClick={onClick}
      style={style}
      className={`flex flex-col items-center justify-center rounded-lg border-2 p-2 transition hover:shadow-md ${colors.bg} ${colors.border}`}
    >
      <span className="text-xs font-medium text-gray-500">{bedNumber}</span>
      {isOccupied && visit?.patients ? (
        <span className={`mt-1 text-lg font-bold ${colors.text}`}>
          {getInitials(visit.patients.first_name, visit.patients.last_name)}
        </span>
      ) : (
        <span className="mt-1 text-xs text-gray-300">Empty</span>
      )}
    </button>
  )
}
