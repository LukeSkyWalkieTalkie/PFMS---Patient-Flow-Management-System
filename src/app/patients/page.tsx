'use client'

import { useState } from 'react'
import { usePatients } from '@/hooks/usePatients'
import PatientSearchBar from '@/components/patients/PatientSearchBar'
import PatientTable from '@/components/patients/PatientTable'
import PatientForm from '@/components/patients/PatientForm'
import Pagination from '@/components/shared/Pagination'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import EmptyState from '@/components/shared/EmptyState'
import ExportCSVButton from '@/components/shared/ExportCSVButton'
import { PAGE_SIZE } from '@/lib/constants'

export default function PatientsPage() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [showCreate, setShowCreate] = useState(false)
  const { patients, totalCount, loading, refetch } = usePatients(search, page)

  const totalPages = Math.ceil(totalCount / PAGE_SIZE)

  const handleSearch = (value: string) => {
    setSearch(value)
    setPage(1)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Patient Master Index</h1>
        <div className="flex gap-2">
          <ExportCSVButton
            data={patients as unknown as Record<string, unknown>[]}
            columns={[
              { key: 'patient_code', header: 'Code' },
              { key: 'first_name', header: 'First Name' },
              { key: 'last_name', header: 'Last Name' },
              { key: 'date_of_birth', header: 'DOB' },
              { key: 'sex', header: 'Sex' },
              { key: 'contact_number', header: 'Contact' },
            ]}
            filename="patients.csv"
          />
          <button
            onClick={() => setShowCreate(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-clinical-600 px-4 py-2 text-sm font-medium text-white hover:bg-clinical-700"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Patient
          </button>
        </div>
      </div>

      <PatientSearchBar value={search} onChange={handleSearch} />

      {loading ? (
        <LoadingSpinner />
      ) : patients.length === 0 ? (
        <EmptyState
          title="No patients found"
          description={search ? 'Try adjusting your search terms' : 'Create your first patient to get started'}
        />
      ) : (
        <>
          <PatientTable patients={patients} />
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}

      <PatientForm isOpen={showCreate} onClose={() => setShowCreate(false)} onCreated={refetch} />
    </div>
  )
}
