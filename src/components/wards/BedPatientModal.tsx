'use client'

import Modal from '@/components/shared/Modal'
import { StatusBadge } from '@/components/shared/Badge'
import { Visit } from '@/types'
import { formatDate, formatDateTime, getFullName } from '@/lib/formatters'
import Link from 'next/link'

export default function BedPatientModal({
  visit,
  bedNumber,
  isOpen,
  onClose,
}: {
  visit: Visit | null
  bedNumber: string
  isOpen: boolean
  onClose: () => void
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Bed ${bedNumber}`}>
      {!visit || !visit.patients ? (
        <p className="text-sm text-gray-500">This bed is currently empty.</p>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {getFullName(visit.patients.first_name, visit.patients.last_name)}
              </h3>
              <p className="text-sm text-gray-500">{visit.patients.patient_code}</p>
            </div>
            <StatusBadge status={visit.visit_status} />
          </div>

          <div className="grid grid-cols-2 gap-3 rounded-lg bg-gray-50 p-4 text-sm">
            <div>
              <span className="text-gray-500">DOB:</span>{' '}
              <span className="font-medium">{formatDate(visit.patients.date_of_birth)}</span>
            </div>
            <div>
              <span className="text-gray-500">Sex:</span>{' '}
              <span className="font-medium">{visit.patients.sex}</span>
            </div>
            <div>
              <span className="text-gray-500">Doctor:</span>{' '}
              <span className="font-medium">{visit.attending_doctor || '—'}</span>
            </div>
            <div>
              <span className="text-gray-500">Admitted:</span>{' '}
              <span className="font-medium">{formatDateTime(visit.admitted_at)}</span>
            </div>
            {visit.presenting_complaint && (
              <div className="col-span-2">
                <span className="text-gray-500">Complaint:</span>{' '}
                <span className="font-medium">{visit.presenting_complaint}</span>
              </div>
            )}
            {visit.provisional_diagnosis && (
              <div className="col-span-2">
                <span className="text-gray-500">Diagnosis:</span>{' '}
                <span className="font-medium">{visit.provisional_diagnosis}</span>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <Link
              href={`/patients/${visit.patient_id}`}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              View Patient
            </Link>
          </div>
        </div>
      )}
    </Modal>
  )
}
