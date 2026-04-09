import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import Spinner from '../components/Spinner'
import StatusBadge from '../components/StatusBadge'
import { myOrganization, createOrganization, updateOrganization } from '../api/organization'
import { mediaUrl } from '../api/axios'
import toast from 'react-hot-toast'
import { Upload, Save } from 'lucide-react'
import type { Organization } from '../types'

const ORG_TYPES = ['ORPHANAGE', 'NGO', 'RELIGIOUS', 'OTHER']

interface OrgForm {
  name: string
  org_type: string
  description: string
  address: string
  city: string
  phone: string
  email: string
  website: string
  registration_number: string
  established_year: string
}

export default function MyOrganization() {
  const [org, setOrg] = useState<Organization | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<OrgForm>({
    name: '', org_type: 'NGO', description: '', address: '',
    city: '', phone: '', email: '', website: '',
    registration_number: '', established_year: '',
  })
  const [logo, setLogo] = useState<File | null>(null)
  const [isNew, setIsNew] = useState(false)

  useEffect(() => {
    myOrganization()
      .then((r) => {
        setOrg(r.data)
        setForm({
          name: r.data.name ?? '',
          org_type: r.data.org_type ?? 'NGO',
          description: r.data.description ?? '',
          address: r.data.address ?? '',
          city: r.data.city ?? '',
          phone: r.data.phone ?? '',
          email: r.data.email ?? '',
          website: r.data.website ?? '',
          registration_number: r.data.registration_number ?? '',
          established_year: '',
        })
      })
      .catch((err: unknown) => {
        if ((err as { response?: { status?: number } })?.response?.status === 404) setIsNew(true)
      })
      .finally(() => setLoading(false))
  }, [])

  const set = (k: keyof OrgForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm({ ...form, [k]: e.target.value })

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => { if (v) fd.append(k, v) })
      if (logo) fd.append('logo', logo)
      if (isNew) {
        const r = await createOrganization(fd)
        setOrg(r.data)
        setIsNew(false)
        toast.success('Organization created!')
      } else if (org) {
        const r = await updateOrganization(org.id, fd)
        setOrg(r.data)
        toast.success('Organization updated!')
      }
    } catch (err: unknown) {
      const errors = (err as { response?: { data?: Record<string, unknown> } })?.response?.data
      const msg =
        (errors?.error as { message?: string })?.message ??
        (Object.values(errors ?? {})[0] as string[])?.[0] ??
        'Failed to save'
      toast.error(msg)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Layout><div className="flex justify-center py-20"><Spinner size="lg" /></div></Layout>

  return (
    <Layout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Organization</h1>
          <p className="text-gray-500 text-sm">{isNew ? 'Register your organization' : 'Manage your organization profile'}</p>
        </div>
        {org && <StatusBadge status={org.status} />}
      </div>

      <div className="max-w-2xl">
        <form onSubmit={handleSave} className="card space-y-5">
          {org?.logo && (
            <div className="flex items-center gap-4">
              <img src={mediaUrl(org.logo)!} alt="Logo" className="w-16 h-16 rounded-xl object-cover" />
              <p className="text-sm text-gray-500">Current logo</p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Organization Name *</label>
              <input className="input-field" value={form.name} onChange={set('name')} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
              <select className="input-field" value={form.org_type} onChange={set('org_type')}>
                {ORG_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Registration Number *</label>
              <input className="input-field" value={form.registration_number} onChange={set('registration_number')} required={isNew} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
              <input className="input-field" value={form.city} onChange={set('city')} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
              <input className="input-field" value={form.phone} onChange={set('phone')} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input type="email" className="input-field" value={form.email} onChange={set('email')} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
              <input className="input-field" placeholder="https://" value={form.website} onChange={set('website')} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Established Year</label>
              <input type="number" className="input-field" placeholder="e.g. 2010" value={form.established_year} onChange={set('established_year')} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
            <input className="input-field" value={form.address} onChange={set('address')} required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea className="input-field min-h-[100px] resize-none" value={form.description} onChange={set('description')} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Logo</label>
            <label className="flex items-center gap-2 cursor-pointer border border-dashed border-gray-300 rounded-lg px-4 py-3 hover:border-green-400 transition-colors">
              <Upload size={16} className="text-gray-400" />
              <span className="text-sm text-gray-500">{logo ? logo.name : 'Upload logo'}</span>
              <input type="file" accept="image/*" className="hidden" onChange={(e) => setLogo(e.target.files?.[0] ?? null)} />
            </label>
          </div>

          <button type="submit" disabled={saving} className="btn-primary w-full flex items-center justify-center gap-2">
            {saving ? <Spinner size="sm" /> : <Save size={16} />}
            {saving ? 'Saving...' : isNew ? 'Register Organization' : 'Save Changes'}
          </button>
        </form>
      </div>
    </Layout>
  )
}
