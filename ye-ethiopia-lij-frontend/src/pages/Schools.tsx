import { useEffect, useState, useRef } from 'react'
import Layout from '../components/Layout'
import Spinner from '../components/Spinner'
import StatusBadge from '../components/StatusBadge'
import { listUsers, changeUserStatus } from '../api/auth'
import toast from 'react-hot-toast'
import {
  School, MapPin, Phone, User as UserIcon, Hash,
  Calendar, BookOpen, X, ChevronDown, Search, Mail, ShieldCheck,
} from 'lucide-react'
import DocLink from '../components/DocLink'
import type { User, UserStatus, SchoolProfile } from '../types'

const STATUSES: UserStatus[] = ['ACTIVE', 'PENDING', 'SUSPENDED', 'REJECTED']

const SCHOOL_TYPE_LABELS: Record<string, string> = {
  PRIMARY: 'Primary School',
  SECONDARY: 'Secondary School',
  PREPARATORY: 'Preparatory School',
  COMBINED: 'Combined (1–12)',
  VOCATIONAL: 'Vocational / TVET',
  OTHER: 'Other',
}

function SchoolModal({ user, onClose, onStatusChange }: {
  user: User
  onClose: () => void
  onStatusChange: (id: string, status: string) => void
}) {
  const p = user.school_profile as SchoolProfile

  const rows = [
    { icon: BookOpen,  label: 'School Type',        value: SCHOOL_TYPE_LABELS[p?.school_type] || p?.school_type || '—' },
    { icon: Hash,      label: 'Reg. Number',         value: p?.registration_number || '—' },
    { icon: MapPin,    label: 'Address',              value: [p?.address, p?.city, p?.region].filter(Boolean).join(', ') || '—' },
    { icon: Phone,     label: 'Phone',                value: p?.phone || '—' },
    { icon: UserIcon,  label: 'Principal',            value: p?.principal_name || '—' },
    { icon: Calendar,  label: 'Established',          value: p?.established_year || '—' },
    { icon: Mail,      label: 'Account Email',        value: user.email },
    { icon: UserIcon,  label: 'Account Holder',       value: user.name },
  ]

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-slideIn"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-500 rounded-t-2xl p-6 text-white">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                <School size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold">{p?.school_name || user.name}</h2>
                {p?.city && (
                  <p className="text-green-100 text-sm flex items-center gap-1 mt-0.5">
                    <MapPin size={12} /> {[p.city, p.region].filter(Boolean).join(', ')}
                  </p>
                )}
              </div>
            </div>
            <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>
          <div className="mt-3">
            <StatusBadge status={user.status} />
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          {!p ? (
            <div>
              <div className="text-center py-6 text-gray-400">
                <School size={40} className="mx-auto mb-2 opacity-30" />
                <p className="text-sm">No school profile submitted yet.</p>
              </div>
              {/* Still show document if uploaded */}
              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 mb-3">
                  <ShieldCheck size={15} className="text-green-600" />
                  <p className="text-sm font-semibold text-gray-700">Submitted Documents</p>
                </div>
                <DocLink url={user.verification_document} label="Verification Document" />
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4 mb-4">
                {rows.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-2">
                    <Icon size={14} className="text-green-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-gray-400">{label}</p>
                      <p className="text-sm font-medium text-gray-700 break-words">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
              {p.description && (
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-400 mb-1">Description</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{p.description}</p>
                </div>
              )}

              {/* Documents */}
              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 mb-3">
                  <ShieldCheck size={15} className="text-green-600" />
                  <p className="text-sm font-semibold text-gray-700">Submitted Documents</p>
                </div>
                <div className="space-y-2">
                  <DocLink url={user.verification_document} label="Verification Document" />
                </div>
              </div>
            </>
          )}

          {/* Status change */}
          <div className="mt-5 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-400 mb-2">Change Account Status</p>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <select
                  value={user.status}
                  onChange={e => onStatusChange(user.id, e.target.value)}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 pr-8 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none"
                >
                  {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="mt-4 text-xs text-gray-400">
            Registered: {new Date(user.created_at).toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function Schools() {
  const [schools, setSchools] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [selected, setSelected] = useState<User | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const fetchSchools = (overrides?: { search?: string; status?: string }) => {
    setLoading(true)
    const params: Record<string, string> = { role: 'SCHOOL' }
    const s = overrides?.search !== undefined ? overrides.search : search
    const st = overrides?.status !== undefined ? overrides.status : statusFilter
    if (s) params.search = s
    if (st) params.status = st
    listUsers(params)
      .then(r => {
        const data = r.data
        const list: User[] = Array.isArray(data) ? data : data.results
        list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        setSchools(list)
      })
      .catch(() => toast.error('Failed to load schools'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchSchools() }, [])

  const handleSearchChange = (value: string) => {
    setSearch(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => fetchSchools({ search: value }), 300)
  }

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value)
    fetchSchools({ status: value })
  }

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await changeUserStatus(id, newStatus)
      toast.success(`Status changed to ${newStatus}`)
      // Update local state
      setSchools(prev => prev.map(s => s.id === id ? { ...s, status: newStatus as UserStatus } : s))
      setSelected(prev => prev && prev.id === id ? { ...prev, status: newStatus as UserStatus } : prev)
    } catch {
      toast.error('Failed to change status')
    }
  }

  return (
    <Layout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Schools</h1>
          <p className="text-gray-500 text-sm">{schools.length} registered schools</p>
        </div>
      </div>

      {/* Filters */}
      <div className="card mb-5 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            className="input-field pl-9"
            placeholder="Search by name or email..."
            value={search}
            onChange={e => handleSearchChange(e.target.value)}
          />
        </div>
        <select className="input-field sm:w-36" value={statusFilter} onChange={e => handleStatusFilterChange(e.target.value)}>
          <option value="">All Statuses</option>
          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : schools.length === 0 ? (
        <div className="card text-center py-16">
          <School size={48} className="text-gray-200 mx-auto mb-4" />
          <p className="text-gray-500">No schools found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {schools.map(school => {
            const p = school.school_profile
            return (
              <div
                key={school.id}
                onClick={() => setSelected(school)}
                className="card cursor-pointer hover:shadow-md hover:border-green-200 transition-all group"
              >
                {/* Card header */}
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-11 h-11 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0 group-hover:bg-green-200 transition-colors">
                    <School size={20} className="text-green-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-gray-800 truncate">
                      {p?.school_name || school.name}
                    </h3>
                    {p?.school_type && (
                      <p className="text-xs text-gray-400 mt-0.5">
                        {SCHOOL_TYPE_LABELS[p.school_type] || p.school_type}
                      </p>
                    )}
                  </div>
                  <StatusBadge status={school.status} />
                </div>

                {/* Info rows */}
                <div className="space-y-1.5 text-sm text-gray-500">
                  {p?.city && (
                    <p className="flex items-center gap-1.5">
                      <MapPin size={13} className="text-green-400 shrink-0" />
                      {[p.city, p.region].filter(Boolean).join(', ')}
                    </p>
                  )}
                  {p?.phone && (
                    <p className="flex items-center gap-1.5">
                      <Phone size={13} className="text-green-400 shrink-0" />
                      {p.phone}
                    </p>
                  )}
                  {p?.principal_name && (
                    <p className="flex items-center gap-1.5">
                      <UserIcon size={13} className="text-green-400 shrink-0" />
                      {p.principal_name}
                    </p>
                  )}
                  {!p && (
                    <p className="text-xs text-amber-500 italic">No profile submitted</p>
                  )}
                </div>

                <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between">
                  <p className="text-xs text-gray-400">{school.email}</p>
                  <span className="text-xs text-green-600 font-medium group-hover:underline">View details →</span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {selected && (
        <SchoolModal
          user={selected}
          onClose={() => setSelected(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </Layout>
  )
}
