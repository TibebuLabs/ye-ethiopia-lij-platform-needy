import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import Layout from '../components/Layout'
import Spinner from '../components/Spinner'
import { dashboardStats } from '../api/children'
import {
  Users, Heart, Building2, BookOpen, Activity,
  TrendingUp, Baby, Clock, Star, GraduationCap,
  type LucideIcon
} from 'lucide-react'
import { Link } from 'react-router-dom'
import type { UserRole } from '../types'

interface StatCard {
  icon: LucideIcon
  label: string
  key: string
  color: string
  bg: string
  trend?: string
  suffix?: string
}

// Stat definitions per role
const ROLE_STATS: Record<UserRole, StatCard[]> = {
  ADMIN: [
    { icon: Baby,       label: 'Total Children',  key: 'total_children',   color: 'text-green-600',  bg: 'bg-green-50',  trend: '+5' },
    { icon: Heart,      label: 'Sponsored',        key: 'sponsored',        color: 'text-blue-500',   bg: 'bg-blue-50',   trend: '+3' },
    { icon: Activity,   label: 'Unsponsored',      key: 'unsponsored',      color: 'text-orange-500', bg: 'bg-orange-50' },
    { icon: Building2,  label: 'Organizations',    key: 'organizations',    color: 'text-purple-500', bg: 'bg-purple-50', trend: '+1' },
    { icon: BookOpen,   label: 'Interventions',    key: 'interventions',    color: 'text-teal-500',   bg: 'bg-teal-50',   trend: '+18%' },
    { icon: TrendingUp, label: 'Avg Score',        key: 'avg_score',        color: 'text-indigo-500', bg: 'bg-indigo-50', suffix: '%' },
  ],
  GOVERNMENT: [
    { icon: Baby,       label: 'Total Children',  key: 'total_children',   color: 'text-green-600',  bg: 'bg-green-50' },
    { icon: Heart,      label: 'Sponsored',        key: 'sponsored',        color: 'text-blue-500',   bg: 'bg-blue-50' },
    { icon: Activity,   label: 'Unsponsored',      key: 'unsponsored',      color: 'text-orange-500', bg: 'bg-orange-50' },
    { icon: Building2,  label: 'Organizations',    key: 'organizations',    color: 'text-purple-500', bg: 'bg-purple-50' },
    { icon: BookOpen,   label: 'Interventions',    key: 'interventions',    color: 'text-teal-500',   bg: 'bg-teal-50' },
    { icon: TrendingUp, label: 'Avg Score',        key: 'avg_score',        color: 'text-indigo-500', bg: 'bg-indigo-50', suffix: '%' },
  ],
  ORG_STAFF: [
    { icon: Baby,       label: 'My Children',      key: 'total_children',   color: 'text-green-600',  bg: 'bg-green-50' },
    { icon: Clock,      label: 'Pending Approval', key: 'pending_approval', color: 'text-yellow-500', bg: 'bg-yellow-50' },
    { icon: Heart,      label: 'Sponsored',        key: 'sponsored',        color: 'text-blue-500',   bg: 'bg-blue-50' },
    { icon: BookOpen,   label: 'Interventions',    key: 'interventions',    color: 'text-teal-500',   bg: 'bg-teal-50' },
    { icon: TrendingUp, label: 'Avg Score',        key: 'avg_score',        color: 'text-indigo-500', bg: 'bg-indigo-50', suffix: '%' },
  ],
  SPONSOR: [
    { icon: Star,       label: 'Total Sponsorships', key: 'total_sponsorships',  color: 'text-green-600', bg: 'bg-green-50' },
    { icon: Heart,      label: 'Active',              key: 'active_sponsorships', color: 'text-blue-500',  bg: 'bg-blue-50' },
    { icon: Baby,       label: 'Children Supported',  key: 'children_supported',  color: 'text-purple-500',bg: 'bg-purple-50' },
  ],
  SCHOOL: [
    { icon: GraduationCap, label: 'Enrolled Children', key: 'enrolled_children', color: 'text-green-600',  bg: 'bg-green-50' },
    { icon: BookOpen,      label: 'Reports Submitted',  key: 'reports_submitted', color: 'text-blue-500',   bg: 'bg-blue-50' },
    { icon: Activity,      label: 'Interventions',      key: 'interventions',     color: 'text-teal-500',   bg: 'bg-teal-50' },
    { icon: TrendingUp,    label: 'Avg Score',          key: 'avg_score',         color: 'text-indigo-500', bg: 'bg-indigo-50', suffix: '%' },
  ],
  PROJECT_MANAGER: [
    { icon: Clock,      label: 'Pending Profiles',    key: 'pending_children',       color: 'text-yellow-500', bg: 'bg-yellow-50' },
    { icon: Baby,       label: 'Published Children',  key: 'published_children',     color: 'text-green-600',  bg: 'bg-green-50' },
    { icon: Activity,   label: 'Pending Duplicates',  key: 'pending_duplicates',     color: 'text-red-500',    bg: 'bg-red-50' },
    { icon: BookOpen,   label: 'Pending Fin. Docs',   key: 'pending_financial_docs', color: 'text-purple-500', bg: 'bg-purple-50' },
    { icon: Users,      label: 'Total Children',      key: 'total_children',         color: 'text-blue-500',   bg: 'bg-blue-50' },
  ],
}

