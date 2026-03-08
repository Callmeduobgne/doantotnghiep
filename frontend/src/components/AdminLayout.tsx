import { Link, useLocation } from 'react-router-dom'
import { Leaf, LogOut, Users, LayoutDashboard, ShieldCheck, ChevronRight } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { agent, logout } = useAuth()
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  const breadcrumb = location.pathname === '/admin/users'
    ? 'Quản lý người dùng'
    : location.pathname === '/admin/batches'
    ? 'Tổng quan'
    : 'Admin'

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <header className="sticky top-0 z-50 glass border-b border-white/40 shadow-sm shadow-black/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Brand */}
          <Link to="/admin/users" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md shadow-violet-600/30 group-hover:shadow-violet-600/50 transition-all">
              <ShieldCheck className="w-4 h-4 text-white" />
            </div>
            <div className="hidden sm:block">
              <div className="text-sm font-extrabold tracking-tight text-gray-900">Chè Sạch</div>
              <div className="text-[10px] text-violet-500 font-semibold leading-none -mt-0.5">Quản trị viên</div>
            </div>
          </Link>

          {/* Nav links */}
          <nav className="flex items-center gap-1">
            <Link
              to="/admin/users"
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-150 ${
                isActive('/admin/users')
                  ? 'bg-violet-50 text-violet-700 border border-violet-200/60'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Người dùng</span>
            </Link>
            <Link
              to="/admin/batches"
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-150 ${
                isActive('/admin/batches')
                  ? 'bg-violet-50 text-violet-700 border border-violet-200/60'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span className="hidden sm:inline">Tổng quan</span>
            </Link>
          </nav>

          {/* User + logout */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="hidden md:flex items-center gap-2 pl-3 border-l border-gray-200">
              <div className="w-7 h-7 bg-gradient-to-br from-violet-400 to-purple-500 rounded-full flex items-center justify-center">
                <ShieldCheck className="w-3.5 h-3.5 text-white" />
              </div>
              <div className="leading-none">
                <div className="text-xs font-semibold text-gray-800 truncate max-w-[120px]">
                  {agent?.username}
                </div>
                <div className="text-[10px] text-violet-500 font-semibold">Admin</div>
              </div>
            </div>
            <button
              onClick={logout}
              title="Đăng xuất"
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-500 hover:bg-red-50 px-2.5 py-1.5 rounded-lg transition-all duration-150"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Thoát</span>
            </button>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 pt-4">
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <ShieldCheck className="w-3 h-3 text-violet-400" />
          <span className="text-violet-500 font-medium">Admin</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-600">{breadcrumb}</span>
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6">
        {children}
      </main>

      <footer className="text-center text-xs text-gray-400 py-4 border-t border-white/60 bg-white/40 backdrop-blur-sm">
        <span className="inline-flex items-center gap-1.5">
          <Leaf className="w-3 h-3 text-emerald-500" />
          Hệ thống xác thực nguồn gốc chè — Dữ liệu lưu trên blockchain IBN
        </span>
      </footer>
    </div>
  )
}
