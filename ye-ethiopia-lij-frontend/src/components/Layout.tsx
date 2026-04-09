import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { unreadCount } from '../api/children'
import type { UserRole } from '../types'
import {
  LayoutDashboard, Users, Building2, FileText, Bell, LogOut,
  User, ChevronLeft, ChevronRight, Menu, X,
  Heart, BookOpen, Activity, Baby, Search, ChevronDown,
} from 'lucide-react'

interface NavItem { to: string; label: string; icon: React.ElementType }

const navByRole: Record<UserRole, NavItem[]> = {
  ADMIN: [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/children', label: 'Children', icon: Baby },
    { to: '/organizations', label: 'Organizations', icon: Building2 },
    { to: '/users', label: 'Users', icon: Users },
    { to: '/reports', label: 'Reports', icon: FileText },
  ],
  ORG_STAFF: [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/children', label: 'Children', icon: Baby },
    { to: '/my-organization', label: 'My Organization', icon: Building2 },
    { to: '/interventions', label: 'Interventions', icon: Activity },
    { to: '/org-reports', label: 'Reports', icon: FileText },
  ],
  SPONSOR: [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/browse', label: 'Browse Children', icon: Search },
    { to: '/my-sponsorships', label: 'My Sponsorships', icon: Heart },
  ],
  SCHOOL: [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/academic-reports', label: 'Academic Reports', icon: BookOpen },
    { to: '/interventions', label: 'Interventions', icon: Activity },
  ],
  GOVERNMENT: [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/children', label: 'Children', icon: Baby },
    { to: '/reports', label: 'Reports', icon: FileText },
  ],
  PROJECT_MANAGER: []
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [unread, setUnread] = useState(0)

  const navItems: NavItem[] = user?.role ? (navByRole[user.role] ?? []) : []

  useEffect(() => {
    if (user) unreadCount().then((r) => setUnread(r.data.unread_count ?? 0)).catch(() => {})
  }, [user])

  const handleLogout = () => { logout(); navigate('/login') }
  const isActive = (to: string) => location.pathname === to

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20 lg:hidden animate-fadeIn"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={[
          'fixed lg:static inset-y-0 left-0 z-30 flex flex-col',
          'bg-gradient-to-b from-white to-slate-50 border-r border-slate-200',
          'shadow-2xl lg:shadow-none transition-all duration-500 ease-in-out',
          sidebarOpen ? 'w-64' : 'w-20',
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        ].join(' ')}
      >
        {/* Logo */}
        <div className="relative p-5 overflow-hidden border-b border-slate-100">
          <div className="absolute inset-0 bg-gradient-to-r from-[#2E8B57]/10 to-transparent" />
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 bg-gradient-to-br from-[#2E8B57] to-[#3CB371] rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                <span className="text-white font-bold text-sm">YE</span>
              </div>
              <div className={`transition-all duration-500 overflow-hidden ${!sidebarOpen ? 'lg:w-0 lg:opacity-0' : 'lg:w-auto lg:opacity-100'}`}>
                <p className="text-sm font-bold bg-gradient-to-r from-[#2E8B57] to-[#3CB371] bg-clip-text text-transparent whitespace-nowrap">
                  Ye Ethiopia Lij
                </p>
                <p className="text-[10px] text-slate-400 whitespace-nowrap">Child Sponsorship Platform</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden lg:flex p-1.5 hover:bg-slate-100 rounded-lg transition-all"
            >
              {sidebarOpen
                ? <ChevronLeft size={16} className="text-slate-500" />
                : <ChevronRight size={16} className="text-slate-500" />}
            </button>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon as React.FC<{ size?: number; className?: string }>
            const active = isActive(item.to)
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileSidebarOpen(false)}
                className={[
                  'relative flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all duration-300 group',
                  !sidebarOpen ? 'lg:justify-center' : '',
                  active
                    ? 'bg-gradient-to-r from-[#2E8B57] to-[#3CB371] text-white shadow-lg scale-[1.02]'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-[#2E8B57]',
                ].join(' ')}
              >
                <Icon size={18} className={`flex-shrink-0 ${active ? 'text-white' : 'text-[#2E8B57]'}`} />
                <span className={`text-sm whitespace-nowrap transition-all duration-500 ${!sidebarOpen ? 'lg:hidden' : ''}`}>
                  {item.label}
                </span>
                {active && sidebarOpen && (
                  <div className="absolute right-3 w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Notifications link */}
        <div className="px-3 pb-2">
          <Link
            to="/notifications"
            className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all duration-300 text-slate-600 hover:bg-slate-100 hover:text-[#2E8B57] ${!sidebarOpen ? 'lg:justify-center' : ''}`}
          >
            <div className="relative flex-shrink-0">
              <Bell size={18} className="text-[#2E8B57]" />
              {unread > 0 && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                  {unread > 9 ? '9+' : unread}
                </span>
              )}
            </div>
            <span className={`text-sm whitespace-nowrap ${!sidebarOpen ? 'lg:hidden' : ''}`}>Notifications</span>
          </Link>
        </div>

        <div className="p-3 border-t border-slate-100 text-center">
          <p className={`text-[10px] text-slate-400 ${!sidebarOpen ? 'lg:hidden' : ''}`}>v1.0.0 • YEL Platform</p>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="bg-white border-b border-slate-200 px-4 lg:px-6 h-16 flex items-center justify-between flex-shrink-0 shadow-sm">
          <button
            className="lg:hidden p-2 hover:bg-slate-100 rounded-xl transition-colors"
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          >
            {mobileSidebarOpen
              ? <X size={20} className="text-slate-600" />
              : <Menu size={20} className="text-slate-600" />}
          </button>

          <div className="hidden lg:block">
            <p className="text-sm text-slate-400">
              Welcome back, <span className="font-semibold text-slate-700">{user?.name}</span>
            </p>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {/* Bell */}
            <div className="relative">
              <button
                onClick={() => { setNotifOpen(!notifOpen); setUserMenuOpen(false) }}
                className="relative p-2 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <Bell size={20} className="text-slate-500" />
                {unread > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {unread > 9 ? '9+' : unread}
                  </span>
                )}
              </button>
              {notifOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setNotifOpen(false)} />
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-100 z-40 overflow-hidden animate-slideIn">
                    <div className="p-4 bg-gradient-to-r from-[#2E8B57]/10 to-[#3CB371]/10 border-b border-slate-100 flex justify-between items-center">
                      <div>
                        <p className="font-bold text-sm">Notifications</p>
                        <p className="text-xs text-slate-500">{unread} unread</p>
                      </div>
                      <Link to="/notifications" onClick={() => setNotifOpen(false)} className="text-xs text-[#2E8B57] font-semibold hover:underline">
                        View all
                      </Link>
                    </div>
                    <div className="p-6 text-center text-slate-400 text-sm">
                      <Bell size={28} className="mx-auto mb-2 opacity-30" />
                      <Link to="/notifications" onClick={() => setNotifOpen(false)} className="text-[#2E8B57] font-medium hover:underline text-xs">
                        Open notifications
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* User menu */}
            <div className="relative pl-2 border-l border-slate-200">
              <button
                onClick={() => { setUserMenuOpen(!userMenuOpen); setNotifOpen(false) }}
                className="flex items-center gap-2.5 hover:bg-slate-50 px-2 py-1.5 rounded-xl transition-colors group"
              >
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-semibold text-slate-700 leading-tight">{user?.name}</p>
                  <p className="text-[10px] text-slate-400">{user?.role?.replace('_', ' ')}</p>
                </div>
                <div className="relative">
                  <div className="w-9 h-9 bg-gradient-to-br from-[#2E8B57] to-[#3CB371] rounded-xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                    <span className="text-white font-bold text-sm">{user?.name?.charAt(0)?.toUpperCase()}</span>
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 border-2 border-white rounded-full" />
                </div>
                <ChevronDown size={14} className="text-slate-400 hidden sm:block" />
              </button>

              {userMenuOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setUserMenuOpen(false)} />
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 z-40 overflow-hidden animate-slideIn">
                    <div className="p-4 bg-gradient-to-r from-[#2E8B57]/10 to-[#3CB371]/10">
                      <p className="font-semibold text-sm text-slate-800">{user?.name}</p>
                      <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                    </div>
                    <div className="p-2">
                      <Link
                        to="/profile"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 transition-all text-sm group"
                      >
                        <User size={15} className="text-[#2E8B57] group-hover:scale-110 transition-transform" />
                        My Profile
                      </Link>
                      <div className="h-px bg-slate-100 my-1" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-red-600 hover:bg-red-50 transition-all text-sm group"
                      >
                        <LogOut size={15} className="group-hover:translate-x-0.5 transition-transform" />
                        Logout
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
