'use client'

import { useState, useMemo } from 'react'
import { useVisits } from '@/hooks/useVisits'
import { useSections } from '@/hooks/useSections'
import { Visit, VisitStatus } from '@/types'
import VisitFiltersComponent from '@/components/visits/VisitFilters'
import VisitTable from '@/components/visits/VisitTable'
import VisitForm from '@/components/visits/VisitForm'
import Pagination from '@/components/shared/Pagination'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import EmptyState from '@/components/shared/EmptyState'
import ExportCSVButton from '@/components/shared/ExportCSVButton'
import { PAGE_SIZE, STATUS_DISPLAY } from '@/lib/constants'

export default function VisitsPage() {
  const [filters, setFilters] = useState<{
    sectionId?: string
    status?: VisitStatus
    doctor?: string
    search?: string
    sortField?: string
    sortAsc?: boolean
  }>({ sortField: 'created_at', sortAsc: false })
  const [page, setPage] = useState(1)
  const [editVisit, setEditVisit] = useState<Visit | null>(null)

  const { visits, totalCount, loading, refetch } = useVisits(filters, page)
  const { sections } = useSections()

  const totalPages = Math.ceil(totalCount / PAGE_SIZE)

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters({ ...filters, ...newFilters })
    setPage(1)
  }

  const handleSort = (field: string) => {
    setFilters((prev) => ({
      ...prev,
      sortField: field,
      sortAsc: prev.sortField === field ? !prev.sortAsc : true,
    }))
  }

  const exportData = useMemo(
    () =>
      visits.map((v) => ({
        patient_code: v.patients?.patient_code || '',
        patient_name: v.patients ? `${v.patients.first_name} ${v.patients.last_name}` : '',
        visit_number: v.visit_number,
        status: STATUS_DISPLAY[v.visit_status],
        section: v.sections?.name || '',
        bed: v.beds?.bed_number || '',
        doctor: v.attending_doctor || '',
        complaint: v.presenting_complaint || '',
        diagnosis: v.provisional_diagnosis || '',
        created_at: v.created_at,
      })),
    [visits]
  )

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Visit Log</h1>
        <ExportCSVButton
          data={exportData}
          columns={[
            { key: 'patient_code', header: 'Patient Code' },
            { key: 'patient_name', header: 'Patient Name' },
            { key: 'visit_number', header: 'Visit #' },
            { key: 'status', header: 'Status' },
            { key: 'section', header: 'Section' },
            { key: 'bed', header: 'Bed' },
            { key: 'doctor', header: 'Doctor' },
            { key: 'complaint', header: 'Complaint' },
            { key: 'diagnosis', header: 'Diagnosis' },
            { key: 'created_at', header: 'Created' },
          ]}
          filename="visits.csv"
        />
      </div>

      <VisitFiltersComponent
        filters={filters}
        onChange={handleFilterChange}
        sections={sections}
      />

      {loading ? (
        <LoadingSpinner />
      ) : visits.length === 0 ? (
        <EmptyState title="No visits found" description="Adjust your filters or create a visit from the Patients page" />
      ) : (
        <>
          <VisitTable
            visits={visits}
            onEdit={setEditVisit}
            sortField={filters.sortField || 'created_at'}
            sortAsc={filters.sortAsc ?? false}
            onSort={handleSort}
          />
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}

      <VisitForm
        visit={editVisit}
        sections={sections}
        isOpen={!!editVisit}
        onClose={() => setEditVisit(null)}
        onUpdated={refetch}
      />
    </div>
  )
}
