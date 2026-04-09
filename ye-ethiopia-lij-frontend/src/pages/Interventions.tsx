import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import Spinner from '../components/Spinner'
import { listInterventions, createIntervention, deleteIntervention } from '../api/children'
import { listAllChildren } from '../api/children'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { Plus, Activity, Trash2, X, Upload } from 'lucide-react'
import type { Intervention, ChildProfile, InterventionType } from '../types'

const TYPES: InterventionType[] = ['HEALTH', 'EDUCATION', 'NUTRITION', 'CLOTHING']
const TYPE_COLORS: Record<InterventionType, string> = {
  HEALTH: 'bg-red-100 text-red-700',
  EDUCATION: 'bg-blue-100 text-blue-700',
  NUTRITION: 'bg-yellow-100 text-yellow-700',
  CLOTHING: 'bg-purple-100 text-purple-700',
}

interface InterventionForm {
  child: string
  type: InterventionType
  description: string
  date_provided: string
}

interface ModalProps {
  onClose: () => void
  onSaved: () => void
  childList: ChildProfile[]
}

function Modal({ onClose, onSaved, childList }: ModalProps) {
  const [form, setForm] = useState<InterventionForm>({ child: '', type: 'HEALTH', description: '', date_provided: '' })
  const [receipt, setReceipt] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  const set = (k: keyof InterventionForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm({ ...form, [k]: e.target.value })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => fd.append(k, v))
      if (receipt) fd.append('receipt_image', receipt)
      await createIntervention(fd)
      toast.success('Intervention logged!')
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
          <h2 className="text-lg font-semibold text-gray-800">Log Intervention</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Child *</label>
            <select className="input-field" value={form.child} onChange={set('child')} required>
              <option value="">Select child...</option>
              {childList.map((c) => <option key={c.id} value={c.id}>{c.full_name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
              <select className="input-field" value={form.type} onChange={set('type')}>
                {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
              <input type="date" className="input-field" value={form.date_provided} onChange={set('date_provided')} required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
            <textarea className="input-field min-h-[80px] resize-none" value={form.description} onChange={set('description')} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Receipt Image</label>
            <label className="flex items-center gap-2 cursor-pointer border border-dashed border-gray-300 rounded-lg px-4 py-3 hover:border-green-400 transition-colors">
              <Upload size={16} className="text-gray-400" />
              <span className="text-sm text-gray-500">{receipt ? receipt.name : 'Upload receipt'}</span>
              <input type="file" accept="image/*" className="hidden" onChange={(e) => setReceipt(e.target.files?.[0] ?? null)} />
            </label>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2">
              {loading && <Spinner size="sm" />}
              {loading ? 'Saving...' : 'Log Intervention'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function Interventions() {
  const { user } = useAuth()
  const [interventions, setInterventions] = useState<Intervention[]>([])
  const [children, setChildren] = useState<ChildProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)

  const fetchData = () => {
    setLoading(true)
    listInterventions()
      .then((r) => {
        const data = r.data
        const list: Intervention[] = Array.isArray(data) ? data : data.results
        list.sort((a, b) => new Date(b.date_provided ?? b.created_at ?? 0).getTime() - new Date(a.date_provided ?? a.created_at ?? 0).getTime())
        setInterventions(list)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchData()
    listAllChildren()
      .then((r) => {
        const data = r.data
        setChildren(Array.isArray(data) ? data : data.results)
      })
      .catch(() => {})
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this intervention?')) return
    try {
      await deleteIntervention(id)
      toast.success('Deleted')
      fetchData()
    } catch {
      toast.error('Failed to delete')
    }
  }

  const canCreate = ['ORG_STAFF', 'SCHOOL', 'ADMIN'].includes(user?.role ?? '')

  return (
    <Layout>
      {showModal && (
        <Modal
          onClose={() => setShowModal(false)}
          onSaved={() => { setShowModal(false); fetchData() }}
          childList={children}
        />
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Interventions</h1>
          <p className="text-gray-500 text-sm">{interventions.length} records</p>
        </div>
        {canCreate && (
          <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
            <Plus size={16} /> Log Intervention
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : interventions.length === 0 ? (
        <div className="card text-center py-16">
          <Activity size={48} className="text-gray-200 mx-auto mb-4" />
          <p className="text-gray-500">No interventions logged yet.</p>
        </div>
      ) : (
        <div className="card p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-5 py-3 font-medium text-gray-600">Child</th>
                <th className="text-left px-5 py-3 font-medium text-gray-600">Type</th>
                <th className="text-left px-5 py-3 font-medium text-gray-600 hidden md:table-cell">Description</th>
                <th className="text-left px-5 py-3 font-medium text-gray-600 hidden sm:table-cell">Date</th>
                {canCreate && <th className="px-5 py-3"></th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {interventions.map((i) => (
                <tr key={i.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3 font-medium text-gray-800">{i.child_name}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${TYPE_COLORS[i.type] ?? 'bg-gray-100 text-gray-600'}`}>
                      {i.type}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gray-500 hidden md:table-cell max-w-xs truncate">{i.description}</td>
                  <td className="px-5 py-3 text-gray-500 hidden sm:table-cell">{i.date_provided}</td>
                  {canCreate && (
                    <td className="px-5 py-3">
                      <button onClick={() => handleDelete(i.id)} className="text-red-400 hover:text-red-600 transition-colors">
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
