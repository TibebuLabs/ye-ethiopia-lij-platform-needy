import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import type { UserRole } from '../types'

interface ProtectedRouteProps {
  roles?: UserRole[]
}

export default function ProtectedRoute({ roles }: ProtectedRouteProps) {
  const { user } = useAuth()

  // Also check storage directly as a fallback for the brief moment after login
  const hasToken = !!(localStorage.getItem('access_token') ?? sessionStorage.getItem('access_token'))
  const storedUser = (() => {
    try {
      const s = localStorage.getItem('user') ?? sessionStorage.getItem('user')
      return s ? JSON.parse(s) : null
    } catch { return null }
  })()

  const effectiveUser = user ?? (hasToken ? storedUser : null)

  if (!effectiveUser) return <Navigate to="/login" replace />
  if (roles && !roles.includes(effectiveUser.role)) return <Navigate to="/dashboard" replace />
  return <Outlet />
}
