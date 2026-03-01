'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Bed } from '@/types'

export function useBeds(sectionId?: string) {
  const [beds, setBeds] = useState<Bed[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetch() {
      let query = supabase
        .from('beds')
        .select('*')
        .eq('is_active', true)
        .order('bed_number')

      if (sectionId) query = query.eq('section_id', sectionId)

      const { data } = await query
      setBeds((data as Bed[]) || [])
      setLoading(false)
    }
    fetch()
  }, [sectionId])

  return { beds, loading }
}
