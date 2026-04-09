import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import Spinner from '../components/Spinner'
import { listReports, createReport, deleteReport, myReports } from '../api/academic'
import { activeEnrollments } from '../api/extended'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { Plus, BookOpen, Trash2, X, Upload } from 'lucide-react'
import type { AcademicReport, ChildProfile, ReportTerm } from '../types'

const TERMS: ReportTerm[] = ['TERM_1', 'TERM_2', 'ANNUAL']
const TERM_LABELS: Record<ReportTerm, string> = {
  TERM_1: 'First Term',
  TERM_2: 'Second Term',
  ANNUAL: 'Annual',
}

interface ReportForm {
  child: string
  school_name: string
  academic_year: string
  term: ReportTerm
  grade_level: string
  average_score: string
  rank: string
  attendance_rate: string
  teacher_comments: string
}

interface ModalProps {
  onClose: () => void
  onSaved: () => void
  childList: ChildProfile[]
  schoolName?: string
}

function Modal({ onClose, onSaved, childList, schoolName }: ModalProps) {
  const [form, setForm] = useState<ReportForm>({
    child: '', school_name: schoolName ?? '', academic_year: '', term: 'TERM_1',
    grade_level: '', average_score: '', rank: '', attendance_rate: '', teacher_comments: '',
  })
  const [image, setImage] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  const set = (k: keyof ReportForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm({ ...form, [k]: e.target.value })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => { if (v !== '') fd.append(k, v) })
      if (image) fd.append('report_card_image', image)
      await createReport(fd)
      toast.success('Report submitted!')
      onSaved()
    } catch (err: unknown) {
      const errors = (err as { response?: { data?: Record<string, unknown> } })?.response?.data
      const msg =
        (errors?.error as { message?: string })?.message ??
        (Object.values(errors ?? {})[0] as string[])?.[0] ??
        'Failed to submit'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">Submit Academic Report</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Child *</label>
            <select className="input-field" value={form.child} onChange={set('child')} required>
              <option value="">Select child...</option>
              {childList.map((c) => <option key={c.id} value={c.id}>{c.full_name}</option>)}
            </select>
            {childList.length === 0 && (
              <p className="text-xs text-amber-600 mt-1">No enrolled children found. Enroll a child first.</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">School Name *</label>
              <input className="input-field" value={form.school_name} onChange={set('school_name')} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Academic Year *</label>
              <input className="input-field" placeholder="e.g. 2016 E.C" value={form.academic_year} onChange={set('academic_year')} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Term *</label>
              <select className="input-field" value={form.term} onChange={set('term')}>
                {TERMS.map((t) => <option key={t} value={t}>{TERM_LABELS[t]}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Grade Level *</label>
              <input className="input-field" placeholder="e.g. Grade 5" value={form.grade_level} onChange={set('grade_level')} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Average Score *</label>
              <input type="number" min="0" max="100" step="0.01" className="input-field" value={form.average_score} onChange={set('average_score')} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Attendance % *</label>
              <input type="number" min="0" max="100" step="0.01" className="input-field" value={form.attendance_rate} onChange={set('attendance_rate')} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rank</label>
              <input type="number" min="1" className="input-field" value={form.rank} onChange={set('rank')} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Teacher Comments</label>
            <textarea className="input-field min-h-[80px] resize-none" value={form.teacher_comments} onChange={set('teacher_comments')} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Report Card Image</label>
            <label className="flex items-center gap-2 cursor-pointer border border-dashed border-gray-300 rounded-lg px-4 py-3 hover:border-green-400 transition-colors">
              <Upload size={16} className="text-gray-400" />
              <span className="text-sm text-gray-500">{image ? image.name : 'Upload image'}</span>
              <input type="file" accept="image/*" className="hidden" onChange={(e) => setImage(e.target.files?.[0] ?? null)} />
            </label>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2">
              {loading && <Spinner size="sm" />}
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function AcademicReports() {
  const { user } = useAuth()
  const [reports, setReports] = useState<AcademicReport[]>([])
  const [children, setChildren] = useState<ChildProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)

  const fetchReports = () => {
    setLoading(true)
    const fn = user?.role === 'SCHOOL' ? myReports : listReports
    fn()
      .then((r) => {
        const data = r.data
        const list: AcademicReport[] = Array.isArray(data) ? data : data.results
        list.sort((a, b) => new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime())
        setReports(list)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchReports()
    if (user?.role === 'SCHOOL') {
      // Load children currently enrolled under this school
      activeEnrollments()
        .then((r) => {
          const data = r.data
          const enrollments: import('../api/extended').Enrollment[] =
            Array.isArray(data) ? data : (data as { results: import('../api/extended').Enrollment[] }).results ?? []
          // Deduplicate by child id
          const seen = new Set<string>()
          const kids: ChildProfile[] = []
          for (const e of enrollments) {
            if (!seen.has(e.child)) {
              seen.add(e.child)
              kids.push({ id: e.child, full_name: e.child_name } as ChildProfile)
            }
          }
          setChildren(kids)
        })
        .catch(() => {})
    }
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this report?')) return
    try {
      await deleteReport(id)
      toast.success('Report deleted')
      fetchReports()
    } catch {
      toast.error('Failed to delete')
    }
  }

  return (
    <Layout>
      {showModal && (
        <Modal
          onClose={() => setShowModal(false)}
          onSaved={() => { setShowModal(false); fetchReports() }}
          childList={children}
          schoolName={user?.school_profile?.school_name ?? ''}
        />
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Academic Reports</h1>
          <p className="text-gray-500 text-sm">{reports.length} reports</p>
        </div>
        {user?.role === 'SCHOOL' && (
          <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
            <Plus size={16} /> Submit Report
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : reports.length === 0 ? (
        <div className="card text-center py-16">
          <BookOpen size={48} className="text-gray-200 mx-auto mb-4" />
          <p className="text-gray-500">No academic reports yet.</p>
        </div>
      ) : (
        <div className="card p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-5 py-3 font-medium text-gray-600">Child</th>
                <th className="text-left px-5 py-3 font-medium text-gray-600 hidden sm:table-cell">School</th>
                <th className="text-left px-5 py-3 font-medium text-gray-600 hidden md:table-cell">Year / Term</th>
                <th className="text-left px-5 py-3 font-medium text-gray-600">Score</th>
                <th className="text-left px-5 py-3 font-medium text-gray-600 hidden lg:table-cell">Attendance</th>
                {user?.role === 'SCHOOL' && <th className="px-5 py-3"></th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {reports.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3 font-medium text-gray-800">{r.child_name}</td>
                  <td className="px-5 py-3 text-gray-500 hidden sm:table-cell">{r.school_name}</td>
                  <td className="px-5 py-3 text-gray-500 hidden md:table-cell">
                    {r.academic_year} · {TERM_LABELS[r.term] ?? r.term}
                  </td>
                  <td className="px-5 py-3">
                    <span className={`font-semibold ${Number(r.average_score) >= 75 ? 'text-green-600' : Number(r.average_score) >= 50 ? 'text-yellow-600' : 'text-red-500'}`}>
                      {r.average_score}%
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gray-500 hidden lg:table-cell">{r.attendance_rate}%</td>
                  {user?.role === 'SCHOOL' && (
                    <td className="px-5 py-3">
                      <button onClick={() => handleDelete(r.id)} className="text-red-400 hover:text-red-600 transition-colors">
                        <Trash2 size={15} />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  )
}
