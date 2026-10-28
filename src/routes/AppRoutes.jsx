
import { Navigate, Route, Routes } from 'react-router-dom'
import Login from '../pages/auth/Login'
import OTPVerification from '../pages/auth/OTPVerification'
import AdminLayout from '../layouts/AdminLayout'
import Dashboard from '../pages/dashboard/Dashboard'
import Accounts from '../pages/accounts/Accounts'
import AccountDetails from '../pages/accounts/AccountDetails'
import Settings from '../pages/settings/Settings'


export default function AppRoutes() {
  return (
       <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/verify-otp" element={<OTPVerification />} />

      <Route element={<AdminLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/accounts" element={<Accounts />} />
        <Route path="/accounts/:id" element={<AccountDetails />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
