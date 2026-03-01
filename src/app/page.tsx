'use client'

import { useDashboardStats } from '@/hooks/useDashboardStats'
import StatCard from '@/components/dashboard/StatCard'
import WardSummaryCard from '@/components/dashboard/WardSummaryCard'
import MonthlyChart from '@/components/dashboard/MonthlyChart'
import LoadingSpinner from '@/components/shared/LoadingSpinner'

export default function DashboardPage() {
  const { stats, loading } = useDashboardStats()

  if (loading || !stats) return <LoadingSpinner />

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

      {/* Key metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Active Patients"
          value={stats.activePatients}
          icon="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
          color="clinical"
        />
        <StatCard
          label="ICU Patients"
          value={stats.icuCount}
          icon="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          color="red"
        />
        <StatCard
          label="Transfers Today"
          value={stats.transfersToday}
          icon="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
          color="purple"
        />
        <StatCard
          label="Discharges Today"
          value={stats.dischargesToday}
          icon="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
          color="green"
        />
      </div>

      {/* Ward occupancy */}
      <div>
        <h2 className="mb-3 text-lg font-semibold text-gray-900">Ward Occupancy</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.wardCounts.map((ward) => (
            <WardSummaryCard
              key={ward.section_name}
              name={ward.section_name}
              occupied={ward.count}
              total={ward.total_beds}
            />
          ))}
        </div>
      </div>

      {/* Monthly chart */}
      <MonthlyChart data={stats.monthlyData} />
    </div>
  )
}
