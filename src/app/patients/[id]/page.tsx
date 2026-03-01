'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import { Patient, Visit } from '@/types'
import { formatDate } from '@/lib/formatters'
import VisitHistory from '@/components/patients/VisitHistory'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import Modal from '@/components/shared/Modal'

export default function PatientDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { clinicianName } = useAuth()
  const [patient, setPatient] = useState<Patient | null>(null)
  const [visits, setVisits] = useState<Visit[]>([])
  const [loading, setLoading] = useState(true)
  const [showNewVisit, setShowNewVisit] = useState(false)
  const [visitForm, setVisitForm] = useState({ presenting_complaint: '', attending_doctor: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function fetchData() {
      const [patientRes, visitsRes] = await Promise.all([
        supabase.from('patients').select('*').eq('id', id).single(),
        supabase
          .from('visits')
          .select('*, sections:current_section_id(*), beds:current_bed_id(*)')
          .eq('patient_id', id)
          .order('visit_number', { ascending: false }),
      ])
      setPatient(patientRes.data as Patient | null)
      setVisits((visitsRes.data as Visit[]) || [])
      setLoading(false)
    }
    fetchData()
  }, [id])

  const handleCreateVisit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const nextVisitNumber = visits.length > 0 ? Math.max(...visits.map((v) => v.visit_number)) + 1 : 1
    const { error } = await supabase.from('visits').insert({
      patient_id: id,
      visit_number: nextVisitNumber,
      visit_status: 'Registered',
      presenting_complaint: visitForm.presenting_complaint || null,
      attending_doctor: visitForm.attending_doctor || null,
      created_by: clinicianName,
      updated_by: clinicianName,
    })
    if (!error) {
      const { data } = await supabase
        .from('visits')
        .select('*, sections:current_section_id(*), beds:current_bed_id(*)')
        .eq('patient_id', id)
        .order('visit_number', { ascending: false })
      setVisits((data as Visit[]) || [])
      setShowNewVisit(false)
      setVisitForm({ presenting_complaint: '', attending_doctor: '' })
    }
    setSaving(false)
  }

  if (loading) return <LoadingSpinner />
  if (!patient) {
    return (
      <div className="py-12 text-center text-gray-500">
        Patient not found.{' '}
        <button onClick={() => router.push('/patients')} className="text-clinical-600 hover:underline">
          Back to patients
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => router.push('/patients')}
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to patients
      </button>

      {/* Patient info card */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">
                {patient.first_name} {patient.last_name}
              </h1>
              <span className="rounded-full bg-clinical-100 px-3 py-0.5 text-sm font-medium text-clinical-700">
                {patient.patient_code}
              </span>
            </div>
            <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-500">
              <span>DOB: {formatDate(patient.date_of_birth)}</span>
              <span>Sex: {patient.sex}</span>
              {patient.contact_number && <span>Contact: {patient.contact_number}</span>}
            </div>
          </div>
          <button
            onClick={() => setShowNewVisit(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-clinical-600 px-4 py-2 text-sm font-medium text-white hover:bg-clinical-700"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Visit
          </button>
        </div>
      </div>

      {/* Visit history */}
      <div>
        <h2 className="mb-3 text-lg font-semibold text-gray-900">Visit History</h2>
        <VisitHistory visits={visits} />
      </div>

      {/* New visit modal */}
      <Modal isOpen={showNewVisit} onClose={() => setShowNewVisit(false)} title="Register New Visit">
        <form onSubmit={handleCreateVisit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Presenting Complaint</label>
            <textarea
              value={visitForm.presenting_complaint}
              onChange={(e) => setVisitForm({ ...visitForm, presenting_complaint: e.target.value })}
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-clinical-500 focus:outline-none focus:ring-2 focus:ring-clinical-500/20"
              placeholder="Describe the presenting complaint..."
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Attending Doctor</label>
            <input
              type="text"
              value={visitForm.attending_doctor}
              onChange={(e) => setVisitForm({ ...visitForm, attending_doctor: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-clinical-500 focus:outline-none focus:ring-2 focus:ring-clinical-500/20"
              placeholder="Doctor name"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowNewVisit(false)}
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-clinical-600 px-4 py-2 text-sm font-medium text-white hover:bg-clinical-700 disabled:opacity-50"
            >
              {saving ? 'Registering...' : 'Register Visit'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
