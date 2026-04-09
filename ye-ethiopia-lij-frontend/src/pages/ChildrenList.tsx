import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import Spinner from '../components/Spinner'
import StatusBadge from '../components/StatusBadge'
import { listAllChildren, patchChildStatus, rejectChild, pmFlagChild } from '../api/children'
import { mediaUrl } from '../api/axios'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import {
  Plus, Search, User, CheckCircle, XCircle, AlertTriangle,
  MessageSquare, X, MapPin, Calendar, Shield, Building2, Users,
  FileText, ExternalLink, Eye, Download,
} from 'lucide-react'
import { downloadFile } from '../utils/download'
import type { ChildProfile } from '../types'

// ── Reject modal (Admin only) ─────────────────────────────────────────────────
function RejectModal({ childName, onConfirm, onCancel }: {
  childName: string
  onConfirm: (reason: string) => void
  onCancel: () => void
}) {
  const [reason, setReason] = useState('')
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
            <AlertTriangle size={20} className="text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Reject Profile</h3>
            <p className="text-xs text-gray-500">{childName}</p>
          </div>
        </div>
        <p className="text-sm text-gray-500 mb-4">
          The org staff will be notified with your reason and can make corrections and resubmit.
        </p>
        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
          Rejection reason <span className="text-red-500">*</span>
        </label>
        <textarea
          rows={3}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Explain what needs to be corrected..."
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400 resize-none mb-4"
        />
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl">
            Cancel
          </button>
          <button
            onClick={() => onConfirm(reason)}
            disabled={!reason.trim()}
            className="flex-1 px-4 py-2.5 text-sm font-semibold bg-red-600 hover:bg-red-700 text-white rounded-xl disabled:opacity-50"
          >
            Reject & Notify
          </button>
        </div>
      </div>
    </div>
  )
}

