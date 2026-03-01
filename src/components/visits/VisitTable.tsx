'use client'

import { Visit } from '@/types'
import { StatusBadge, WarningBadge } from '@/components/shared/Badge'
import { formatDateTime, getFullName } from '@/lib/formatters'

export default function VisitTable({
  visits,
  onEdit,
  sortField,
  sortAsc,
  onSort,
}: {
  visits: Visit[]
  onEdit: (visit: Visit) => void
  sortField: string
  sortAsc: boolean
  onSort: (field: string) => void
}) {
  const SortHeader = ({ field, label }: { field: string; label: string }) => (
    <th
      className="cursor-pointer px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 hover:text-gray-700"
      onClick={() => onSort(field)}
    >
      <div className="flex items-center gap-1">
        {label}
        {sortField === field && (
          <svg className={`h-3 w-3 ${sortAsc ? '' : 'rotate-180'}`} fill="currentColor" viewBox="0 0 20 20">
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
          </svg>
        )}
      </div>
    </th>
  )

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <SortHeader field="patients.last_name" label="Patient" />
            <SortHeader field="visit_status" label="Status" />
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Section</th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Bed</th>
            <SortHeader field="attending_doctor" label="Doctor" />
            <SortHeader field="created_at" label="Created" />
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Flags</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {visits.map((visit) => (
            <tr key={visit.id} className="hover:bg-gray-50">
              <td className="whitespace-nowrap px-4 py-3 text-sm">
                <div>
                  <p className="font-medium text-gray-900">
                    {visit.patients ? getFullName(visit.patients.first_name, visit.patients.last_name) : '—'}
                  </p>
                  <p className="text-xs text-gray-500">{visit.patients?.patient_code}</p>
                </div>
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm">
                <StatusBadge status={visit.visit_status} />
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                {visit.sections?.name || '—'}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                {visit.beds?.bed_number || '—'}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                {visit.attending_doctor || '—'}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                {formatDateTime(visit.created_at)}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm">
                <div className="flex gap-1">
                  {visit.version_number > 2 && <WarningBadge type="overwrite" />}
                </div>
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-right text-sm">
                <button
                  onClick={() => onEdit(visit)}
                  className="font-medium text-clinical-600 hover:text-clinical-800"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
