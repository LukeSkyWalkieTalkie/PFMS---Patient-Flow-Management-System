'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Patient } from '@/types'
import { PAGE_SIZE } from '@/lib/constants'

export function usePatients(search: string, page: number) {
  const [patients, setPatients] = useState<Patient[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(true)

  const fetchPatients = useCallback(async () => {
    setLoading(true)
    let query = supabase
      .from('patients')
      .select('*', { count: 'exact' })
      .eq('archived', false)
      .order('created_at', { ascending: false })

    if (search.trim()) {
      const term = `%${search.trim()}%`
      query = query.or(`first_name.ilike.${term},last_name.ilike.${term},patient_code.ilike.${term}`)
    }

    const from = (page - 1) * PAGE_SIZE
    query = query.range(from, from + PAGE_SIZE - 1)

    const { data, count } = await query
    setPatients((data as Patient[]) || [])
    setTotalCount(count || 0)
    setLoading(false)
  }, [search, page])

  useEffect(() => {
    fetchPatients()
  }, [fetchPatients])

  return { patients, totalCount, loading, refetch: fetchPatients }
}

export async function createPatient(patient: {
  first_name: string
  last_name: string
  date_of_birth: string
  sex: 'Male' | 'Female' | 'Other'
  contact_number?: string
}) {
  const { data, error } = await supabase
    .from('patients')
    .insert(patient)
    .select()
    .single()

  if (error) throw error
  return data as Patient
}
