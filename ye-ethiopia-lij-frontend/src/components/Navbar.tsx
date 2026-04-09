import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useNotifications } from '../context/NotificationContext'
import { Bell, Menu, X, LogOut, User, ChevronDown } from 'lucide-react'
import toast from 'react-hot-toast'
import type { UserRole, Notification } from '../types'

interface NavLink { to: string; label: string }

const navLinks: Record<UserRole, NavLink[]> = {
  ADMIN: [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/children', label: 'Children' },
    { to: '/organizations', label: 'Organizations' },
    { to: '/schools', label: 'Schools' },
    { to: '/users', label: 'Users' },
    { to: '/reports', label: 'Reports' },
    { to: '/duplication-alerts', label: 'Duplicates' },
    { to: '/sponsorship-verification', label: 'Sponsorships' },
  ],
  ORG_STAFF: [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/children', label: 'Children' },
    { to: '/my-organization', label: 'My Organization' },
    { to: '/interventions', label: 'Interventions' },
    { to: '/org-reports', label: 'Reports' },
  ],
  SPONSOR: [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/browse', label: 'Browse Children' },
    { to: '/my-sponsorships', label: 'My Sponsorships' },
  ],
  SCHOOL: [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/school-profile', label: 'My School' },
    { to: '/enrollments', label: 'Enrollments' },
    { to: '/academic-status', label: 'Academic Status' },
    { to: '/performance-report', label: 'Reports' },
    { to: '/interventions', label: 'Interventions' },
  ],
  GOVERNMENT: [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/gov-reports', label: 'Reports' },
    { to: '/children', label: 'Children' },
    { to: '/organizations', label: 'Organizations' },
  ],
  PROJECT_MANAGER: [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/children', label: 'Children' },
    { to: '/registrations', label: 'Users' },
    { to: '/duplication-alerts', label: 'Duplicates' },
    { to: '/financial-documents', label: 'Financial Docs' },
  ],
}

const TYPE_ICONS: Record<string, string> = {
  PROFILE_APPROVED: '✅',
  PROFILE_REJECTED: '❌',
  SPONSORED: '💚',
  INTERVENTION_ADDED: '🏥',
  REPORT_SUBMITTED: '📄',
  STATUS_UPDATED: '🔔',
}

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropOpen, setDropOpen] = useState(false)

  const { unreadCount, setToastHandler } = useNotifications()
  const links: NavLink[] = user?.role ? (navLinks[user.role] ?? []) : []

  // Register toast handler with the context so it fires on new notifications
  useEffect(() => {
    setToastHandler((newItems: Notification[]) => {
      newItems.slice(0, 3).forEach((n) => {
        const icon = TYPE_ICONS[n.notification_type] ?? '🔔'
        toast(
          (t) => (
            <div
              className="flex items-start gap-3 cursor-pointer"
              onClick={() => { toast.dismiss(t.id); navigate('/notifications') }}
            >
              <span className="text-xl leading-none mt-0.5">{icon}</span>
              <div className="min-w-0">
                <p className="font-semibold text-gray-900 text-sm leading-tight">{n.title}</p>
                <p className="text-gray-500 text-xs mt-0.5 line-clamp-2">{n.message}</p>
              </div>
            </div>
          ),
          {
            duration: 6000,
            style: { borderLeft: '4px solid #2E8B57', padding: '12px 16px', maxWidth: '360px' },
          }
        )
      })
      if (newItems.length > 3) {
        toast(`+${newItems.length - 3} more new notifications`, { icon: '🔔', duration: 4000 })
      }
    })
  }, [setToastHandler, navigate])

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">YE</span>
            </div>
            <span className="font-bold text-green-700 text-lg hidden sm:block">Ye Ethiopia Lij</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === l.to
                    ? 'bg-green-50 text-green-700'
                    : 'text-gray-600 hover:text-green-700 hover:bg-green-50'
                }`}
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Bell — badge driven by context */}
            <Link
              to="/notifications"
              className="relative p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            >
              <Bell size={20} className={unreadCount > 0 ? 'animate-wiggle' : ''} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 min-w-[16px] h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-0.5">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </Link>

            {/* User dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropOpen(!dropOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-green-50 transition-colors"
              >
                <div className="w-7 h-7 bg-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-semibold">
                    {user?.name?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-700 hidden sm:block max-w-[120px] truncate">
                  {user?.name}
                </span>
                <ChevronDown size={14} className="text-gray-500" />
              </button>

              {dropOpen && (
                <div className="absolute right-0 mt-1 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-xs text-gray-500">{user?.role}</p>
                    <p className="text-sm font-medium text-gray-800 truncate">{user?.email}</p>
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setDropOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700"
                  >
                    <User size={15} /> Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={15} /> Logout
                  </button>
                </div>
              )}
            </div>

            {/* Mobile toggle */}
            <button
              className="md:hidden p-2 text-gray-500 hover:text-green-600 rounded-lg"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg text-sm font-medium ${
                location.pathname === l.to
                  ? 'bg-green-50 text-green-700'
                  : 'text-gray-600 hover:bg-green-50 hover:text-green-700'
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}
