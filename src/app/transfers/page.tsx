'use client'

import { useState, useMemo } from 'react'
import { useTransfers } from '@/hooks/useTransfers'
import { useSections } from '@/hooks/useSections'
import Pagination from '@/components/shared/Pagination'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import EmptyState from '@/components/shared/EmptyState'
import ExportCSVButton from '@/components/shared/ExportCSVButton'
import { formatDateTime } from '@/lib/formatters'
import { PAGE_SIZE } from '@/lib/constants'

export default function TransfersPage() {
  const [sectionId, setSectionId] = useState<string | undefined>()
  const [page, setPage] = useState(1)
  const { transfers, totalCount, loading } = useTransfers(sectionId, page)
  const { sections } = useSections()

  const totalPages = Math.ceil(totalCount / PAGE_SIZE)

  const exportData = useMemo(
    () =>
      transfers.map((t) => ({
        patient_code: t.visits?.patients?.patient_code || '',
        patient_name: t.visits?.patients
          ? `${t.visits.patients.first_name} ${t.visits.patients.last_name}`
          : '',
        from_section: t.from_section?.name || '—',
        from_bed: t.from_bed?.bed_number || '—',
        to_section: t.to_section?.name || '—',
        to_bed: t.to_bed?.bed_number || '—',
        transferred_by: t.transferred_by || '—',
        transferred_at: t.transferred_at,
      })),
    [transfers]
  )

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Transfer Log</h1>
        <ExportCSVButton
          data={exportData}
          columns={[
            { key: 'patient_code', header: 'Patient Code' },
            { key: 'patient_name', header: 'Patient Name' },
            { key: 'from_section', header: 'From Section' },
            { key: 'from_bed', header: 'From Bed' },
            { key: 'to_section', header: 'To Section' },
            { key: 'to_bed', header: 'To Bed' },
            { key: 'transferred_by', header: 'Transferred By' },
            { key: 'transferred_at', header: 'Date/Time' },
          ]}
          filename="transfers.csv"
        />
      </div>

      <div>
        <select
          value={sectionId || ''}
          onChange={(e) => { setSectionId(e.target.value || undefined); setPage(1) }}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-clinical-500 focus:outline-none focus:ring-2 focus:ring-clinical-500/20"
        >
          <option value="">All Sections</option>
          {sections.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : transfers.length === 0 ? (
        <EmptyState title="No transfers found" />
      ) : (
        <>
          <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Date/Time</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Patient</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">From</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">To</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {transfers.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                      {formatDateTime(t.transferred_at)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm">
                      <p className="font-medium text-gray-900">
                        {t.visits?.patients
                          ? `${t.visits.patients.first_name} ${t.visits.patients.last_name}`
                          : '—'}
                      </p>
                      <p className="text-xs text-gray-500">{t.visits?.patients?.patient_code}</p>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                      {t.from_section?.name || '—'}
                      {t.from_bed && <span className="text-gray-400"> / {t.from_bed.bed_number}</span>}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900 font-medium">
                      {t.to_section?.name || '—'}
                      {t.to_bed && <span className="text-gray-500 font-normal"> / {t.to_bed.bed_number}</span>}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                      {t.transferred_by || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  )
}
