'use client'

import { Visit } from '@/types'
import { StatusBadge, WarningBadge } from '@/components/shared/Badge'
import { formatDateTime } from '@/lib/formatters'

export default function VisitHistory({ visits }: { visits: Visit[] }) {
  if (visits.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
        No visits recorded
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Visit #</th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Section</th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Doctor</th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Complaint</th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Admitted</th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Discharged</th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Flags</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {visits.map((visit) => (
            <tr key={visit.id} className="hover:bg-gray-50">
              <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900">
                #{visit.visit_number}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm">
                <StatusBadge status={visit.visit_status} />
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                {visit.sections?.name || '—'}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                {visit.attending_doctor || '—'}
              </td>
              <td className="max-w-xs truncate px-4 py-3 text-sm text-gray-500">
                {visit.presenting_complaint || '—'}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                {formatDateTime(visit.admitted_at)}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                {formatDateTime(visit.discharged_at)}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm">
                <div className="flex gap-1">
                  {visit.version_number > 2 && <WarningBadge type="overwrite" />}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
