'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Visit, VisitStatus } from '@/types'
import { PAGE_SIZE } from '@/lib/constants'

interface VisitFilters {
  sectionId?: string
  status?: VisitStatus
  doctor?: string
  search?: string
  sortField?: string
  sortAsc?: boolean
}

export function useVisits(filters: VisitFilters, page: number) {
  const [visits, setVisits] = useState<Visit[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(true)

  const fetchVisits = useCallback(async () => {
    setLoading(true)
    let query = supabase
      .from('visits')
      .select(
        '*, patients!inner(*), sections:current_section_id(*), beds:current_bed_id(*)',
        { count: 'exact' }
      )

    if (filters.sectionId) query = query.eq('current_section_id', filters.sectionId)
    if (filters.status) query = query.eq('visit_status', filters.status)
    if (filters.doctor) query = query.ilike('attending_doctor', `%${filters.doctor}%`)
    if (filters.search) {
      query = query.or(
        `patients.first_name.ilike.%${filters.search}%,patients.last_name.ilike.%${filters.search}%`
      )
    }

    const sortField = filters.sortField || 'created_at'
    query = query.order(sortField, { ascending: filters.sortAsc ?? false })

    const from = (page - 1) * PAGE_SIZE
    query = query.range(from, from + PAGE_SIZE - 1)

    const { data, count } = await query
    setVisits((data as Visit[]) || [])
    setTotalCount(count || 0)
    setLoading(false)
  }, [filters, page])

  useEffect(() => {
    fetchVisits()
  }, [fetchVisits])

  return { visits, totalCount, loading, refetch: fetchVisits }
}

export async function updateVisit(
  visitId: string,
  updates: Partial<Visit>,
  currentVersion: number,
  clinicianName: string
) {
  const { data, error } = await supabase
    .from('visits')
    .update({
      ...updates,
      updated_by: clinicianName,
    })
    .eq('id', visitId)
    .eq('version_number', currentVersion)
    .select('*, patients(*), sections:current_section_id(*), beds:current_bed_id(*)')
    .single()

  if (error) throw error
  if (!data) throw new Error('CONFLICT: This record was modified by another user. Please refresh.')
  return data as Visit
}
