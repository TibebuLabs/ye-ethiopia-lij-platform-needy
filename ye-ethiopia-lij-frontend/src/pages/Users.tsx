import { useEffect, useState, useRef } from 'react'
import Layout from '../components/Layout'
import Spinner from '../components/Spinner'
import StatusBadge from '../components/StatusBadge'
import { listUsers, changeUserStatus } from '../api/auth'
import toast from 'react-hot-toast'
import {
  Users as UsersIcon, Search, ChevronDown, ChevronUp,
  School, MapPin, Phone, User as UserIcon, Hash, Calendar, BookOpen,
  Building2, Mail, Globe,
} from 'lucide-react'
import type { User, UserRole, UserStatus, SchoolProfile, InlineOrganization } from '../types'

const STATUSES: UserStatus[] = ['ACTIVE', 'PENDING', 'SUSPENDED', 'REJECTED']
const ROLES: UserRole[] = ['ADMIN', 'ORG_STAFF', 'SPONSOR', 'SCHOOL', 'GOVERNMENT']

function SchoolDetailPanel({ profile }: { profile: SchoolProfile }) {
  const SCHOOL_TYPE_LABELS: Record<string, string> = {
    PRIMARY: 'Primary School',
    SECONDARY: 'Secondary School',
    PREPARATORY: 'Preparatory School',
    COMBINED: 'Combined (1–12)',
    VOCATIONAL: 'Vocational / TVET',
    OTHER: 'Other',
  }

  const items = [
    { icon: School, label: 'School Name', value: profile.school_name },
    { icon: BookOpen, label: 'Type', value: SCHOOL_TYPE_LABELS[profile.school_type] || profile.school_type },
    { icon: Hash, label: 'Reg. Number', value: profile.registration_number || '—' },
    { icon: MapPin, label: 'Address', value: [profile.address, profile.city, profile.region].filter(Boolean).join(', ') || '—' },
    { icon: Phone, label: 'Phone', value: profile.phone || '—' },
    { icon: UserIcon, label: 'Principal', value: profile.principal_name || '—' },
    { icon: Calendar, label: 'Est. Year', value: profile.established_year || '—' },
  ]

  return (
    <tr>
      <td colSpan={5} className="px-5 pb-4 pt-0 bg-green-50 border-b border-green-100">
        <div className="rounded-xl border border-green-200 bg-white p-4">
          <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-3">School Profile</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {items.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-2">
                <Icon size={14} className="text-green-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-gray-400">{label}</p>
                  <p className="text-sm font-medium text-gray-700">{value}</p>
                </div>
              </div>
            ))}
          </div>
          {profile.description && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-400 mb-1">Description</p>
              <p className="text-sm text-gray-600">{profile.description}</p>
            </div>
          )}
        </div>
      </td>
    </tr>
  )
}

