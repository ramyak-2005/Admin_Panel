import { useNavigate } from 'react-router-dom'

export default function Header() {
  const navigate = useNavigate()

  function handleLogout() {
    sessionStorage.removeItem('adminDemoAuthenticated')
    navigate('/login', { replace: true })
  }

  return (
    <header className="admin-header">
      <h1>Admin Portal</h1>
      <button type="button" className="logout-button" onClick={handleLogout}>
        <span aria-hidden="true">↪</span> Logout
      </button>
    </header>
  )
}
