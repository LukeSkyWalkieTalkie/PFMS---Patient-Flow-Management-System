'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { ACTIVE_STATUSES } from '@/lib/constants'

interface DashboardStats {
  activePatients: number
  wardCounts: { section_name: string; count: number; total_beds: number }[]
  icuCount: number
  transfersToday: number
  dischargesToday: number
  monthlyData: { month: string; count: number }[]
}

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      setLoading(true)

      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const todayISO = today.toISOString()

      const [
        activeRes,
        wardRes,
        icuRes,
        transferRes,
        dischargeRes,
        monthlyRes,
      ] = await Promise.all([
        // Active patients count
        supabase
          .from('visits')
          .select('id', { count: 'exact', head: true })
          .in('visit_status', ACTIVE_STATUSES),

        // Per-ward counts
        supabase
          .from('sections')
          .select(`
            name,
            beds(id),
            visits:visits!current_section_id(id, visit_status)
          `),

        // ICU count
        supabase
          .from('visits')
          .select('id, sections!inner(name)', { count: 'exact', head: true })
          .eq('sections.name', 'ICU')
          .in('visit_status', ACTIVE_STATUSES),

        // Transfers today
        supabase
          .from('transfer_log')
          .select('id', { count: 'exact', head: true })
          .gte('transferred_at', todayISO),

        // Discharges today
        supabase
          .from('visits')
          .select('id', { count: 'exact', head: true })
          .eq('visit_status', 'Discharged')
          .gte('discharged_at', todayISO),

        // Monthly patient data (last 12 months)
        supabase
          .from('visits')
          .select('created_at')
          .gte('created_at', new Date(today.getFullYear(), today.getMonth() - 11, 1).toISOString()),
      ])

      // Process ward counts
      const wardCounts = (wardRes.data || []).map((section: Record<string, unknown>) => {
        const visits = (section.visits as { visit_status: string }[] || [])
        const activeCount = visits.filter((v) =>
          ACTIVE_STATUSES.includes(v.visit_status as typeof ACTIVE_STATUSES[number])
        ).length
        return {
          section_name: section.name as string,
          count: activeCount,
          total_beds: (section.beds as unknown[] || []).length,
        }
      })

      // Process monthly data
      const monthMap: Record<string, number> = {}
      for (let i = 11; i >= 0; i--) {
        const d = new Date(today.getFullYear(), today.getMonth() - i, 1)
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
        monthMap[key] = 0
      }
      (monthlyRes.data || []).forEach((v: { created_at: string }) => {
        const d = new Date(v.created_at)
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
        if (monthMap[key] !== undefined) monthMap[key]++
      })
      const monthlyData = Object.entries(monthMap).map(([month, count]) => ({ month, count }))

      setStats({
        activePatients: activeRes.count || 0,
        wardCounts,
        icuCount: icuRes.count || 0,
        transfersToday: transferRes.count || 0,
        dischargesToday: dischargeRes.count || 0,
        monthlyData,
      })
      setLoading(false)
    }

    fetchStats()
  }, [])

  return { stats, loading }
}
