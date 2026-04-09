const map: Record<string, string> = {
  PENDING:   'badge-pending',
  PUBLISHED: 'badge-active',
  SPONSORED: 'badge-sponsored',
  REJECTED:  'badge-rejected',
  ACTIVE:    'badge-active',
  SUSPENDED: 'badge-rejected',
  SUBMITTED: 'badge-pending',
  REVIEWED:  'badge-active',
  APPROVED:  'badge-active',
  DRAFT:     'bg-gray-100 text-gray-700 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
}

interface StatusBadgeProps {
  status: string
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const cls = map[status] ?? 'badge-pending'
  return <span className={cls}>{status}</span>
}
