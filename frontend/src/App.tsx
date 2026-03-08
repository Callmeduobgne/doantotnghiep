import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import AdminLoginPage from './pages/AdminLoginPage'
import DashboardPage from './pages/DashboardPage'
import BatchDetailPage from './pages/BatchDetailPage'
import CreateBatchPage from './pages/CreateBatchPage'
import VerifyPage from './pages/VerifyPage'
import AdminUsersPage from './pages/AdminUsersPage'
import AdminBatchesPage from './pages/AdminBatchesPage'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/verify/:hash" element={<VerifyPage />} />

        {/* Agent routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/batches/new" element={<CreateBatchPage />} />
          <Route path="/batches/:id" element={<BatchDetailPage />} />
        </Route>

        {/* Admin routes */}
        <Route element={<AdminRoute />}>
          <Route path="/admin/users" element={<AdminUsersPage />} />
          <Route path="/admin/batches" element={<AdminBatchesPage />} />
        </Route>

        {/* Wildcard: redirect về đúng trang theo role */}
        <Route path="/admin" element={<Navigate to="/admin/users" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
