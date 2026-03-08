import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function ProtectedRoute() {
  const { agent, loading, isAdmin } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!agent) return <Navigate to="/login" replace />
  // Admin không được vào trang đại lý → chuyển sang trang admin
  if (isAdmin) return <Navigate to="/admin/users" replace />

  return <Outlet />
}
