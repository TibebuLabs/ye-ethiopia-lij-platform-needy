import { useEffect, useState, useCallback } from 'react'
import Layout from '../components/Layout'
import Spinner from '../components/Spinner'
import {
  listEnrollments, createEnrollment, updateEnrollment,
  approvedChildrenForEnrollment, type Enrollment
} from '../api/extended'
import { mediaUrl } from '../api/axios'
import toast from 'react-hot-toast'
import {
  GraduationCap, Search, Plus, X, User, MapPin,
  Calendar, BookOpen, CheckCircle, XCircle, Clock,
  ChevronRight, AlertCircle
} from 'lucide-react'
import type { ChildProfile } from '../types'

const STATUS_STYLE: Record<string, string> = {
  ENROLLED:  'bg-green-100 text-green-700',
  PENDING:   'bg-yellow-100 text-yellow-700',
  GRADUATED: 'bg-blue-100 text-blue-700',
  DROPPED:   'bg-red-100 text-red-700',
}
const STATUS_ICON: Record<string, typeof CheckCircle> = {
  ENROLLED:  CheckCircle,
  PENDING:   Clock,
  GRADUATED: GraduationCap,
  DROPPED:   XCircle,
}

const GRADES = ['Grade 1','Grade 2','Grade 3','Grade 4','Grade 5','Grade 6',
                 'Grade 7','Grade 8','Grade 9','Grade 10','Grade 11','Grade 12']

