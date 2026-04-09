import { useEffect, useState, useCallback } from 'react'
import Layout from '../components/Layout'
import Spinner from '../components/Spinner'
import { enrolledChildrenReports, updateAcademicStatus, createReport } from '../api/academic'
import { listEnrollments } from '../api/extended'
import toast from 'react-hot-toast'
import {
  BookOpen, Search, ChevronRight, X, User,
  TrendingUp, Calendar, Award, Edit3, Plus,
  CheckCircle, AlertCircle, BarChart2
} from 'lucide-react'
import type { AcademicReport, ReportTerm } from '../types'
import type { Enrollment } from '../api/extended'

const TERMS: ReportTerm[] = ['TERM_1', 'TERM_2', 'ANNUAL']
const TERM_LABELS: Record<ReportTerm, string> = {
  TERM_1: 'Term 1', TERM_2: 'Term 2', ANNUAL: 'Annual',
}
const GRADES = [
  'Grade 1','Grade 2','Grade 3','Grade 4','Grade 5','Grade 6',
  'Grade 7','Grade 8','Grade 9','Grade 10','Grade 11','Grade 12',
]

function scoreColor(s: string | number) {
  const n = Number(s)
  if (n >= 75) return 'text-green-600'
  if (n >= 50) return 'text-yellow-600'
  return 'text-red-500'
}
function scoreBg(s: string | number) {
  const n = Number(s)
  if (n >= 75) return 'bg-green-100 text-green-700'
  if (n >= 50) return 'bg-yellow-100 text-yellow-700'
  return 'bg-red-100 text-red-600'
}

// ── Edit / Create Modal ───────────────────────────────────────────────────────
interface EditModalProps {
  report: AcademicReport | null          // null = create new
  childId: string
  childName: string
  onClose: () => void
  onSaved: () => void
}

