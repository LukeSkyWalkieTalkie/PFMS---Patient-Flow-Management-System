'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'

export default function NameModal() {
  const { clinicianName, setClinicianName, isLoading } = useAuth()
  const [name, setName] = useState('')

  if (isLoading || clinicianName) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = name.trim()
    if (trimmed) setClinicianName(trimmed)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="mx-4 w-full max-w-md rounded-xl bg-white p-8 shadow-2xl">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-clinical-100">
            <svg className="h-8 w-8 text-clinical-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900">Welcome to PFMS</h2>
          <p className="mt-1 text-sm text-gray-500">Enter your name to continue</p>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Dr. Jane Smith"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-clinical-500 focus:outline-none focus:ring-2 focus:ring-clinical-500/20"
            autoFocus
          />
          <button
            type="submit"
            disabled={!name.trim()}
            className="mt-4 w-full rounded-lg bg-clinical-600 px-4 py-3 font-medium text-white transition hover:bg-clinical-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  )
}
