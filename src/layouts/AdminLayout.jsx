import { Navigate, Outlet } from 'react-router-dom'
import Header from '../components/layout/Header'
import Sidebar from '../components/layout/Sidebar'

export default function AdminLayout() {
  // Demo-only guard. Production access control must use a server-issued session.
  if (sessionStorage.getItem('adminDemoAuthenticated') !== 'true') {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-main">
        <Header />
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
