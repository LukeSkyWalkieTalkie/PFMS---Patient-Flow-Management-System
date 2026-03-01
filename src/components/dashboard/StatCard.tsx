export default function StatCard({
  label,
  value,
  icon,
  color = 'clinical',
}: {
  label: string
  value: number | string
  icon: string
  color?: 'clinical' | 'green' | 'yellow' | 'red' | 'purple'
}) {
  const colorMap = {
    clinical: 'bg-clinical-100 text-clinical-600',
    green: 'bg-green-100 text-green-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    red: 'bg-red-100 text-red-600',
    purple: 'bg-purple-100 text-purple-600',
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="flex items-center gap-4">
        <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${colorMap[color]}`}>
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
          </svg>
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-sm text-gray-500">{label}</p>
        </div>
      </div>
    </div>
  )
}