const QUICK_ACTIONS: Partial<Record<UserRole, { to: string; icon: LucideIcon; label: string }[]>> = {
  ADMIN:      [{ to: '/organizations', icon: Building2, label: 'Organizations' }, { to: '/users', icon: Users, label: 'Manage Users' }, { to: '/children', icon: Baby, label: 'All Children' }, { to: '/duplication-alerts', icon: Activity, label: 'Duplicates' }],
  ORG_STAFF:  [{ to: '/children/register', icon: Baby, label: 'Register Child' }, { to: '/children', icon: Users, label: 'My Children' }, { to: '/interventions', icon: BookOpen, label: 'Interventions' }],
  SPONSOR:    [{ to: '/browse', icon: Heart, label: 'Browse Children' }, { to: '/my-sponsorships', icon: Star, label: 'My Sponsorships' }],
  SCHOOL:     [{ to: '/enrollments', icon: GraduationCap, label: 'Enrollments' }, { to: '/academic-reports', icon: BookOpen, label: 'Submit Report' }, { to: '/interventions', icon: Activity, label: 'Interventions' }],
  GOVERNMENT: [{ to: '/children', icon: Baby, label: 'View Children' }, { to: '/reports', icon: TrendingUp, label: 'Reports' }],
  PROJECT_MANAGER: [
    { to: '/children', icon: Baby, label: 'Review Children' },
    { to: '/duplication-alerts', icon: Activity, label: 'Duplicates' },
    { to: '/financial-documents', icon: BookOpen, label: 'Financial Docs' },
  ],
}

function StatCardItem({ card, value }: { card: StatCard; value: number | null | undefined }) {
  const Icon = card.icon
  const display = value == null ? '—' : `${value}${card.suffix ?? ''}`

  return (
    <div className="group bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-default">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 ${card.bg} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
          <Icon size={20} className={card.color} />
        </div>
        {card.trend && (
          <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
            {card.trend}
          </span>
        )}
      </div>
      <p className="text-3xl font-extrabold text-gray-900 leading-none mb-1">{display}</p>
      <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{card.label}</p>
    </div>
  )
}

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState<Record<string, number | null>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    dashboardStats()
      .then((r) => setStats(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const role = user?.role as UserRole
  const cards = ROLE_STATS[role] ?? []
  const actions = QUICK_ACTIONS[role] ?? []

  return (
    <Layout>
      {/* Welcome banner */}
      <div className="relative bg-gradient-to-r from-[#2E8B57] to-[#3CB371] rounded-2xl p-8 text-white overflow-hidden shadow-xl mb-8">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white rounded-full" />
          <div className="absolute -right-20 -bottom-20 w-60 h-60 bg-white rounded-full" />
        </div>
        <div className="relative z-10">
          <span className="text-xs font-semibold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full">
            Welcome Back
          </span>
          <h1 className="text-3xl font-bold mt-3 mb-1">{user?.name?.split(' ')[0]} 👋</h1>
          <p className="text-white/80 text-sm">
            {role?.replace('_', ' ')} &nbsp;·&nbsp;{' '}
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Stats grid */}
      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : (
        <>
          <div className={`grid grid-cols-2 ${cards.length >= 4 ? 'lg:grid-cols-3' : 'sm:grid-cols-3'} gap-4 mb-8`}>
            {cards.map((card) => (
              <StatCardItem key={card.key} card={card} value={stats[card.key] as number | null} />
            ))}
          </div>

          {/* Quick actions */}
          {actions.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {actions.map((a) => {
                  const Icon = a.icon
                  return (
                    <Link
                      key={a.to}
                      to={a.to}
                      className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 hover:border-[#2E8B57] hover:bg-green-50 transition-all group text-center"
                    >
                      <Icon size={22} className="text-[#2E8B57] group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-medium text-gray-600 group-hover:text-[#2E8B57]">{a.label}</span>
                    </Link>
                  )
                })}
              </div>
            </div>
          )}
        </>
      )}
    </Layout>
  )
}
