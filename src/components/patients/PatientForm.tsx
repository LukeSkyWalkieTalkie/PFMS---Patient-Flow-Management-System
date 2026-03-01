'use client'

import { useState } from 'react'
import Modal from '@/components/shared/Modal'
import { createPatient } from '@/hooks/usePatients'

export default function PatientForm({
  isOpen,
  onClose,
  onCreated,
}: {
  isOpen: boolean
  onClose: () => void
  onCreated: () => void
}) {
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    date_of_birth: '',
    sex: 'Male' as 'Male' | 'Female' | 'Other',
    contact_number: '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      await createPatient({
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        date_of_birth: form.date_of_birth,
        sex: form.sex,
        contact_number: form.contact_number.trim() || undefined,
      })
      setForm({ first_name: '', last_name: '', date_of_birth: '', sex: 'Male', contact_number: '' })
      onCreated()
      onClose()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create patient')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="New Patient">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>
        )}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">First Name</label>
            <input
              type="text"
              required
              value={form.first_name}
              onChange={(e) => setForm({ ...form, first_name: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-clinical-500 focus:outline-none focus:ring-2 focus:ring-clinical-500/20"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Last Name</label>
            <input
              type="text"
              required
              value={form.last_name}
              onChange={(e) => setForm({ ...form, last_name: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-clinical-500 focus:outline-none focus:ring-2 focus:ring-clinical-500/20"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Date of Birth</label>
            <input
              type="date"
              required
              value={form.date_of_birth}
              onChange={(e) => setForm({ ...form, date_of_birth: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-clinical-500 focus:outline-none focus:ring-2 focus:ring-clinical-500/20"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Sex</label>
            <select
              value={form.sex}
              onChange={(e) => setForm({ ...form, sex: e.target.value as 'Male' | 'Female' | 'Other' })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-clinical-500 focus:outline-none focus:ring-2 focus:ring-clinical-500/20"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Contact Number</label>
          <input
            type="text"
            value={form.contact_number}
            onChange={(e) => setForm({ ...form, contact_number: e.target.value })}
            placeholder="Optional"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-clinical-500 focus:outline-none focus:ring-2 focus:ring-clinical-500/20"
          />
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
            {saving ? 'Creating...' : 'Create Patient'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
