import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import Spinner from '../components/Spinner'
import { useAuth } from '../context/AuthContext'
import { getSchoolProfile, createSchoolProfile, updateSchoolProfile } from '../api/auth'
import type { SchoolProfile } from '../api/auth'
import toast from 'react-hot-toast'
import {
  School, MapPin, Phone, User, Hash, BookOpen,
  Edit3, Save, X, CheckCircle, Clock, Building2,
  Calendar, FileText,
} from 'lucide-react'

const SCHOOL_TYPES: Record<string, string> = {
  PRIMARY:     'Primary School',
  SECONDARY:   'Secondary School',
  PREPARATORY: 'Preparatory School',
  COMBINED:    'Combined (Grade 1–12)',
  VOCATIONAL:  'Vocational / TVET',
  OTHER:       'Other',
}
const SCHOOL_TYPE_OPTIONS = Object.entries(SCHOOL_TYPES)

const inputCls = 'w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 bg-white transition'
const labelCls = 'block text-xs font-semibold text-gray-600 mb-1.5'

// ── Info row (view mode) ──────────────────────────────────────────────────────
function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value?: string }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-50 last:border-0">
      <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon size={14} className="text-green-600" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-400 font-medium">{label}</p>
        <p className="text-sm font-semibold text-gray-800 mt-0.5 break-words">
          {value || <span className="text-gray-300 font-normal italic">Not provided</span>}
        </p>
      </div>
    </div>
  )
}