// ── Enroll Modal ──────────────────────────────────────────────────────────────
function EnrollModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [step, setStep] = useState<1 | 2>(1)
  const [search, setSearch] = useState('')
  const [children, setChildren] = useState<ChildProfile[]>([])
  const [searching, setSearching] = useState(false)
  const [selected, setSelected] = useState<ChildProfile | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    enrollment_date: new Date().toISOString().split('T')[0],
    grade_level: 'Grade 1',
    class_section: '',
    enrollment_number: `ENR-${Date.now()}`,
  })

  const doSearch = useCallback(async (q: string) => {
    setSearching(true)
    try {
      const res = await approvedChildrenForEnrollment(q)
      setChildren(Array.isArray(res.data) ? res.data : [])
    } catch {
      setChildren([])
    } finally {
      setSearching(false)
    }
  }, [])

  useEffect(() => { doSearch('') }, [doSearch])

  useEffect(() => {
    const t = setTimeout(() => doSearch(search), 400)
    return () => clearTimeout(t)
  }, [search, doSearch])

  const handleEnroll = async () => {
    if (!selected) return
    setSubmitting(true)
    try {
      await createEnrollment({
        child: selected.id,
        ...form,
      })
      toast.success(`${selected.full_name} enrolled successfully!`)
      onSuccess()
      onClose()
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: { message?: string } } } })
          ?.response?.data?.error?.message ?? 'Enrollment failed'
      toast.error(msg)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <GraduationCap size={16} className="text-green-600" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 text-sm">Enroll a Child</h2>
              <p className="text-xs text-gray-400">Step {step} of 2</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
        </div>

        {/* Step indicator */}
        <div className="flex px-6 pt-4 gap-2">
          {[1, 2].map(s => (
            <div key={s} className={`h-1 flex-1 rounded-full transition-colors ${step >= s ? 'bg-green-500' : 'bg-gray-100'}`} />
          ))}
        </div>

        <div className="p-6">
          {/* Step 1: Search & select child */}
          {step === 1 && (
            <div className="space-y-4">
              <p className="text-sm font-semibold text-gray-700">Search for an approved child</p>
              <div className="relative">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>

              <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
                {searching ? (
                  <div className="flex justify-center py-8"><Spinner size="sm" /></div>
                ) : children.length === 0 ? (
                  <div className="text-center py-8 text-gray-400 text-sm">
                    <AlertCircle size={32} className="mx-auto mb-2 opacity-40" />
                    No approved children available for enrollment
                  </div>
                ) : children.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setSelected(c)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                      selected?.id === c.id
                        ? 'border-green-400 bg-green-50'
                        : 'border-gray-100 hover:border-green-200 hover:bg-green-50/50'
                    }`}
                  >
                    {c.photo ? (
                      <img src={mediaUrl(c.photo)!} alt={c.full_name} className="w-10 h-10 rounded-xl object-cover flex-shrink-0" />
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                        <User size={16} className="text-green-600" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800 text-sm truncate">{c.full_name}</p>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <MapPin size={10} /> {c.location} · {c.age} yrs · {c.gender}
                      </p>
                    </div>
                    {selected?.id === c.id && <CheckCircle size={16} className="text-green-500 flex-shrink-0" />}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={!selected}
                className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-40 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors"
              >
                Continue <ChevronRight size={15} />
              </button>
            </div>
          )}

          {/* Step 2: Enrollment details */}
          {step === 2 && selected && (
            <div className="space-y-4">
              {/* Selected child summary */}
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl border border-green-100">
                {selected.photo ? (
                  <img src={mediaUrl(selected.photo)!} alt={selected.full_name} className="w-10 h-10 rounded-xl object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-green-200 flex items-center justify-center">
                    <User size={16} className="text-green-700" />
                  </div>
                )}
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{selected.full_name}</p>
                  <p className="text-xs text-gray-500">{selected.age} yrs · {selected.location}</p>
                </div>
                <button onClick={() => setStep(1)} className="ml-auto text-xs text-green-600 hover:underline">Change</button>
              </div>

              {/* Form */}
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Enrollment Number</label>
                  <input
                    type="text"
                    value={form.enrollment_number}
                    onChange={e => setForm({ ...form, enrollment_number: e.target.value })}
                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Enrollment Date</label>
                  <input
                    type="date"
                    value={form.enrollment_date}
                    onChange={e => setForm({ ...form, enrollment_date: e.target.value })}
                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Grade Level</label>
                  <select
                    value={form.grade_level}
                    onChange={e => setForm({ ...form, grade_level: e.target.value })}
                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 bg-white"
                  >
                    {GRADES.map(g => <option key={g}>{g}</option>)}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Class Section <span className="text-gray-400 font-normal">(optional)</span></label>
                  <input
                    type="text"
                    placeholder="e.g. Section A"
                    value={form.class_section}
                    onChange={e => setForm({ ...form, class_section: e.target.value })}
                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-1">
                <button onClick={() => setStep(1)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                  Back
                </button>
                <button
                  onClick={handleEnroll}
                  disabled={submitting}
                  className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors"
                >
                  {submitting ? <Spinner size="sm" /> : <GraduationCap size={15} />}
                  {submitting ? 'Enrolling...' : 'Confirm Enrollment'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function Enrollments() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [filter, setFilter] = useState('ALL')
  const [search, setSearch] = useState('')

  const load = useCallback(() => {
    setLoading(true)
    listEnrollments()
      .then(r => {
        const data = r.data
        const list: Enrollment[] = Array.isArray(data) ? data : (data as { results: Enrollment[] }).results
        list.sort((a, b) => new Date(b.enrollment_date ?? 0).getTime() - new Date(a.enrollment_date ?? 0).getTime())
        setEnrollments(list)
      })
      .catch(() => toast.error('Failed to load enrollments'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateEnrollment(id, { status: newStatus })
      toast.success('Status updated')
      load()
    } catch {
      toast.error('Failed to update status')
    }
  }

  const filtered = enrollments.filter(e => {
    const matchStatus = filter === 'ALL' || e.status === filter
    const matchSearch = e.child_name.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  const counts = {
    ALL: enrollments.length,
    ENROLLED: enrollments.filter(e => e.status === 'ENROLLED').length,
    PENDING: enrollments.filter(e => e.status === 'PENDING').length,
    GRADUATED: enrollments.filter(e => e.status === 'GRADUATED').length,
    DROPPED: enrollments.filter(e => e.status === 'DROPPED').length,
  }

  return (
    <Layout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Enrollments</h1>
          <p className="text-gray-500 text-sm mt-0.5">{counts.ENROLLED} children currently enrolled</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors shadow-sm shadow-green-200"
        >
          <Plus size={16} /> Enroll Child
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {(['ALL', 'ENROLLED', 'PENDING', 'GRADUATED', 'DROPPED'] as const).map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filter === s
                ? 'bg-green-600 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-green-300'
            }`}
          >
            {s === 'ALL' ? 'All' : s.charAt(0) + s.slice(1).toLowerCase()} ({counts[s]})
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search by child name..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 bg-white"
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 text-center py-16">
          <GraduationCap size={48} className="text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No enrollments found</p>
          <p className="text-gray-400 text-sm mt-1">Click "Enroll Child" to get started</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Child</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Enrollment #</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Grade</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(e => {
                const StatusIcon = STATUS_ICON[e.status] ?? Clock
                return (
                  <tr key={e.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <User size={14} className="text-green-600" />
                        </div>
                        <span className="font-medium text-gray-800">{e.child_name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-gray-500 font-mono text-xs">{e.enrollment_number}</td>
                    <td className="px-5 py-3">
                      <span className="flex items-center gap-1 text-gray-700">
                        <BookOpen size={13} className="text-green-500" /> {e.grade_level}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} /> {new Date(e.enrollment_date).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_STYLE[e.status] ?? 'bg-gray-100 text-gray-600'}`}>
                        <StatusIcon size={11} /> {e.status}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      {e.status === 'ENROLLED' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleStatusChange(e.id, 'GRADUATED')}
                            className="text-xs text-blue-600 hover:underline font-medium"
                          >
                            Graduate
                          </button>
                          <button
                            onClick={() => handleStatusChange(e.id, 'DROPPED')}
                            className="text-xs text-red-500 hover:underline font-medium"
                          >
                            Drop
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <EnrollModal onClose={() => setShowModal(false)} onSuccess={load} />
      )}
    </Layout>
  )
}