function EditModal({ report, childId, childName, onClose, onSaved }: EditModalProps) {
  const isNew = !report
  const [form, setForm] = useState({
    grade_level:     report?.grade_level     ?? 'Grade 1',
    average_score:   report?.average_score   ?? '',
    attendance_rate: report?.attendance_rate ?? '',
    term:            (report?.term           ?? 'TERM_1') as ReportTerm,
    academic_year:   report?.academic_year   ?? '',
    rank:            report?.rank != null ? String(report.rank) : '',
    teacher_comments: report?.teacher_comments ?? '',
    school_name:     report?.school_name     ?? '',
  })
  const [saving, setSaving] = useState(false)

  const set = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value }))

  const validate = () => {
    const score = Number(form.average_score)
    const att   = Number(form.attendance_rate)
    if (!form.academic_year.trim()) { toast.error('Academic year is required'); return false }
    if (isNaN(score) || score < 0 || score > 100) { toast.error('Score must be 0–100'); return false }
    if (isNaN(att)   || att   < 0 || att   > 100) { toast.error('Attendance must be 0–100'); return false }
    return true
  }

  const handleSave = async () => {
    if (!validate()) return
    setSaving(true)
    try {
      if (isNew) {
        const fd = new FormData()
        fd.append('child', childId)
        fd.append('school_name', form.school_name || childName)
        fd.append('academic_year', form.academic_year)
        fd.append('term', form.term)
        fd.append('grade_level', form.grade_level)
        fd.append('average_score', form.average_score)
        fd.append('attendance_rate', form.attendance_rate)
        if (form.rank) fd.append('rank', form.rank)
        if (form.teacher_comments) fd.append('teacher_comments', form.teacher_comments)
        await createReport(fd)
        toast.success('Report created successfully')
      } else {
        const payload: Partial<AcademicReport> = {
          grade_level:      form.grade_level,
          average_score:    form.average_score,
          attendance_rate:  form.attendance_rate,
          term:             form.term,
          academic_year:    form.academic_year,
          teacher_comments: form.teacher_comments,
          ...(form.rank ? { rank: Number(form.rank) } : {}),
        }
        await updateAcademicStatus(report!.id, payload)
        toast.success('Academic status updated')
      }
      onSaved()
      onClose()
    } catch (err: unknown) {
      const d = (err as { response?: { data?: Record<string, unknown> } })?.response?.data
      const msg =
        (d?.error as { message?: string })?.message ??
        (Object.values(d ?? {})[0] as string[])?.[0] ??
        'Failed to save'
      toast.error(msg)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
           onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              {isNew ? <Plus size={16} className="text-green-600" /> : <Edit3 size={16} className="text-green-600" />}
            </div>
            <div>
              <h2 className="font-bold text-gray-900 text-sm">
                {isNew ? 'Add Academic Report' : 'Update Academic Status'}
              </h2>
              <p className="text-xs text-gray-400">{childName}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
        </div>

        <div className="p-6 space-y-4">
          {/* Academic year + term */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Academic Year *</label>
              <input
                type="text"
                placeholder="e.g. 2016 E.C"
                value={form.academic_year}
                onChange={set('academic_year')}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Term *</label>
              <select
                value={form.term}
                onChange={set('term')}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 bg-white"
              >
                {TERMS.map(t => <option key={t} value={t}>{TERM_LABELS[t]}</option>)}
              </select>
            </div>
          </div>

          {/* Grade level */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Grade Level *</label>
            <select
              value={form.grade_level}
              onChange={set('grade_level')}
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 bg-white"
            >
              {GRADES.map(g => <option key={g}>{g}</option>)}
            </select>
          </div>

          {/* Score + Attendance */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Average Score (%) *</label>
              <input
                type="number" min="0" max="100" step="0.01"
                placeholder="0–100"
                value={form.average_score}
                onChange={set('average_score')}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Attendance (%) *</label>
              <input
                type="number" min="0" max="100" step="0.01"
                placeholder="0–100"
                value={form.attendance_rate}
                onChange={set('attendance_rate')}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>
          </div>

          {/* Rank + school name (new only) */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Rank <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                type="number" min="1"
                placeholder="e.g. 3"
                value={form.rank}
                onChange={set('rank')}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>
            {isNew && (
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">School Name</label>
                <input
                  type="text"
                  placeholder="Your school name"
                  value={form.school_name}
                  onChange={set('school_name')}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>
            )}
          </div>

          {/* Comments */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Teacher Comments <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <textarea
              rows={3}
              placeholder="Notes on performance, behavior, recommendations..."
              value={form.teacher_comments}
              onChange={set('teacher_comments')}
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 resize-none"
            />
          </div>

          {/* Validation hint */}
          <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-xl text-xs text-blue-700">
            <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
            <span>Score and attendance must be between 0 and 100. All required fields must be filled.</span>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors"
            >
              {saving ? <Spinner size="sm" /> : <CheckCircle size={15} />}
              {saving ? 'Saving...' : isNew ? 'Create Report' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Child Row with expandable reports ────────────────────────────────────────
interface ChildRowProps {
  enrollment: Enrollment
  reports: AcademicReport[]
  onEdit: (r: AcademicReport) => void
  onAdd: (childId: string, childName: string) => void
}

function ChildRow({ enrollment, reports, onEdit, onAdd }: ChildRowProps) {
  const [open, setOpen] = useState(false)
  const latest = reports[0]

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Child header row */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors text-left"
      >
        <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
          <User size={18} className="text-green-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 text-sm">{enrollment.child_name}</p>
          <p className="text-xs text-gray-500 flex items-center gap-2 mt-0.5">
            <BookOpen size={11} /> {enrollment.grade_level}
            <span className="text-gray-300">·</span>
            <Calendar size={11} /> Enrolled {new Date(enrollment.enrollment_date).toLocaleDateString()}
          </p>
        </div>

        {/* Latest score badge */}
        {latest ? (
          <div className={`px-3 py-1 rounded-full text-xs font-bold ${scoreBg(latest.average_score)}`}>
            {latest.average_score}%
          </div>
        ) : (
          <span className="text-xs text-gray-400 italic">No reports</span>
        )}

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">{reports.length} report{reports.length !== 1 ? 's' : ''}</span>
          <ChevronRight
            size={16}
            className={`text-gray-400 transition-transform ${open ? 'rotate-90' : ''}`}
          />
        </div>
      </button>

      {/* Expanded reports */}
      {open && (
        <div className="border-t border-gray-100">
          {/* Add new report button */}
          <div className="px-5 py-3 bg-gray-50 flex items-center justify-between">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Academic Reports</p>
            <button
              onClick={() => onAdd(enrollment.child, enrollment.child_name)}
              className="flex items-center gap-1.5 text-xs font-semibold text-green-600 hover:text-green-700 bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-lg transition-colors"
            >
              <Plus size={13} /> Add Report
            </button>
          </div>

          {reports.length === 0 ? (
            <div className="px-5 py-8 text-center text-gray-400 text-sm">
              <BarChart2 size={28} className="mx-auto mb-2 opacity-30" />
              No academic reports yet. Click "Add Report" to create one.
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {reports.map(r => (
                <div key={r.id} className="flex items-center gap-4 px-5 py-3 hover:bg-gray-50 transition-colors">
                  {/* Term + year */}
                  <div className="w-24 flex-shrink-0">
                    <p className="text-xs font-semibold text-gray-700">{TERM_LABELS[r.term] ?? r.term}</p>
                    <p className="text-xs text-gray-400">{r.academic_year}</p>
                  </div>

                  {/* Grade */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-600 flex items-center gap-1">
                      <BookOpen size={11} className="text-green-500" /> {r.grade_level}
                    </p>
                  </div>

                  {/* Score */}
                  <div className="text-center w-16">
                    <p className={`text-sm font-bold ${scoreColor(r.average_score)}`}>{r.average_score}%</p>
                    <p className="text-xs text-gray-400">Score</p>
                  </div>

                  {/* Attendance */}
                  <div className="text-center w-16">
                    <p className="text-sm font-bold text-blue-600">{r.attendance_rate}%</p>
                    <p className="text-xs text-gray-400">Attend.</p>
                  </div>

                  {/* Rank */}
                  {r.rank != null && (
                    <div className="text-center w-12">
                      <p className="text-sm font-bold text-purple-600">#{r.rank}</p>
                      <p className="text-xs text-gray-400">Rank</p>
                    </div>
                  )}

                  {/* Edit */}
                  <button
                    onClick={() => onEdit(r)}
                    className="flex items-center gap-1 text-xs text-green-600 hover:text-green-700 font-semibold bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-lg transition-colors flex-shrink-0"
                  >
                    <Edit3 size={12} /> Edit
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function UpdateAcademicStatus() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [reports, setReports] = useState<AcademicReport[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  // Modal state
  const [editReport, setEditReport] = useState<AcademicReport | null | undefined>(undefined) // undefined = closed
  const [addTarget, setAddTarget] = useState<{ childId: string; childName: string } | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [enrRes, repRes] = await Promise.all([
        listEnrollments(),
        enrolledChildrenReports(),
      ])
      const enrData = enrRes.data
      setEnrollments(Array.isArray(enrData) ? enrData : (enrData as { results: Enrollment[] }).results)
      const repData = repRes.data
      setReports(Array.isArray(repData) ? repData : (repData as { results: AcademicReport[] }).results)
    } catch {
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const activeEnrollments = enrollments.filter(e => e.status === 'ENROLLED')
  const filtered = activeEnrollments.filter(e =>
    e.child_name.toLowerCase().includes(search.toLowerCase())
  )

  // Reports grouped by child id
  const reportsByChild = reports.reduce<Record<string, AcademicReport[]>>((acc, r) => {
    if (!acc[r.child]) acc[r.child] = []
    acc[r.child].push(r)
    return acc
  }, {})

  // Summary stats
  const totalReports = reports.length
  const avgScore = reports.length
    ? (reports.reduce((s, r) => s + Number(r.average_score), 0) / reports.length).toFixed(1)
    : null
  const avgAtt = reports.length
    ? (reports.reduce((s, r) => s + Number(r.attendance_rate), 0) / reports.length).toFixed(1)
    : null

  return (
    <Layout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Academic Status</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            UC-16 · Update academic information for enrolled children
          </p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Enrolled Children', value: activeEnrollments.length, icon: User, color: 'green' },
          { label: 'Total Reports', value: totalReports, icon: BookOpen, color: 'blue' },
          { label: 'Avg Score', value: avgScore ? `${avgScore}%` : '—', icon: TrendingUp, color: 'purple' },
          { label: 'Avg Attendance', value: avgAtt ? `${avgAtt}%` : '—', icon: Award, color: 'yellow' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <div className={`w-9 h-9 rounded-xl bg-${color}-100 flex items-center justify-center mb-3`}>
              <Icon size={18} className={`text-${color}-600`} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search enrolled children..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 bg-white"
        />
      </div>

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 text-center py-16">
          <BookOpen size={48} className="text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No enrolled children found</p>
          <p className="text-gray-400 text-sm mt-1">Enroll children first from the Enrollments page</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(e => (
            <ChildRow
              key={e.id}
              enrollment={e}
              reports={(reportsByChild[e.child] ?? []).sort((a, b) =>
                b.academic_year.localeCompare(a.academic_year)
              )}
              onEdit={r => { setEditReport(r); setAddTarget(null) }}
              onAdd={(childId, childName) => { setAddTarget({ childId, childName }); setEditReport(undefined) }}
            />
          ))}
        </div>
      )}

      {/* Edit modal */}
      {editReport !== undefined && editReport !== null && (
        <EditModal
          report={editReport}
          childId={editReport.child}
          childName={editReport.child_name}
          onClose={() => setEditReport(undefined)}
          onSaved={load}
        />
      )}

      {/* Add new report modal */}
      {addTarget && (
        <EditModal
          report={null}
          childId={addTarget.childId}
          childName={addTarget.childName}
          onClose={() => setAddTarget(null)}
          onSaved={load}
        />
      )}
    </Layout>
  )
}
