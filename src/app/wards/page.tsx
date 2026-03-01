'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Section, Bed, Visit } from '@/types'
import { ACTIVE_STATUSES } from '@/lib/constants'
import SectionGrid from '@/components/wards/SectionGrid'
import LoadingSpinner from '@/components/shared/LoadingSpinner'

export default function WardsPage() {
  const [sections, setSections] = useState<Section[]>([])
  const [beds, setBeds] = useState<Bed[]>([])
  const [activeVisits, setActiveVisits] = useState<Visit[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const [sectionsRes, bedsRes, visitsRes] = await Promise.all([
        supabase.from('sections').select('*').order('name'),
        supabase.from('beds').select('*').eq('is_active', true).order('bed_number'),
        supabase
          .from('visits')
          .select('*, patients(*)')
          .in('visit_status', ACTIVE_STATUSES),
      ])
      setSections((sectionsRes.data as Section[]) || [])
      setBeds((bedsRes.data as Bed[]) || [])
      setActiveVisits((visitsRes.data as Visit[]) || [])
      setLoading(false)
    }
    fetchData()
  }, [])

  if (loading) return <LoadingSpinner />

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Ward Top-View</h1>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {sections.map((section) => (
          <SectionGrid
            key={section.id}
            section={section}
            beds={beds.filter((b) => b.section_id === section.id)}
            activeVisits={activeVisits.filter((v) => v.current_section_id === section.id)}
          />
        ))}
      </div>
    </div>
  )
}
