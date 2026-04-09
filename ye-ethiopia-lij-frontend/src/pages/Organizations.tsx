import { useEffect, useState, useRef } from 'react'
import Layout from '../components/Layout'
import Spinner from '../components/Spinner'
import StatusBadge from '../components/StatusBadge'
import { listUsers, changeUserStatus } from '../api/auth'
import toast from 'react-hot-toast'
import {
  Building2, MapPin, Phone, Mail, Globe, Hash,
  User as UserIcon, Calendar, X, ChevronDown, Search, ShieldCheck,
} from 'lucide-react'
import DocLink from '../components/DocLink'
import type { User, UserStatus, InlineOrganization } from '../types'

const STATUSES: UserStatus[] = ['ACTIVE', 'PENDING', 'SUSPENDED', 'REJECTED']

const ORG_TYPE_LABELS: Record<string, string> = {
  ORPHANAGE: 'Orphanage',
  NGO: 'Non-Governmental Organization',
  RELIGIOUS: 'Religion Based Institution',
  OTHER: 'Other',
}


// ── Detail Modal ──────────────────────────────────────────────────────────────
function OrgModal({ user, onClose, onStatusChange }: {
  user: User
  onClose: () => void
  onStatusChange: (id: string, status: string) => void
}) {
  const o = user.organization as InlineOrganization

  const rows = [
    { icon: Building2, label: 'Type',        value: ORG_TYPE_LABELS[o?.org_type] || o?.org_type || '—' },
    { icon: Hash,      label: 'Reg. Number', value: o?.registration_number || '—' },
    { icon: MapPin,    label: 'Address',      value: [o?.address, o?.city].filter(Boolean).join(', ') || '—' },
    { icon: Phone,     label: 'Phone',        value: o?.phone || '—' },
    { icon: Mail,      label: 'Org Email',    value: o?.email || '—' },
    { icon: Globe,     label: 'Website',      value: o?.website || '—' },
    { icon: Calendar,  label: 'Established',  value: o?.established_year ? String(o.established_year) : '—' },
    { icon: Mail,      label: 'Owner Email',  value: user.email },
    { icon: UserIcon,  label: 'Owner',        value: user.name },
  ]

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-slideIn"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-green-700 to-green-500 rounded-t-2xl p-6 text-white">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              {o?.logo ? (
                <img src={o.logo} alt={o.name} className="w-12 h-12 rounded-xl object-cover border-2 border-white/30" />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                  <Building2 size={24} className="text-white" />
                </div>
              )}
              <div>
                <h2 className="text-lg font-bold">{o?.name || user.name}</h2>
                {o?.city && (
                  <p className="text-green-100 text-sm flex items-center gap-1 mt-0.5">
                    <MapPin size={12} /> {o.city}
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
          {!o ? (
            <div>
              <div className="text-center py-6 text-gray-400">
                <Building2 size={40} className="mx-auto mb-2 opacity-30" />
                <p className="text-sm">No organization profile submitted yet.</p>
              </div>
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
              {o.description && (
                <p className="text-sm text-gray-600 leading-relaxed pb-4 border-b border-gray-100 mb-4">
                  {o.description}
                </p>
              )}

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

              {/* Documents */}
              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 mb-3">
                  <ShieldCheck size={15} className="text-green-600" />
                  <p className="text-sm font-semibold text-gray-700">Submitted Documents</p>
                </div>
                <div className="space-y-2">
                  <DocLink url={o.license_document} label="Organization License / Registration" />
                  <DocLink url={user.verification_document} label="Owner Verification Document" />
                </div>
              </div>
            </>
          )}

          {/* Status change */}
          <div className="mt-5 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-400 mb-2">Change Account Status</p>
            <div className="relative">
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

          <div className="mt-4 text-xs text-gray-400">
            Registered: {new Date(user.created_at).toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function Organizations() {
  const [orgs, setOrgs] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [selected, setSelected] = useState<User | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const fetchOrgs = (overrides?: { search?: string; status?: string }) => {
    setLoading(true)
    const params: Record<string, string> = { role: 'ORG_STAFF' }
    const s = overrides?.search !== undefined ? overrides.search : search
    const st = overrides?.status !== undefined ? overrides.status : statusFilter
    if (s) params.search = s
    if (st) params.status = st
    listUsers(params)
      .then(r => {
        const data = r.data
        const list: User[] = Array.isArray(data) ? data : data.results
        list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        setOrgs(list)
      })
      .catch(() => toast.error('Failed to load organizations'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchOrgs() }, [])

  const handleSearchChange = (value: string) => {
    setSearch(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => fetchOrgs({ search: value }), 300)
  }

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value)
    fetchOrgs({ status: value })
  }

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await changeUserStatus(id, newStatus)
      toast.success(`Status changed to ${newStatus}`)
      setOrgs(prev => prev.map(o => o.id === id ? { ...o, status: newStatus as UserStatus } : o))
      setSelected(prev => prev && prev.id === id ? { ...prev, status: newStatus as UserStatus } : prev)
    } catch {
      toast.error('Failed to change status')
    }
  }

  return (
    <Layout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Organizations</h1>
          <p className="text-gray-500 text-sm">{orgs.length} registered organizations</p>
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
      ) : orgs.length === 0 ? (
        <div className="card text-center py-16">
          <Building2 size={48} className="text-gray-200 mx-auto mb-4" />
          <p className="text-gray-500">No organizations found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {orgs.map(user => {
            const o = user.organization
            return (
              <div
                key={user.id}
                onClick={() => setSelected(user)}
                className="card cursor-pointer hover:shadow-md hover:border-green-200 transition-all group"
              >
                {/* Card header */}
                <div className="flex items-start gap-3 mb-3">
                  {o?.logo ? (
                    <img src={o.logo} alt={o.name} className="w-11 h-11 rounded-xl object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-11 h-11 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0 group-hover:bg-green-200 transition-colors">
                      <Building2 size={20} className="text-green-600" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-gray-800 truncate">
                      {o?.name || user.name}
                    </h3>
                    {o?.org_type && (
                      <p className="text-xs text-gray-400 mt-0.5">
                        {ORG_TYPE_LABELS[o.org_type] || o.org_type}
                      </p>
                    )}
                  </div>
                  <StatusBadge status={user.status} />
                </div>

                {/* Info rows */}
                <div className="space-y-1.5 text-sm text-gray-500">
                  {o?.city && (
                    <p className="flex items-center gap-1.5">
                      <MapPin size={13} className="text-green-400 shrink-0" /> {o.city}
                    </p>
                  )}
                  {o?.phone && (
                    <p className="flex items-center gap-1.5">
                      <Phone size={13} className="text-green-400 shrink-0" /> {o.phone}
                    </p>
                  )}
                  {user.name && (
                    <p className="flex items-center gap-1.5">
                      <UserIcon size={13} className="text-green-400 shrink-0" /> {user.name}
                    </p>
                  )}
                  {!o && (
                    <p className="text-xs text-amber-500 italic">No organization profile submitted</p>
                  )}
                </div>

                <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between">
                  <p className="text-xs text-gray-400 truncate">{user.email}</p>
                  <span className="text-xs text-green-600 font-medium group-hover:underline flex-shrink-0 ml-2">View details →</span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {selected && (
        <OrgModal
          user={selected}
          onClose={() => setSelected(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </Layout>
  )
}
