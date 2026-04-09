import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import Spinner from '../components/Spinner'
import StatusBadge from '../components/StatusBadge'
import { listOrgReports, createOrgReport, reviewOrgReport, myOrgReports } from '../api/organization'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { Plus, FileText, X, Upload, CheckCircle } from 'lucide-react'
import type { OrgReport } from '../types'

interface ReportForm {
  title: string
  period: string
  report_date: string
  summary: string
  children_count: string
  sponsored_count: string
  interventions_count: string
}

interface ModalProps {
  onClose: () => void
  onSaved: () => void
}

function Modal({ onClose, onSaved }: ModalProps) {
  const [form, setForm] = useState<ReportForm>({ title: '', period: 'MONTHLY', report_date: '', summary: '', children_count: '0', sponsored_count: '0', interventions_count: '0' })
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  const set = (k: keyof ReportForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm({ ...form, [k]: e.target.value })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => fd.append(k, v as string))
      if (file) fd.append('report_file', file)
      await createOrgReport(fd)
      toast.success('Report submitted!')
      onSaved()
    } catch (err: unknown) {
      const errors = (err as { response?: { data?: Record<string, unknown> } })?.response?.data
      const msg =
        (errors?.error as { message?: string })?.message ??
        (Object.values(errors ?? {})[0] as string[])?.[0] ??
        'Failed'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">Submit Organization Report</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input className="input-field" value={form.title} onChange={set('title')} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Period *</label>
              <select className="input-field" value={form.period} onChange={set('period')}>
                <option value="MONTHLY">Monthly</option>
                <option value="QUARTERLY">Quarterly</option>
                <option value="ANNUAL">Annual</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Report Date *</label>
              <input type="date" className="input-field" value={form.report_date} onChange={set('report_date')} required />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Children</label>
              <input type="number" min="0" className="input-field" value={form.children_count} onChange={set('children_count')} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sponsored</label>
              <input type="number" min="0" className="input-field" value={form.sponsored_count} onChange={set('sponsored_count')} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Interventions</label>
              <input type="number" min="0" className="input-field" value={form.interventions_count} onChange={set('interventions_count')} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Summary *</label>
            <textarea className="input-field min-h-[80px] resize-none" value={form.summary} onChange={set('summary')} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Report File</label>
            <label className="flex items-center gap-2 cursor-pointer border border-dashed border-gray-300 rounded-lg px-4 py-3 hover:border-green-400 transition-colors">
              <Upload size={16} className="text-gray-400" />
              <span className="text-sm text-gray-500">{file ? file.name : 'Upload file'}</span>
              <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
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

export default function OrgReports() {
  const { user } = useAuth()
  const [reports, setReports] = useState<OrgReport[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)

  const fetchReports = () => {
    setLoading(true)
    const fn = user?.role === 'ORG_STAFF' ? myOrgReports : listOrgReports
    fn()
      .then((r) => {
        const data = r.data
        const list: OrgReport[] = Array.isArray(data) ? data : data.results
        list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        setReports(list)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchReports() }, [])

  const handleReview = async (id: string) => {
    const notes = prompt('Review notes:')
    if (notes === null) return
    try {
      await reviewOrgReport(id, notes)
      toast.success('Report reviewed')
      fetchReports()
    } catch {
      toast.error('Failed to review')
    }
  }

  return (
    <Layout>
      {showModal && (
        <Modal onClose={() => setShowModal(false)} onSaved={() => { setShowModal(false); fetchReports() }} />
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Organization Reports</h1>
          <p className="text-gray-500 text-sm">{reports.length} reports</p>
        </div>
        {user?.role === 'ORG_STAFF' && (
          <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
            <Plus size={16} /> Submit Report
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : reports.length === 0 ? (
        <div className="card text-center py-16">
          <FileText size={48} className="text-gray-200 mx-auto mb-4" />
          <p className="text-gray-500">No reports found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reports.map((r) => (
            <div key={r.id} className="card flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                <FileText size={18} className="text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-gray-800">{r.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{r.period ?? r.report_period} · {r.report_date}</p>
                  </div>
                  <StatusBadge status={r.status} />
                </div>
                {r.summary && <p className="text-sm text-gray-500 mt-2 line-clamp-2">{r.summary}</p>}
                <p className="text-xs text-gray-400 mt-2">{new Date(r.created_at).toLocaleDateString()}</p>
              </div>
              {user?.role === 'ADMIN' && r.status === 'SUBMITTED' && (
                <button onClick={() => handleReview(r.id)} className="text-green-600 hover:text-green-700 flex-shrink-0" title="Review">
                  <CheckCircle size={20} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </Layout>
  )
}
