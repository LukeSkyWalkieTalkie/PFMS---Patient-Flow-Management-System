function escapeCSVField(field: string): string {
  if (field.includes(',') || field.includes('"') || field.includes('\n')) {
    return `"${field.replace(/"/g, '""')}"`
  }
  return field
}

export function generateCSV(
  data: Record<string, unknown>[],
  columns: { key: string; header: string }[]
): string {
  const header = columns.map((c) => escapeCSVField(c.header)).join(',')
  const rows = data.map((row) =>
    columns.map((c) => escapeCSVField(String(row[c.key] ?? ''))).join(',')
  )
  return [header, ...rows].join('\n')
}

export function downloadCSV(csvContent: string, filename: string): void {
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}
