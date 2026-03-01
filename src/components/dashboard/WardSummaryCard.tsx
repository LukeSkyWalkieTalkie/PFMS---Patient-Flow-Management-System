export default function WardSummaryCard({
  name,
  occupied,
  total,
}: {
  name: string
  occupied: number
  total: number
}) {
  const percentage = total > 0 ? Math.round((occupied / total) * 100) : 0

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-gray-900">{name}</h3>
        <span className="text-sm text-gray-500">
          {occupied}/{total} beds
        </span>
      </div>
      <div className="mt-3">
        <div className="h-2 overflow-hidden rounded-full bg-gray-100">
          <div
            className={`h-full rounded-full transition-all ${
              percentage > 80 ? 'bg-red-500' : percentage > 50 ? 'bg-yellow-500' : 'bg-green-500'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <p className="mt-1 text-right text-xs text-gray-400">{percentage}% occupancy</p>
      </div>
    </div>
  )
}