// ── PM Notes modal (PM only — review notes, notifies admin) ──────────────────
function PMNotesModal({ childName, onConfirm, onCancel }: {
  childName: string
  onConfirm: (notes: string) => void
  onCancel: () => void
}) {
  const [notes, setNotes] = useState('')
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center">
            <MessageSquare size={20} className="text-yellow-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Add Review Notes</h3>
            <p className="text-xs text-gray-500">{childName}</p>
          </div>
        </div>
        <p className="text-sm text-gray-500 mb-4">
          Your notes will be forwarded to the Admin for final decision. You are reviewing — not approving or rejecting.
        </p>
        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
          Review notes <span className="text-red-500">*</span>
        </label>
        <textarea
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Describe your findings or concerns..."
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none mb-4"
        />
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl">
            Cancel
          </button>
          <button
            onClick={() => onConfirm(notes)}
            disabled={!notes.trim()}
            className="flex-1 px-4 py-2.5 text-sm font-semibold bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl disabled:opacity-50"
          >
            Send to Admin
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Child Review Modal (Admin) ────────────────────────────────────────────────
function ChildReviewModal({ child, onClose, onApprove, onReject }: {
  child: ChildProfile
  onClose: () => void
  onApprove: (id: string) => void
  onReject: (child: ChildProfile) => void
}) {
  const photoUrl = child.photo ? mediaUrl(child.photo) : null
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-green-700 to-green-500 rounded-t-2xl p-5 text-white flex items-start justify-between">
          <div className="flex items-center gap-3">
            {photoUrl ? (
              <img src={photoUrl} alt={child.full_name} className="w-14 h-14 rounded-xl object-cover border-2 border-white/30 flex-shrink-0" />
            ) : (
              <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                <User size={24} className="text-white" />
              </div>
            )}
            <div>
              <h2 className="font-bold text-lg">{child.full_name}</h2>
              <p className="text-green-100 text-sm flex items-center gap-2 mt-0.5">
                <Calendar size={12} /> {child.age} yrs · {child.gender}
                <MapPin size={12} className="ml-1" /> {child.location}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white flex-shrink-0 ml-4">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Key info grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              { icon: Shield, label: 'Vulnerability', value: child.vulnerability_status },
              { icon: Building2, label: 'Organization', value: child.organization_name || '—' },
              { icon: Calendar, label: 'Registered', value: new Date(child.created_at).toLocaleDateString() },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="bg-gray-50 rounded-xl p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <Icon size={13} className="text-green-500" />
                  <p className="text-xs text-gray-400 font-medium">{label}</p>
                </div>
                <p className="text-sm font-semibold text-gray-800">{value}</p>
              </div>
            ))}
          </div>

          {/* Biography */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <User size={14} className="text-green-500" />
              <p className="text-sm font-semibold text-gray-700">Biography</p>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 rounded-xl p-4 whitespace-pre-wrap">
              {child.biography || 'No biography provided.'}
            </p>
          </div>

          {/* Guardian info */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Users size={14} className="text-blue-500" />
              <p className="text-sm font-semibold text-gray-700">Guardian Information</p>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 rounded-xl p-4 whitespace-pre-wrap">
              {child.guardian_info || 'No guardian information provided.'}
            </p>
          </div>

          {/* Supporting docs */}
          {child.supporting_docs && (
            <div className="flex items-center gap-3 border border-green-100 rounded-xl p-3 hover:border-green-300 hover:bg-green-50 transition-all">
              <FileText size={16} className="text-green-600 flex-shrink-0" />
              <span className="text-sm font-medium text-gray-700 flex-1">Supporting Documents</span>
              <a href={mediaUrl(child.supporting_docs)!} target="_blank" rel="noreferrer"
                className="p-1 rounded-lg hover:bg-green-100 text-green-600" title="Open">
                <ExternalLink size={13} />
              </a>
              <button
                onClick={() => downloadFile(mediaUrl(child.supporting_docs)!).catch(() => {})}
                className="p-1 rounded-lg hover:bg-green-100 text-green-600" title="Download"
              >
                <Download size={13} />
              </button>
            </div>
          )}

          {/* PM notes */}
          {child.pm_notes && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3">
              <MessageSquare size={15} className="text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-yellow-700 mb-1">Project Manager Notes</p>
                <p className="text-sm text-yellow-800 whitespace-pre-wrap">{child.pm_notes}</p>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-3 pt-2 border-t border-gray-100">
            <button
              onClick={() => onReject(child)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-50 hover:bg-red-100 text-red-600 font-semibold rounded-xl border border-red-200 transition-colors"
            >
              <XCircle size={16} /> Reject
            </button>
            <button
              onClick={() => onApprove(child.id)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-colors"
            >
              <CheckCircle size={16} /> Approve & Publish
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ChildrenList() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [children, setChildren] = useState<ChildProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const fetchChildren = (overrides?: { search?: string; status?: string }) => {
    setLoading(true)
    const params: Record<string, string> = {}
    const s = overrides?.search !== undefined ? overrides.search : search
    const st = overrides?.status !== undefined ? overrides.status : statusFilter
    if (s) params.search = s
    if (st) params.status = st
    listAllChildren(params)
      .then((r) => {
        const data = r.data
        const list: ChildProfile[] = Array.isArray(data) ? data : data.results
        list.sort((a, b) => new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime())
        setChildren(list)
      })
      .catch((err: unknown) => {
        const s = (err as { response?: { status?: number } })?.response?.status
        if (s === 403) toast.error('Access denied — account must be ACTIVE')
        else toast.error('Failed to load children')
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchChildren() }, [])

  const isAdmin = user?.role === 'ADMIN'
  const isPM = user?.role === 'PROJECT_MANAGER'

  const handleSearchChange = (value: string) => {
    setSearch(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => fetchChildren({ search: value }), 300)
  }

  const handleStatusChange = (value: string) => {
    setStatusFilter(value)
    fetchChildren({ status: value })
  }

  const [rejectModal, setRejectModal] = useState<ChildProfile | null>(null)
  const [pmNotesModal, setPmNotesModal] = useState<ChildProfile | null>(null)
  const [reviewModal, setReviewModal] = useState<ChildProfile | null>(null)

  const handleApprove = async (id: string) => {
    try {
      await patchChildStatus(id, 'PUBLISHED')
      toast.success('Child profile approved and published')
      fetchChildren()
    } catch (err: unknown) {
      const data = (err as { response?: { data?: Record<string, unknown> } })?.response?.data
      const msg =
        (data?.error as { message?: string })?.message ??
        (Object.values(data ?? {})[0] as string[])?.[0] ??
        'Failed to approve'
      toast.error(msg)
    }
  }

  const handleRejectConfirm = async (reason: string) => {
    if (!rejectModal) return
    const child = rejectModal
    setRejectModal(null)
    try {
      await rejectChild(child.id, reason)
      toast.success('Profile rejected — org staff notified with reason')
      fetchChildren()
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: { message?: string } } } })
          ?.response?.data?.error?.message ?? 'Failed to reject'
      toast.error(msg)
    }
  }

  const handlePMNotesConfirm = async (notes: string) => {
    if (!pmNotesModal) return
    const child = pmNotesModal
    setPmNotesModal(null)
    try {
      await pmFlagChild(child.id, notes)
      toast.success('Notes sent to Admin for review')
      fetchChildren()
    } catch {
      toast.error('Failed to send notes')
    }
  }

  return (
    <Layout>
      {rejectModal && (
        <RejectModal
          childName={rejectModal.full_name}
          onConfirm={handleRejectConfirm}
          onCancel={() => setRejectModal(null)}
        />
      )}
      {pmNotesModal && (
        <PMNotesModal
          childName={pmNotesModal.full_name}
          onConfirm={handlePMNotesConfirm}
          onCancel={() => setPmNotesModal(null)}
        />
      )}
      {reviewModal && isAdmin && (
        <ChildReviewModal
          child={reviewModal}
          onClose={() => setReviewModal(null)}
          onApprove={(id) => { setReviewModal(null); handleApprove(id) }}
          onReject={(c) => { setReviewModal(null); setRejectModal(c) }}
        />
      )}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Children</h1>
          <p className="text-gray-500 text-sm">{children.length} profiles</p>
        </div>
        {user?.role === 'ORG_STAFF' && (
          <button onClick={() => navigate('/children/register')} className="btn-primary flex items-center gap-2">
            <Plus size={16} /> Register Child
          </button>
        )}
      </div>

      <div className="card mb-5 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input className="input-field pl-9" placeholder="Search..." value={search}
            onChange={(e) => handleSearchChange(e.target.value)} />
        </div>
        {(isAdmin || isPM) && (
          <select className="input-field sm:w-40" value={statusFilter} onChange={(e) => handleStatusChange(e.target.value)}>
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="PUBLISHED">Published</option>
            <option value="SPONSORED">Sponsored</option>
            <option value="REJECTED">Rejected</option>
          </select>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : (
        <div className="card p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-5 py-3 font-medium text-gray-600">Child</th>
                <th className="text-left px-5 py-3 font-medium text-gray-600 hidden sm:table-cell">Age</th>
                <th className="text-left px-5 py-3 font-medium text-gray-600 hidden md:table-cell">Location</th>
                <th className="text-left px-5 py-3 font-medium text-gray-600">Status</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {children.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      {c.photo ? (
                        <img src={mediaUrl(c.photo)!} alt={c.full_name} className="w-8 h-8 rounded-full object-cover" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                          <User size={14} className="text-green-600" />
                        </div>
                      )}
                      <div>
                        <span className="font-medium text-gray-800">{c.full_name}</span>
                        {/* PM notes indicator for Admin */}
                        {isAdmin && c.pm_notes && (
                          <span className="ml-2 inline-flex items-center gap-1 text-xs bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded-full">
                            <MessageSquare size={10} /> PM note
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-gray-500 hidden sm:table-cell">{c.age}</td>
                  <td className="px-5 py-3 text-gray-500 hidden md:table-cell">{c.location}</td>
                  <td className="px-5 py-3"><StatusBadge status={c.status} /></td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => navigate(`/children/${c.id}`)} className="text-green-600 hover:underline text-xs font-medium flex items-center gap-1">
                        <Eye size={13} /> View
                      </button>
                      {/* Admin: open review modal on PENDING */}
                      {isAdmin && c.status === 'PENDING' && (
                        <button
                          onClick={() => setReviewModal(c)}
                          className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg border border-green-200 transition-colors"
                        >
                          <CheckCircle size={12} /> Review
                        </button>
                      )}
                      {/* PM: Add review notes only — no approve/reject */}
                      {isPM && c.status === 'PENDING' && (
                        <button
                          onClick={() => setPmNotesModal(c)}
                          className="text-yellow-500 hover:text-yellow-600"
                          title="Add Review Notes"
                        >
                          <MessageSquare size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {children.length === 0 && (
                <tr><td colSpan={5} className="text-center py-12 text-gray-400">No children found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  )
}
