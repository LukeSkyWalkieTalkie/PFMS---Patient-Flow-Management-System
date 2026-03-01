'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Section } from '@/types'

export function useSections() {
  const [sections, setSections] = useState<Section[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase
        .from('sections')
        .select('*')
        .order('name')
      setSections((data as Section[]) || [])
      setLoading(false)
    }
    fetch()
  }, [])

  return { sections, loading }
}
