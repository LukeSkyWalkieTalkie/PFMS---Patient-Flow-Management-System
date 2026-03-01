'use client'

export default function MonthlyChart({
  data,
}: {
  data: { month: string; count: number }[]
}) {
  const maxCount = Math.max(...data.map((d) => d.count), 1)

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <h3 className="mb-4 font-medium text-gray-900">Monthly Patient Volume</h3>
      <div className="flex items-end gap-2" style={{ height: '200px' }}>
        {data.map((d) => {
          const height = maxCount > 0 ? (d.count / maxCount) * 100 : 0
          const [year, month] = d.month.split('-')
          const label = new Date(parseInt(year), parseInt(month) - 1).toLocaleString('en', {
            month: 'short',
          })
          return (
            <div key={d.month} className="flex flex-1 flex-col items-center gap-1">
              <span className="text-xs text-gray-500">{d.count}</span>
              <div className="w-full flex-1 flex items-end">
                <div
                  className="w-full rounded-t bg-clinical-500 transition-all hover:bg-clinical-600"
                  style={{ height: `${Math.max(height, 2)}%` }}
                />
              </div>
              <span className="text-xs text-gray-400">{label}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
