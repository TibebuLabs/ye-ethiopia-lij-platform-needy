import { useEffect, useState, useRef } from 'react'
import Layout from '../components/Layout'
import Spinner from '../components/Spinner'
import StatusBadge from '../components/StatusBadge'
import { pmListPendingUsers, pmForwardUser } from '../api/auth'
import { mediaUrl } from '../api/axios'
import toast from 'react-hot-toast'
import {
  Building2, User as UserIcon, Search, FileText,
  X, MessageSquare, Send, MapPin, Phone, Mail,
  Globe, Hash, Calendar, School, BookOpen, ShieldCheck,
} from 'lucide-react'
import DocLink from '../components/DocLink'
import type { User, InlineOrganization, SchoolProfile } from '../types'

const ROLE_LABELS: Record<string, string> = {
  ORG_STAFF: 'Organization',
  SPONSOR: 'Sponsor',
  SCHOOL: 'School',
  GOVERNMENT: 'Government',
}

const ORG_TYPE_LABELS: Record<string, string> = {
  ORPHANAGE: 'Orphanage',
  NGO: 'Non-Governmental Organization',
  RELIGIOUS: 'Religion Based Institution',
  OTHER: 'Other',
}



// ── Review + Forward Modal ────────────────────────────────────────────────────
function ReviewModal({ user, onClose, onForwarded }: {
  user: User
  onClose: () => void
  onForwarded: (id: string) => void
}) {
  const [notes, setNotes] = useState('')
  const [sending, setSending] = useState(false)
  const o = user.organization as InlineOrganization | null
  const sp = user.school_profile as SchoolProfile | null

  const handleForward = async () => {
    if (!notes.trim()) { toast.error('Add your review notes before forwarding'); return }
    setSending(true)
    try {
      await pmForwardUser(user.id, notes)
      toast.success('Forwarded to Admin with your notes')
      onForwarded(user.id)
      onClose()
    } catch {
      toast.error('Failed to forward to Admin')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-green-700 to-green-500 rounded-t-2xl p-5 text-white flex items-start justify-between">
          <div>
            <h2 className="font-bold text-lg">{o?.name || sp?.school_name || user.name}</h2>
            <p className="text-green-100 text-sm mt-0.5">
              {ROLE_LABELS[user.role] || user.role} · {user.email}
            </p>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white ml-4 flex-shrink-0">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Status + date */}
          <div className="flex items-center gap-3">
            <StatusBadge status={user.status} />
            <span className="text-xs text-gray-400">
              Registered {new Date(user.created_at).toLocaleDateString()}
            </span>
          </div>

          {/* Org details */}
          {o && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Organization Info</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: Building2, label: 'Type',       value: ORG_TYPE_LABELS[o.org_type] || o.org_type },
                  { icon: Hash,      label: 'Reg. No.',   value: o.registration_number || '—' },
                  { icon: MapPin,    label: 'City',        value: o.city || '—' },
                  { icon: Phone,     label: 'Phone',       value: o.phone || '—' },
                  { icon: Mail,      label: 'Org Email',   value: o.email || '—' },
                  { icon: Globe,     label: 'Website',     value: o.website || '—' },
                  { icon: Calendar,  label: 'Est. Year',   value: o.established_year ? String(o.established_year) : '—' },
                  { icon: UserIcon,  label: 'Owner',       value: user.name },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-2">
                    <Icon size={13} className="text-green-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-gray-400">{label}</p>
                      <p className="text-sm font-medium text-gray-700 break-words">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
              {o.description && (
                <p className="mt-3 text-sm text-gray-600 bg-gray-50 rounded-xl p-3">{o.description}</p>
              )}
            </div>
          )}

          {/* School details */}
          {sp && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">School Info</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: School,    label: 'School Name', value: sp.school_name },
                  { icon: BookOpen,  label: 'Type',        value: sp.school_type },
                  { icon: Hash,      label: 'Reg. No.',    value: sp.registration_number || '—' },
                  { icon: MapPin,    label: 'Location',    value: [sp.city, sp.region].filter(Boolean).join(', ') || '—' },
                  { icon: Phone,     label: 'Phone',       value: sp.phone || '—' },
                  { icon: UserIcon,  label: 'Principal',   value: sp.principal_name || '—' },
                  { icon: Calendar,  label: 'Est. Year',   value: sp.established_year || '—' },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-2">
                    <Icon size={13} className="text-green-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-gray-400">{label}</p>
                      <p className="text-sm font-medium text-gray-700">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sponsor / Government basic info */}
          {(user.role === 'SPONSOR' || user.role === 'GOVERNMENT') && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                {ROLE_LABELS[user.role]} Info
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-start gap-2">
                  <UserIcon size={13} className="text-green-500 mt-0.5" />
                  <div><p className="text-xs text-gray-400">Full Name</p><p className="text-sm font-medium text-gray-700">{user.name}</p></div>
                </div>
                <div className="flex items-start gap-2">
                  <Mail size={13} className="text-green-500 mt-0.5" />
                  <div><p className="text-xs text-gray-400">Email</p><p className="text-sm font-medium text-gray-700">{user.email}</p></div>
                </div>
              </div>
            </div>
          )}

          {/* Documents */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck size={14} className="text-green-600" />
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Submitted Documents</p>
            </div>
            <div className="space-y-2">
              {o?.license_document && (
                <DocLink url={mediaUrl(o.license_document)} label="Organization License / Registration" />
              )}
              {o?.logo && (
                <DocLink url={mediaUrl(o.logo)} label="Organization Logo" />
              )}
              <DocLink
                url={user.verification_document ? mediaUrl(user.verification_document) : null}
                label="Owner / Personal Verification Document"
              />
            </div>
          </div>

          {/* PM Notes + Forward to Admin */}
          <div className="border-t border-gray-100 pt-5">
            <div className="flex items-center gap-2 mb-1">
              <MessageSquare size={14} className="text-yellow-600" />
              <p className="text-sm font-semibold text-gray-700">Your Review Notes</p>
            </div>
            <p className="text-xs text-gray-400 mb-3">
              After verifying the legitimacy of the data and documents, add your notes and forward to Admin for final approval or rejection.
            </p>
            <textarea
              rows={4}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="e.g. Documents verified. Registration number confirmed. Organization appears legitimate. Recommend approval."
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none"
            />
            <div className="flex gap-3 mt-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl"
              >
                Close
              </button>
              <button
                onClick={handleForward}
                disabled={!notes.trim() || sending}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold bg-green-600 hover:bg-green-700 text-white rounded-xl disabled:opacity-50"
              >
                {sending ? <Spinner size="sm" /> : <Send size={14} />}
                Forward to Admin
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function PMRegistrations() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('PENDING')
  const [selected, setSelected] = useState<User | null>(null)
  const [forwarded, setForwarded] = useState<Set<string>>(new Set())
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const fetchUsers = (overrides?: { search?: string }) => {
    setLoading(true)
    const params: Record<string, string> = {}
    if (statusFilter) params.status = statusFilter
    const s = overrides?.search !== undefined ? overrides.search : search
    if (s) params.search = s
    if (roleFilter) params.role = roleFilter
    pmListPendingUsers(params)
      .then(r => {
        const data = r.data
        const list: User[] = Array.isArray(data) ? data : data.results
        list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        setUsers(list)
      })
      .catch(() => toast.error('Failed to load registrations'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchUsers() }, [statusFilter, roleFilter])

  const handleSearchChange = (value: string) => {
    setSearch(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => fetchUsers({ search: value }), 300)
  }

  const handleForwarded = (id: string) => {
    setForwarded(prev => new Set([...prev, id]))
  }

  return (
    <Layout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Registrations</h1>
          <p className="text-gray-500 text-sm">
            Review registrations, verify documents, then forward to Admin for final decision
          </p>
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
        <select className="input-field sm:w-36" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="ACTIVE">Active</option>
          <option value="REJECTED">Rejected</option>
          <option value="SUSPENDED">Suspended</option>
        </select>
        <select className="input-field sm:w-40" value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
          <option value="">All Types</option>
          <option value="ORG_STAFF">Organization</option>
          <option value="SPONSOR">Sponsor</option>
          <option value="SCHOOL">School</option>
          <option value="GOVERNMENT">Government</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : users.length === 0 ? (
        <div className="card text-center py-16">
          <UserIcon size={48} className="text-gray-200 mx-auto mb-4" />
          <p className="text-gray-500">
            {statusFilter === 'PENDING' ? 'No pending registrations.' : 'No users found.'}
          </p>
        </div>
      ) : (
        <div className="card p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-5 py-3 font-medium text-gray-600">Registrant</th>
                <th className="text-left px-5 py-3 font-medium text-gray-600 hidden sm:table-cell">Type</th>
                <th className="text-left px-5 py-3 font-medium text-gray-600">Status</th>
                <th className="text-left px-5 py-3 font-medium text-gray-600 hidden md:table-cell">Date</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map(u => {
                const o = u.organization as InlineOrganization | null
                const sp = u.school_profile as SchoolProfile | null
                const displayName = o?.name || sp?.school_name || u.name
                const isForwarded = forwarded.has(u.id)

                return (
                  <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                          {u.role === 'ORG_STAFF'
                            ? <Building2 size={14} className="text-green-600" />
                            : u.role === 'SCHOOL'
                              ? <School size={14} className="text-green-600" />
                              : <UserIcon size={14} className="text-green-600" />}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{displayName}</p>
                          <p className="text-xs text-gray-400">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 hidden sm:table-cell">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">
                        {ROLE_LABELS[u.role] || u.role}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      {isForwarded ? (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                          Forwarded to Admin
                        </span>
                      ) : (
                        <StatusBadge status={u.status} />
                      )}
                    </td>
                    <td className="px-5 py-3 text-gray-400 text-xs hidden md:table-cell">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3">
                      <button
                        onClick={() => setSelected(u)}
                        className="text-green-600 hover:underline text-xs font-medium"
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <ReviewModal
          user={selected}
          onClose={() => setSelected(null)}
          onForwarded={handleForwarded}
        />
      )}
    </Layout>
  )
}
