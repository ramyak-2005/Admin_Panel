
import { NavLink } from 'react-router-dom'

const NAV_ITEMS = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Accounts', to: '/accounts' },
  { label: 'Settings', to: '/settings' },
]

export default function Sidebar() {
  return (
    <aside className="admin-sidebar">
      <div className="sidebar-brand">ADMIN PORTAL</div>

      <nav aria-label="Main navigation">
        {NAV_ITEMS.map(({ label, to }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `sidebar-link${isActive ? ' active' : ''}`
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
