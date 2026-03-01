'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Visit } from '@/types'
import Pagination from '@/components/shared/Pagination'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import EmptyState from '@/components/shared/EmptyState'
import ExportCSVButton from '@/components/shared/ExportCSVButton'
import { formatDate, formatDateTime } from '@/lib/formatters'
import { PAGE_SIZE } from '@/lib/constants'

export default function DischargesPage() {
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [page, setPage] = useState(1)
  const [visits, setVisits] = useState<Visit[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(true)

  const fetchDischarges = useCallback(async () => {
    setLoading(true)
    let query = supabase
      .from('visits')
      .select('*, patients!inner(*), sections:current_section_id(*)', { count: 'exact' })
      .eq('visit_status', 'Discharged')
      .order('discharged_at', { ascending: false })

    if (dateFrom) query = query.gte('discharged_at', `${dateFrom}T00:00:00`)
    if (dateTo) query = query.lte('discharged_at', `${dateTo}T23:59:59`)

    const from = (page - 1) * PAGE_SIZE
    query = query.range(from, from + PAGE_SIZE - 1)

    const { data, count } = await query
    setVisits((data as Visit[]) || [])
    setTotalCount(count || 0)
    setLoading(false)
  }, [dateFrom, dateTo, page])

  useEffect(() => {
    fetchDischarges()
  }, [fetchDischarges])

  const totalPages = Math.ceil(totalCount / PAGE_SIZE)

  const exportData = useMemo(
    () =>
      visits.map((v) => ({
        patient_code: v.patients?.patient_code || '',
        patient_name: v.patients ? `${v.patients.first_name} ${v.patients.last_name}` : '',
        section: v.sections?.name || '',
        diagnosis: v.provisional_diagnosis || '',
        complaint: v.presenting_complaint || '',
        doctor: v.attending_doctor || '',
        admitted_at: v.admitted_at || '',
        discharged_at: v.discharged_at || '',
      })),
    [visits]
  )

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Discharge Summary</h1>
        <ExportCSVButton
          data={exportData}
          columns={[
            { key: 'patient_code', header: 'Patient Code' },
            { key: 'patient_name', header: 'Patient Name' },
            { key: 'section', header: 'Section' },
            { key: 'diagnosis', header: 'Diagnosis' },
            { key: 'complaint', header: 'Complaint' },
            { key: 'doctor', header: 'Doctor' },
            { key: 'admitted_at', header: 'Admitted' },
            { key: 'discharged_at', header: 'Discharged' },
          ]}
          filename="discharges.csv"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">From:</label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => { setDateFrom(e.target.value); setPage(1) }}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-clinical-500 focus:outline-none focus:ring-2 focus:ring-clinical-500/20"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">To:</label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => { setDateTo(e.target.value); setPage(1) }}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-clinical-500 focus:outline-none focus:ring-2 focus:ring-clinical-500/20"
          />
        </div>
        {(dateFrom || dateTo) && (
          <button
            onClick={() => { setDateFrom(''); setDateTo(''); setPage(1) }}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Clear dates
          </button>
        )}
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : visits.length === 0 ? (
        <EmptyState title="No discharges found" description="Adjust the date range or check back later" />
      ) : (
        <>
          <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Patient</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Section</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Diagnosis</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Doctor</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Admitted</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Discharged</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {visits.map((v) => (
                  <tr key={v.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-4 py-3 text-sm">
                      <p className="font-medium text-gray-900">
                        {v.patients ? `${v.patients.first_name} ${v.patients.last_name}` : '—'}
                      </p>
                      <p className="text-xs text-gray-500">{v.patients?.patient_code}</p>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                      {v.sections?.name || '—'}
                    </td>
                    <td className="max-w-xs truncate px-4 py-3 text-sm text-gray-500">
                      {v.provisional_diagnosis || '—'}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                      {v.attending_doctor || '—'}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                      {formatDate(v.admitted_at)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                      {formatDateTime(v.discharged_at)}
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
