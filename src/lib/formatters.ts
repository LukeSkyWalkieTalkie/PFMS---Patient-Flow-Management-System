export function formatDate(dateString: string | null): string {
  if (!dateString) return '—'
  return new Date(dateString).toLocaleDateString('en-AU', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function formatDateTime(dateString: string | null): string {
  if (!dateString) return '—'
  return new Date(dateString).toLocaleString('en-AU', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
}

export function getFullName(firstName: string, lastName: string): string {
  return `${firstName} ${lastName}`
}
