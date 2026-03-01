'use client'

import { useState, useEffect } from 'react'
import Modal from '@/components/shared/Modal'
import { StatusBadge } from '@/components/shared/Badge'
import { Visit, Section, Bed, VisitStatus } from '@/types'
import { ALLOWED_TRANSITIONS, STATUS_DISPLAY } from '@/lib/constants'
import { updateVisit } from '@/hooks/useVisits'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase/client'

export default function VisitForm({
  visit,
  sections,
  isOpen,
  onClose,
  onUpdated,
}: {
  visit: Visit | null
  sections: Section[]
  isOpen: boolean
  onClose: () => void
  onUpdated: () => void
}) {
  const { clinicianName } = useAuth()
  const [form, setForm] = useState({
    presenting_complaint: '',
    provisional_diagnosis: '',
    condition_category: '',
    attending_doctor: '',
    current_section_id: '',
    current_bed_id: '',
  })
  const [beds, setBeds] = useState<Bed[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (visit) {
      setForm({
        presenting_complaint: visit.presenting_complaint || '',
        provisional_diagnosis: visit.provisional_diagnosis || '',
        condition_category: visit.condition_category || '',
        attending_doctor: visit.attending_doctor || '',
        current_section_id: visit.current_section_id || '',
        current_bed_id: visit.current_bed_id || '',
      })
      if (visit.current_section_id) fetchBeds(visit.current_section_id)
    }
  }, [visit])

  const fetchBeds = async (sectionId: string) => {
    const { data } = await supabase
      .from('beds')
      .select('*')
      .eq('section_id', sectionId)
      .eq('is_active', true)
      .order('bed_number')
    setBeds((data as Bed[]) || [])
  }

  const handleSectionChange = (sectionId: string) => {
    setForm({ ...form, current_section_id: sectionId, current_bed_id: '' })
    if (sectionId) fetchBeds(sectionId)
    else setBeds([])
  }

  const handleStatusTransition = async (newStatus: VisitStatus) => {
    if (!visit || !clinicianName) return
    setSaving(true)
    setError('')
    try {
      await updateVisit(
        visit.id,
        { visit_status: newStatus },
        visit.version_number,
        clinicianName
      )
      onUpdated()
      onClose()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update status')
    } finally {
      setSaving(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!visit || !clinicianName) return
    setSaving(true)
    setError('')
    try {
      await updateVisit(
        visit.id,
        {
          presenting_complaint: form.presenting_complaint || null,
          provisional_diagnosis: form.provisional_diagnosis || null,
          condition_category: form.condition_category || null,
          attending_doctor: form.attending_doctor || null,
          current_section_id: form.current_section_id || null,
          current_bed_id: form.current_bed_id || null,
        },
        visit.version_number,
        clinicianName
      )
      onUpdated()
      onClose()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update visit')
    } finally {
      setSaving(false)
    }
  }

  if (!visit) return null

  const allowedTransitions = ALLOWED_TRANSITIONS[visit.visit_status]

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Visit" size="lg">
      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>
      )}

      {/* Status transition buttons */}
      <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
        <div className="mb-2 flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Current Status:</span>
          <StatusBadge status={visit.visit_status} />
          <span className="text-xs text-gray-400">v{visit.version_number}</span>
        </div>
        {allowedTransitions.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-500">Transition to:</span>
            {allowedTransitions.map((status) => (
              <button
                key={status}
                onClick={() => handleStatusTransition(status)}
                disabled={saving}
                className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                {STATUS_DISPLAY[status]}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Edit form */}
      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Presenting Complaint</label>
          <textarea
            value={form.presenting_complaint}
            onChange={(e) => setForm({ ...form, presenting_complaint: e.target.value })}
            rows={2}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-clinical-500 focus:outline-none focus:ring-2 focus:ring-clinical-500/20"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Provisional Diagnosis</label>
            <input
              type="text"
              value={form.provisional_diagnosis}
              onChange={(e) => setForm({ ...form, provisional_diagnosis: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-clinical-500 focus:outline-none focus:ring-2 focus:ring-clinical-500/20"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Condition Category</label>
            <input
              type="text"
              value={form.condition_category}
              onChange={(e) => setForm({ ...form, condition_category: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-clinical-500 focus:outline-none focus:ring-2 focus:ring-clinical-500/20"
            />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Attending Doctor</label>
          <input
            type="text"
            value={form.attending_doctor}
            onChange={(e) => setForm({ ...form, attending_doctor: e.target.value })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-clinical-500 focus:outline-none focus:ring-2 focus:ring-clinical-500/20"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Section</label>
            <select
              value={form.current_section_id}
              onChange={(e) => handleSectionChange(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-clinical-500 focus:outline-none focus:ring-2 focus:ring-clinical-500/20"
            >
              <option value="">No Section</option>
              {sections.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Bed</label>
            <select
              value={form.current_bed_id}
              onChange={(e) => setForm({ ...form, current_bed_id: e.target.value })}
              disabled={!form.current_section_id}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-clinical-500 focus:outline-none focus:ring-2 focus:ring-clinical-500/20 disabled:bg-gray-100"
            >
              <option value="">No Bed</option>
              {beds.map((b) => (
                <option key={b.id} value={b.id}>{b.bed_number}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-clinical-600 px-4 py-2 text-sm font-medium text-white hover:bg-clinical-700 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
