'use client'

import Link from 'next/link'
import { Patient } from '@/types'
import { formatDate } from '@/lib/formatters'

export default function PatientTable({ patients }: { patients: Patient[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Code</th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Name</th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">DOB</th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Sex</th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Contact</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {patients.map((patient) => (
            <tr key={patient.id} className="hover:bg-gray-50">
              <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-clinical-600">
                {patient.patient_code}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">
                {patient.first_name} {patient.last_name}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                {formatDate(patient.date_of_birth)}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                {patient.sex}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                {patient.contact_number || '—'}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-right text-sm">
                <Link
                  href={`/patients/${patient.id}`}
                  className="font-medium text-clinical-600 hover:text-clinical-800"
                >
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
