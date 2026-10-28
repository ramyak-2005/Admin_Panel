const CARD_ICONS = {
  'Total Accounts': '▦',
  Suspended: '⛔',
  Shopify: '◈',
  Active: '✓',
  Inactive: '◷',
}

export default function SummaryCard({ title, value, onClick }) {
  return (
    <button type="button" className="summary-card" onClick={onClick}>
      <span className="summary-card-icon" aria-hidden="true">{CARD_ICONS[title] || '◈'}</span>
      <span className="summary-card-label">{title}</span>
      <strong>{value}</strong>
    </button>
  )
}
