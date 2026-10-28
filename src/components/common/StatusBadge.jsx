
const STATUS_CLASSES = {
  active: 'status-active',
  inactive: 'status-inactive',
  suspended: 'status-suspended',
}

export default function StatusBadge({ status = 'Unknown' }) {
  const normalizedStatus =
    typeof status === 'string' ? status.toLowerCase() : 'unknown'

  return (
    <span
      className={`status-badge ${STATUS_CLASSES[normalizedStatus] || 'status-unknown'}`}
    >
      {status}
    </span>
  )
}
