'use client'

import { Section, VisitStatus } from '@/types'
import { VISIT_STATUSES, STATUS_DISPLAY } from '@/lib/constants'

interface Filters {
  sectionId?: string
  status?: VisitStatus
  doctor?: string
  search?: string
}

export default function VisitFilters({
  filters,
  onChange,
  sections,
}: {
  filters: Filters
  onChange: (filters: Filters) => void
  sections: Section[]
}) {
  return (
    <div className="flex flex-wrap gap-3">
      <input
        type="text"
        value={filters.search || ''}
        onChange={(e) => onChange({ ...filters, search: e.target.value })}
        placeholder="Search patient name..."
        className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-clinical-500 focus:outline-none focus:ring-2 focus:ring-clinical-500/20"
      />
      <select
        value={filters.sectionId || ''}
        onChange={(e) => onChange({ ...filters, sectionId: e.target.value || undefined })}
        className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-clinical-500 focus:outline-none focus:ring-2 focus:ring-clinical-500/20"
      >
        <option value="">All Sections</option>
        {sections.map((s) => (
          <option key={s.id} value={s.id}>{s.name}</option>
        ))}
      </select>
      <select
        value={filters.status || ''}
        onChange={(e) => onChange({ ...filters, status: (e.target.value as VisitStatus) || undefined })}
        className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-clinical-500 focus:outline-none focus:ring-2 focus:ring-clinical-500/20"
      >
        <option value="">All Statuses</option>
        {VISIT_STATUSES.map((s) => (
          <option key={s} value={s}>{STATUS_DISPLAY[s]}</option>
        ))}
      </select>
      <input
        type="text"
        value={filters.doctor || ''}
        onChange={(e) => onChange({ ...filters, doctor: e.target.value })}
        placeholder="Filter by doctor..."
        className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-clinical-500 focus:outline-none focus:ring-2 focus:ring-clinical-500/20"
      />
    </div>
  )
}