export default function SchoolProfilePage() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<SchoolProfile | null>(null)
  const [loading, setLoading]   = useState(true)
  const [editing, setEditing]   = useState(false)
  const [saving, setSaving]     = useState(false)
  const [form, setForm]         = useState<Partial<SchoolProfile>>({})
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    getSchoolProfile()
      .then(r => { setProfile(r.data); setForm(r.data) })
      .catch(err => {
        if (err?.response?.status === 404) setNotFound(true)
        else toast.error('Failed to load school profile')
      })
      .finally(() => setLoading(false))
  }, [])

  const set = (k: keyof SchoolProfile) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSave = async () => {
    if (!form.school_name?.trim()) { toast.error('School name is required'); return }
    setSaving(true)
    try {
      const res = profile
        ? await updateSchoolProfile(form)
        : await createSchoolProfile({ school_type: 'PRIMARY', ...form })
      setProfile(res.data.data)
      setForm(res.data.data)
      setEditing(false)
      setNotFound(false)
      toast.success(profile ? 'School profile updated' : 'School profile created')
    } catch (err: unknown) {
      const d = (err as { response?: { data?: Record<string, unknown> } })?.response?.data
      const msg =
        (d?.error as { message?: string })?.message ??
        (Object.values(d ?? {})[0] as string[])?.[0] ??
        'Failed to update'
      toast.error(msg)
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => { setForm(profile ?? {}); setEditing(false) }

  if (loading) return (
    <Layout><div className="flex justify-center py-24"><Spinner size="lg" /></div></Layout>
  )

  return (
    <Layout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">School Profile</h1>
          <p className="text-gray-500 text-sm mt-0.5">View and manage your school information</p>
        </div>
        {!editing && !notFound && profile && (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors shadow-sm shadow-green-200"
          >
            <Edit3 size={15} /> Edit Profile
          </button>
        )}
      </div>

      {/* No profile yet — show create form */}
      {notFound && !editing && (
        <div className="max-w-3xl">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-5 flex items-start gap-3">
            <School size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-800">No school profile found</p>
              <p className="text-xs text-amber-700 mt-0.5">
                Your account doesn't have a school profile yet. Fill in the form below to create one.
              </p>
            </div>
          </div>
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors shadow-sm shadow-green-200"
          >
            <School size={15} /> Create School Profile
          </button>
        </div>
      )}

      {/* ── Form (create or edit) — shown whenever editing=true ── */}
      {editing && (
        <div className="max-w-3xl">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
              <div className="flex items-center gap-2">
                <Edit3 size={15} className="text-green-600" />
                <h2 className="text-sm font-bold text-gray-800">
                  {profile ? 'Edit School Profile' : 'Create School Profile'}
                </h2>
              </div>
              <button onClick={handleCancel} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">

              {/* School Name */}
              <div className="col-span-2">
                <label className={labelCls}>School Name *</label>
                <div className="relative">
                  <School size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" value={form.school_name ?? ''} onChange={set('school_name')}
                    placeholder="e.g. Addis Ababa Primary School"
                    className={`${inputCls} pl-9`} />
                </div>
              </div>

              {/* School Type */}
              <div>
                <label className={labelCls}>School Type</label>
                <select value={form.school_type ?? 'PRIMARY'} onChange={set('school_type')}
                  className={`${inputCls} appearance-none`}>
                  {SCHOOL_TYPE_OPTIONS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </div>

              {/* Registration Number */}
              <div>
                <label className={labelCls}>Registration Number</label>
                <div className="relative">
                  <Hash size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" value={form.registration_number ?? ''} onChange={set('registration_number')}
                    placeholder="e.g. SCH-2024-001"
                    className={`${inputCls} pl-9`} />
                </div>
              </div>

              {/* Address */}
              <div className="col-span-2">
                <label className={labelCls}>Address</label>
                <div className="relative">
                  <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" value={form.address ?? ''} onChange={set('address')}
                    placeholder="Street address"
                    className={`${inputCls} pl-9`} />
                </div>
              </div>

              {/* City */}
              <div>
                <label className={labelCls}>City</label>
                <div className="relative">
                  <Building2 size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" value={form.city ?? ''} onChange={set('city')}
                    placeholder="e.g. Addis Ababa"
                    className={`${inputCls} pl-9`} />
                </div>
              </div>

              {/* Region */}
              <div>
                <label className={labelCls}>Region</label>
                <div className="relative">
                  <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" value={form.region ?? ''} onChange={set('region')}
                    placeholder="e.g. Oromia"
                    className={`${inputCls} pl-9`} />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className={labelCls}>Phone</label>
                <div className="relative">
                  <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="tel" value={form.phone ?? ''} onChange={set('phone')}
                    placeholder="+251 9xx xxx xxx"
                    className={`${inputCls} pl-9`} />
                </div>
              </div>

              {/* Principal Name */}
              <div>
                <label className={labelCls}>Principal Name</label>
                <div className="relative">
                  <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" value={form.principal_name ?? ''} onChange={set('principal_name')}
                    placeholder="Principal's full name"
                    className={`${inputCls} pl-9`} />
                </div>
              </div>

              {/* Established Year */}
              <div>
                <label className={labelCls}>Established Year</label>
                <div className="relative">
                  <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" value={form.established_year ?? ''} onChange={set('established_year')}
                    placeholder="e.g. 1998 E.C"
                    className={`${inputCls} pl-9`} />
                </div>
              </div>

              {/* Description */}
              <div className="col-span-2">
                <label className={labelCls}>Description <span className="text-gray-400 font-normal">(optional)</span></label>
                <textarea rows={3} value={form.description ?? ''} onChange={set('description')}
                  placeholder="Brief description of the school..."
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 resize-none" />
              </div>

              {/* Actions */}
              <div className="col-span-2 flex gap-3 pt-2">
                <button onClick={handleCancel}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button onClick={handleSave} disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors">
                  {saving ? <Spinner size="sm" /> : <Save size={15} />}
                  {saving ? 'Saving...' : profile ? 'Save Changes' : 'Create Profile'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── View mode (only when profile exists and not editing) ── */}
      {profile && !editing && (
        <div className="max-w-3xl space-y-5">

          {/* Account status banner */}
          {user?.status !== 'ACTIVE' && (
            <div className="flex items-center gap-3 bg-yellow-50 border border-yellow-200 rounded-2xl px-5 py-3">
              <Clock size={16} className="text-yellow-600 flex-shrink-0" />
              <p className="text-sm text-yellow-800">
                Your account is <span className="font-bold">{user?.status}</span> — waiting for admin approval before you can use school features.
              </p>
            </div>
          )}

          {/* School identity card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="h-20 bg-gradient-to-r from-green-600 to-green-500" />
            <div className="px-6 pb-6">
              <div className="flex items-end gap-4 -mt-8 mb-4">
                <div className="w-16 h-16 bg-white rounded-2xl border-4 border-white shadow-md flex items-center justify-center">
                  <School size={28} className="text-green-600" />
                </div>
                <div className="pb-1">
                  <h2 className="text-xl font-bold text-gray-900">{profile.school_name}</h2>
                  <p className="text-sm text-gray-500">{SCHOOL_TYPES[profile.school_type] ?? profile.school_type}</p>
                </div>
                {user?.status === 'ACTIVE' && (
                  <div className="ml-auto pb-1 flex items-center gap-1.5 bg-green-50 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                    <CheckCircle size={12} /> Active
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
                <InfoRow icon={Hash}      label="Registration Number" value={profile.registration_number} />
                <InfoRow icon={Calendar}  label="Established Year"    value={profile.established_year} />
                <InfoRow icon={MapPin}    label="Address"             value={profile.address} />
                <InfoRow icon={Building2} label="City"                value={profile.city} />
                <InfoRow icon={MapPin}    label="Region"              value={profile.region} />
                <InfoRow icon={Phone}     label="Phone"               value={profile.phone} />
                <InfoRow icon={User}      label="Principal Name"      value={profile.principal_name} />
                <InfoRow icon={BookOpen}  label="School Type"         value={SCHOOL_TYPES[profile.school_type]} />
              </div>

              {profile.description && (
                <div className="mt-4 pt-4 border-t border-gray-50">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText size={13} className="text-green-600" />
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">About</p>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{profile.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* Account info card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">Account Information</p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-400 mb-1">Account Name</p>
                <p className="font-semibold text-gray-800">{user?.name}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-400 mb-1">Email</p>
                <p className="font-semibold text-gray-800 truncate">{user?.email}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-400 mb-1">Status</p>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${user?.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {user?.status}
                </span>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-400 mb-1">Profile Updated</p>
                <p className="font-semibold text-gray-800 text-xs">
                  {new Date(profile.updated_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}