function OrgDetailPanel({ org }: { org: InlineOrganization }) {
  const ORG_TYPE_LABELS: Record<string, string> = {
    ORPHANAGE: 'Orphanage',
    NGO: 'Non-Governmental Organization',
    RELIGIOUS: 'Religion Based Institution',
    OTHER: 'Other',
  }

  const items = [
    { icon: Building2, label: 'Org Name',    value: org.name },
    { icon: Hash,      label: 'Type',         value: ORG_TYPE_LABELS[org.org_type] || org.org_type },
    { icon: Hash,      label: 'Reg. Number',  value: org.registration_number || '—' },
    { icon: MapPin,    label: 'Address',       value: [org.address, org.city].filter(Boolean).join(', ') || '—' },
    { icon: Phone,     label: 'Phone',         value: org.phone || '—' },
    { icon: Mail,      label: 'Email',         value: org.email || '—' },
    { icon: Globe,     label: 'Website',       value: org.website || '—' },
    { icon: Calendar,  label: 'Est. Year',     value: org.established_year ? String(org.established_year) : '—' },
  ]

  return (
    <tr>
      <td colSpan={5} className="px-5 pb-4 pt-0 bg-green-50 border-b border-green-100">
        <div className="rounded-xl border border-green-200 bg-white p-4">
          <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-3">Organization Profile</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {items.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-2">
                <Icon size={14} className="text-green-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-gray-400">{label}</p>
                  <p className="text-sm font-medium text-gray-700">{value}</p>
                </div>
              </div>
            ))}
          </div>
          {org.description && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-400 mb-1">Description</p>
              <p className="text-sm text-gray-600">{org.description}</p>
            </div>
          )}
        </div>
      </td>
    </tr>
  )
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const fetchUsers = (overrides?: { search?: string; role?: string; status?: string }) => {
    setLoading(true)
    const params: Record<string, string> = {}
    const s = overrides?.search !== undefined ? overrides.search : search
    const r = overrides?.role !== undefined ? overrides.role : roleFilter
    const st = overrides?.status !== undefined ? overrides.status : statusFilter
    if (s) params.search = s
    if (r) params.role = r
    if (st) params.status = st
    listUsers(params)
      .then((res) => {
        const data = res.data
        const list: User[] = Array.isArray(data) ? data : data.results
        // sort newest first
        list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        setUsers(list)
      })
      .catch((err: unknown) => {
        const status = (err as { response?: { status?: number } })?.response?.status
        if (status === 403) toast.error('Access denied — admin role required')
        else toast.error('Failed to load users')
      })
      .finally(() => setLoading(false))
  }

  // auto-fetch on search change with debounce
  const handleSearchChange = (value: string) => {
    setSearch(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      fetchUsers({ search: value })
    }, 300)
  }

  // auto-fetch on filter change
  const handleRoleChange = (value: string) => {
    setRoleFilter(value)
    fetchUsers({ role: value })
  }

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value)
    fetchUsers({ status: value })
  }

  useEffect(() => { fetchUsers() }, [])

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await changeUserStatus(id, newStatus)
      toast.success(`Status changed to ${newStatus}`)
      fetchUsers()
    } catch {
      toast.error('Failed to change status')
    }
  }

  const toggleExpand = (id: string) => {
    setExpandedId(prev => prev === id ? null : id)
  }

  return (
    <Layout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-500 text-sm">{users.length} registered users</p>
        </div>
      </div>

      <div className="card mb-5 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input className="input-field pl-9" placeholder="Search by name or email..." value={search}
            onChange={(e) => handleSearchChange(e.target.value)} />
        </div>
        <select className="input-field sm:w-36" value={roleFilter} onChange={(e) => handleRoleChange(e.target.value)}>
          <option value="">All Roles</option>
          {ROLES.map((r) => <option key={r} value={r}>{r.replace('_', ' ')}</option>)}
        </select>
        <select className="input-field sm:w-36" value={statusFilter} onChange={(e) => handleStatusFilterChange(e.target.value)}>
          <option value="">All Statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : users.length === 0 ? (
        <div className="card text-center py-16">
          <UsersIcon size={48} className="text-gray-200 mx-auto mb-4" />
          <p className="text-gray-500">No users found.</p>
        </div>
      ) : (
        <div className="card p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-5 py-3 font-medium text-gray-600">User</th>
                <th className="text-left px-5 py-3 font-medium text-gray-600 hidden sm:table-cell">Role</th>
                <th className="text-left px-5 py-3 font-medium text-gray-600">Status</th>
                <th className="text-left px-5 py-3 font-medium text-gray-600 hidden md:table-cell">Joined</th>
                <th className="px-5 py-3 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map((u) => {
                const isExpanded = expandedId === u.id
                const hasSchoolProfile = u.role === 'SCHOOL' && u.school_profile
                const hasOrgProfile = u.role === 'ORG_STAFF' && u.organization

                return (
                  <>
                    <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3">
                        <div>
                          {/* Show school name for SCHOOL, org name for ORG_STAFF, else user name */}
                          <p className="font-medium text-gray-800">
                            {u.role === 'SCHOOL' && u.school_profile
                              ? u.school_profile.school_name
                              : u.role === 'ORG_STAFF' && u.organization
                                ? u.organization.name
                                : u.name}
                          </p>
                          {(u.role === 'SCHOOL' && u.school_profile) || (u.role === 'ORG_STAFF' && u.organization) ? (
                            <p className="text-xs text-gray-500">{u.name}</p>
                          ) : null}
                          <p className="text-xs text-gray-400">{u.email}</p>
                          {/* School location sub-line */}
                          {u.role === 'SCHOOL' && u.school_profile?.city && (
                            <p className="text-xs text-green-600 flex items-center gap-1 mt-0.5">
                              <MapPin size={10} />
                              {[u.school_profile.city, u.school_profile.region].filter(Boolean).join(', ')}
                            </p>
                          )}
                          {/* Org location sub-line */}
                          {u.role === 'ORG_STAFF' && u.organization?.city && (
                            <p className="text-xs text-green-600 flex items-center gap-1 mt-0.5">
                              <MapPin size={10} />
                              {u.organization.city}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-3 hidden sm:table-cell">
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">
                          {u.role?.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-5 py-3"><StatusBadge status={u.status} /></td>
                      <td className="px-5 py-3 text-gray-400 text-xs hidden md:table-cell">
                        {new Date(u.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <div className="relative inline-block">
                            <select
                              value={u.status}
                              onChange={(e) => handleStatusChange(u.id, e.target.value)}
                              className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 pr-6 bg-white focus:outline-none focus:ring-1 focus:ring-green-500 appearance-none cursor-pointer"
                            >
                              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                            </select>
                            <ChevronDown size={12} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                          </div>
                          {hasSchoolProfile && (
                            <button
                              onClick={() => toggleExpand(u.id)}
                              className="p-1.5 rounded-lg hover:bg-green-50 text-green-600 transition-colors"
                              title="View school details"
                            >
                              {isExpanded ? <ChevronUp size={14} /> : <School size={14} />}
                            </button>
                          )}
                          {hasOrgProfile && (
                            <button
                              onClick={() => toggleExpand(u.id)}
                              className="p-1.5 rounded-lg hover:bg-green-50 text-green-600 transition-colors"
                              title="View organization details"
                            >
                              {isExpanded ? <ChevronUp size={14} /> : <Building2 size={14} />}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                    {isExpanded && hasSchoolProfile && (
                      <SchoolDetailPanel key={`${u.id}-detail`} profile={u.school_profile!} />
                    )}
                    {isExpanded && hasOrgProfile && (
                      <OrgDetailPanel key={`${u.id}-org`} org={u.organization!} />
                    )}
                  </>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  )
}
