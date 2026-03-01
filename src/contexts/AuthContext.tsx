'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface AuthContextType {
  clinicianName: string | null
  setClinicianName: (name: string) => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType>({
  clinicianName: null,
  setClinicianName: () => {},
  isLoading: true,
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [clinicianName, setName] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('pfms_clinician_name')
    if (stored) setName(stored)
    setIsLoading(false)
  }, [])

  const setClinicianName = (name: string) => {
    localStorage.setItem('pfms_clinician_name', name)
    setName(name)
  }

  return (
    <AuthContext.Provider value={{ clinicianName, setClinicianName, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
