import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import Spinner from '../components/Spinner'
import { registerChild } from '../api/children'
import toast from 'react-hot-toast'
import { ArrowLeft, Upload } from 'lucide-react'
import type { ChildGender } from '../types'

interface ChildForm {
  full_name: string
  age: string
  gender: ChildGender
  location: string
  biography: string
  vulnerability_status: string
  guardian_info: string
}

export default function RegisterChild() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState<ChildForm>({
    full_name: '', age: '', gender: 'MALE', location: '',
    biography: '', vulnerability_status: '', guardian_info: '',
  })
  const [photo, setPhoto] = useState<File | null>(null)
  const [docs, setDocs] = useState<File | null>(null)

  const set = (k: keyof ChildForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm({ ...form, [k]: e.target.value })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => fd.append(k, v))
      if (photo) fd.append('photo', photo)
      if (docs) fd.append('supporting_docs', docs)
      await registerChild(fd)
      toast.success('Child profile submitted for review!')
      navigate('/children')
    } catch (err: unknown) {
      const errors = (err as { response?: { data?: Record<string, unknown> } })?.response?.data
      const msg =
        (errors?.error as { message?: string })?.message ??
        (Object.values(errors ?? {})[0] as string[])?.[0] ??
        'Submission failed'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-green-600 mb-6">
        <ArrowLeft size={16} /> Back
      </button>

      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Register Child Profile</h1>
          <p className="text-gray-500 text-sm mt-1">Submit a new child profile for admin review</p>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <input className="input-field" value={form.full_name} onChange={set('full_name')} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Age *</label>
              <input type="number" className="input-field" min="0" max="18" value={form.age} onChange={set('age')} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
              <select className="input-field" value={form.gender} onChange={set('gender')}>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
              <input className="input-field" placeholder="City / Area" value={form.location} onChange={set('location')} required />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Vulnerability Status *</label>
            <input className="input-field" placeholder="e.g., orphan, street child" value={form.vulnerability_status} onChange={set('vulnerability_status')} required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Biography *</label>
            <textarea className="input-field min-h-[100px] resize-none" value={form.biography} onChange={set('biography')} required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Guardian Info *</label>
            <textarea className="input-field min-h-[80px] resize-none" placeholder="Name and contact details" value={form.guardian_info} onChange={set('guardian_info')} required />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Photo</label>
              <label className="flex items-center gap-2 cursor-pointer border border-dashed border-gray-300 rounded-lg px-4 py-3 hover:border-green-400 transition-colors">
                <Upload size={16} className="text-gray-400" />
                <span className="text-sm text-gray-500">{photo ? photo.name : 'Upload photo'}</span>
                <input type="file" accept="image/*" className="hidden" onChange={(e) => setPhoto(e.target.files?.[0] ?? null)} />
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Supporting Documents</label>
              <label className="flex items-center gap-2 cursor-pointer border border-dashed border-gray-300 rounded-lg px-4 py-3 hover:border-green-400 transition-colors">
                <Upload size={16} className="text-gray-400" />
                <span className="text-sm text-gray-500">{docs ? docs.name : 'Upload document'}</span>
                <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={(e) => setDocs(e.target.files?.[0] ?? null)} />
              </label>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => navigate(-1)} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2">
              {loading && <Spinner size="sm" />}
              {loading ? 'Submitting...' : 'Submit Profile'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  )
}
