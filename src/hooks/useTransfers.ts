'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase/client'
import { PAGE_SIZE } from '@/lib/constants'

interface TransferRecord {
  id: string
  visit_id: string
  transferred_by: string | null
  transferred_at: string
  from_section: { name: string } | null
  to_section: { name: string } | null
  from_bed: { bed_number: string } | null
  to_bed: { bed_number: string } | null
  visits: {
    patients: {
      patient_code: string
      first_name: string
      last_name: string
    }
  }
}

export function useTransfers(sectionId: string | undefined, page: number) {
  const [transfers, setTransfers] = useState<TransferRecord[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(true)

  const fetchTransfers = useCallback(async () => {
    setLoading(true)
    let query = supabase
      .from('transfer_log')
      .select(
        `
        *,
        from_section:from_section_id(name),
        to_section:to_section_id(name),
        from_bed:from_bed_id(bed_number),
        to_bed:to_bed_id(bed_number),
        visits!inner(patients!inner(patient_code, first_name, last_name))
      `,
        { count: 'exact' }
      )
      .order('transferred_at', { ascending: false })

    if (sectionId) {
      query = query.or(`from_section_id.eq.${sectionId},to_section_id.eq.${sectionId}`)
    }

    const from = (page - 1) * PAGE_SIZE
    query = query.range(from, from + PAGE_SIZE - 1)

    const { data, count } = await query
    setTransfers((data as unknown as TransferRecord[]) || [])
    setTotalCount(count || 0)
    setLoading(false)
  }, [sectionId, page])

  useEffect(() => {
    fetchTransfers()
  }, [fetchTransfers])

  return { transfers, totalCount, loading }
}
