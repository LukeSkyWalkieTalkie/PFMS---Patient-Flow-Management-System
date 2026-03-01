import { VisitStatus } from '@/types'

export const VISIT_STATUSES: VisitStatus[] = [
  'Registered',
  'Admitted',
  'In_Care',
  'Transferred',
  'Discharged',
  'Cancelled',
]

export const ACTIVE_STATUSES: VisitStatus[] = ['Admitted', 'In_Care', 'Transferred']

export const ALLOWED_TRANSITIONS: Record<VisitStatus, VisitStatus[]> = {
  Registered: ['Admitted', 'Cancelled'],
  Admitted: ['In_Care'],
  In_Care: ['Transferred', 'Discharged'],
  Transferred: ['In_Care'],
  Discharged: [],
  Cancelled: [],
}

export const STATUS_COLORS: Record<VisitStatus, { bg: string; border: string; text: string }> = {
  Registered: { bg: 'bg-blue-100', border: 'border-blue-400', text: 'text-blue-800' },
  Admitted: { bg: 'bg-yellow-100', border: 'border-yellow-400', text: 'text-yellow-800' },
  In_Care: { bg: 'bg-green-100', border: 'border-green-400', text: 'text-green-800' },
  Transferred: { bg: 'bg-purple-100', border: 'border-purple-400', text: 'text-purple-800' },
  Discharged: { bg: 'bg-gray-100', border: 'border-gray-400', text: 'text-gray-800' },
  Cancelled: { bg: 'bg-red-100', border: 'border-red-400', text: 'text-red-800' },
}

export const STATUS_DISPLAY: Record<VisitStatus, string> = {
  Registered: 'Registered',
  Admitted: 'Admitted',
  In_Care: 'In Care',
  Transferred: 'Transferred',
  Discharged: 'Discharged',
  Cancelled: 'Cancelled',
}

export const PAGE_SIZE = 20
