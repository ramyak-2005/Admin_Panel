const PAGE_ICONS = {
  Dashboard: '▦',
  Accounts: '▤',
  'Account Details': '◉',
  Settings: '⚙',
}

export default function PageHeader({ title, description, actions }) {
  return (
    <header className="page-heading">
      <div className="page-heading-main">
        <span className="page-title-icon" aria-hidden="true">{PAGE_ICONS[title] || '◆'}</span>
        <div className="page-heading-copy">
          <h2>{title}</h2>
          {description && <p>{description}</p>}
        </div>
      </div>
      {actions && <div className="page-heading-actions">{actions}</div>}
    </header>
  )
}
