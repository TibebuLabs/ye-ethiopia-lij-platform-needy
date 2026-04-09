import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register } from '../api/auth'
import toast from 'react-hot-toast'
import {
  Eye, EyeOff, Mail, Lock, User, Briefcase, UserPlus,
  Shield, CheckCircle, MapPin, Phone, School, Hash,
  ChevronDown, ChevronUp, Upload, FileText, Building2, Globe,
} from 'lucide-react'
import Spinner from '../components/Spinner'
import type { UserRole } from '../types'

const ROLES: { value: UserRole; label: string }[] = [
  { value: 'ADMIN',           label: 'System Administrator' },
  { value: 'SPONSOR',         label: 'Sponsor' },
  { value: 'ORG_STAFF',       label: 'Organization Staff' },
  { value: 'SCHOOL',          label: 'School' },
  { value: 'GOVERNMENT',      label: 'Government' },
  { value: 'PROJECT_MANAGER', label: 'Project Manager' },
]

const SCHOOL_TYPES = [
  { value: 'PRIMARY',     label: 'Primary School' },
  { value: 'SECONDARY',   label: 'Secondary School' },
  { value: 'PREPARATORY', label: 'Preparatory School' },
  { value: 'COMBINED',    label: 'Combined (Grade 1–12)' },
  { value: 'VOCATIONAL',  label: 'Vocational / TVET' },
  { value: 'OTHER',       label: 'Other' },
]

const ORG_TYPES = [
  { value: 'ORPHANAGE', label: 'Orphanage' },
  { value: 'NGO',       label: 'Non-Governmental Organization' },
  { value: 'RELIGIOUS', label: 'Religion Based Institution' },
  { value: 'OTHER',     label: 'Other' },
]

interface RegisterForm {
  email: string; name: string; role: UserRole
  password: string; password_confirm: string
  // school
  school_name: string; school_type: string; registration_number: string
  address: string; city: string; region: string; phone: string
  principal_name: string; established_year: string; description: string
  // org
  org_name: string; org_type: string; org_registration_number: string
  org_address: string; org_city: string; org_phone: string
  org_email: string; org_website: string
  org_established_year: string; org_description: string
}

const inputCls = 'w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent placeholder-gray-300 transition bg-white'
const labelCls = 'block text-xs font-semibold text-gray-700 mb-1.5'

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState<RegisterForm>({
    email: '', name: '', role: 'SPONSOR', password: '', password_confirm: '',
    school_name: '', school_type: 'PRIMARY', registration_number: '',
    address: '', city: '', region: '', phone: '',
    principal_name: '', established_year: '', description: '',
    org_name: '', org_type: 'ORPHANAGE', org_registration_number: '',
    org_address: '', org_city: '', org_phone: '', org_email: '',
    org_website: '', org_established_year: '', org_description: '',
  })
  const [showPw, setShowPw] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [schoolExpanded, setSchoolExpanded] = useState(true)
  const [orgExpanded, setOrgExpanded] = useState(true)
  const [docFile, setDocFile] = useState<File | null>(null)

  const isSchool = form.role === 'SCHOOL'
  const isOrg = form.role === 'ORG_STAFF'
  const isWide = isSchool || isOrg

  const set = (k: keyof RegisterForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password !== form.password_confirm) { toast.error('Passwords do not match'); return }
    if (isSchool && !form.school_name.trim()) { toast.error('School name is required'); return }
    if (isOrg && !form.org_name.trim()) { toast.error('Organization name is required'); return }
    if (!docFile && form.role !== 'ADMIN') { toast.error('Verification document is required'); return }
    setLoading(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => { if (v) fd.append(k, v) })
      if (docFile) fd.append('verification_document', docFile)
      await register(fd)
      toast.success(form.role === 'ADMIN' ? 'Admin account created! You can now log in.' : 'Account created! Please wait for admin approval.')
      navigate('/login')
    } catch (err: unknown) {
      const errors = (err as { response?: { data?: Record<string, unknown> } })?.response?.data
      const msg =
        (errors?.error as { message?: string })?.message ??
        (errors?.org_name as string[])?.[0] ??
        (errors?.school_name as string[])?.[0] ??
        (Object.values(errors ?? {})[0] as string[])?.[0] ??
        'Registration failed'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 font-poppins">
      <div className={`w-full bg-white rounded-3xl shadow-xl overflow-hidden ${isWide ? 'max-w-2xl' : 'max-w-sm'}`}>
        <div className="h-1.5 bg-gradient-to-r from-green-500 to-green-400" />
        <div className="px-8 pt-8 pb-6">

          {/* Icon */}
          <div className="flex justify-center mb-5">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl rotate-6 shadow-lg flex items-center justify-center">
                <UserPlus size={30} className="text-white -rotate-6" />
              </div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white border border-gray-100 shadow-sm rounded-full px-2 py-0.5 flex items-center gap-1 whitespace-nowrap">
                <CheckCircle size={10} className="text-green-500 fill-green-500" />
                <span className="text-[10px] font-semibold text-gray-600">Free to Join</span>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full border-2 border-white" />
            </div>
          </div>

          <div className="text-center mb-6 mt-3">
            <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
            <p className="text-green-600 text-sm mt-1 flex items-center justify-center gap-1">
              <Shield size={12} /> Ye Ethiopia Lij · Child Welfare Platform
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">

            {/* ── Account Info ── */}
            <div className={isWide ? 'grid grid-cols-2 gap-3' : 'space-y-3.5'}>
              <div>
                <label className={labelCls}>Full Name</label>
                <div className="relative">
                  <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" placeholder="Your full name" value={form.name}
                    onChange={set('name')} required className={inputCls} />
                </div>
              </div>
              <div>
                <label className={labelCls}>Email Address</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="email" placeholder="name@example.com" value={form.email}
                    onChange={set('email')} required className={inputCls} />
                </div>
              </div>
              <div className={isWide ? 'col-span-2' : ''}>
                <label className={labelCls}>Role</label>
                <div className="relative">
                  <Briefcase size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <select value={form.role} onChange={set('role')} className={`${inputCls} appearance-none`}>
                    {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className={labelCls}>Password</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type={showPw ? 'text' : 'password'} placeholder="Min 8 chars, uppercase, digit, special"
                    value={form.password} onChange={set('password')} required className={`${inputCls} pr-10`} />
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
              <div>
                <label className={labelCls}>Confirm Password</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type={showConfirm ? 'text' : 'password'} placeholder="Repeat your password"
                    value={form.password_confirm} onChange={set('password_confirm')} required className={`${inputCls} pr-10`} />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
            </div>

            {/* ── School Details ── */}
            {isSchool && (
              <div className="border border-green-100 rounded-2xl overflow-hidden">
                <button type="button" onClick={() => setSchoolExpanded(x => !x)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-green-50 hover:bg-green-100 transition-colors">
                  <div className="flex items-center gap-2">
                    <School size={15} className="text-green-600" />
                    <span className="text-sm font-semibold text-green-800">School Information</span>
                    <span className="text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full">Required</span>
                  </div>
                  {schoolExpanded ? <ChevronUp size={15} className="text-green-600" /> : <ChevronDown size={15} className="text-green-600" />}
                </button>
                {schoolExpanded && (
                  <div className="p-4 grid grid-cols-2 gap-3">
                    <div className="col-span-2">
                      <label className={labelCls}>School Name *</label>
                      <div className="relative">
                        <School size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="text" placeholder="e.g. Addis Ababa Primary School"
                          value={form.school_name} onChange={set('school_name')} className={inputCls} />
                      </div>
                    </div>
                    <div>
                      <label className={labelCls}>School Type</label>
                      <div className="relative">
                        <Briefcase size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        <select value={form.school_type} onChange={set('school_type')} className={`${inputCls} appearance-none`}>
                          {SCHOOL_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className={labelCls}>Registration No.</label>
                      <div className="relative">
                        <Hash size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="text" placeholder="e.g. SCH-2024-001"
                          value={form.registration_number} onChange={set('registration_number')} className={inputCls} />
                      </div>
                    </div>
                    <div className="col-span-2">
                      <label className={labelCls}>Address</label>
                      <div className="relative">
                        <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="text" placeholder="Street address"
                          value={form.address} onChange={set('address')} className={inputCls} />
                      </div>
                    </div>
                    <div>
                      <label className={labelCls}>City</label>
                      <div className="relative">
                        <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="text" placeholder="e.g. Addis Ababa"
                          value={form.city} onChange={set('city')} className={inputCls} />
                      </div>
                    </div>
                    <div>
                      <label className={labelCls}>Region</label>
                      <div className="relative">
                        <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="text" placeholder="e.g. Oromia"
                          value={form.region} onChange={set('region')} className={inputCls} />
                      </div>
                    </div>
                    <div>
                      <label className={labelCls}>Phone</label>
                      <div className="relative">
                        <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="tel" placeholder="+251 9xx xxx xxx"
                          value={form.phone} onChange={set('phone')} className={inputCls} />
                      </div>
                    </div>
                    <div>
                      <label className={labelCls}>Principal Name</label>
                      <div className="relative">
                        <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="text" placeholder="Principal's full name"
                          value={form.principal_name} onChange={set('principal_name')} className={inputCls} />
                      </div>
                    </div>
                    <div>
                      <label className={labelCls}>Established Year</label>
                      <div className="relative">
                        <Hash size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="text" placeholder="e.g. 1998 E.C"
                          value={form.established_year} onChange={set('established_year')} className={inputCls} />
                      </div>
                    </div>
                    <div className="col-span-2">
                      <label className={labelCls}>Description <span className="text-gray-400 font-normal">(optional)</span></label>
                      <textarea rows={2} placeholder="Brief description of the school..."
                        value={form.description} onChange={set('description')}
                        className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 placeholder-gray-300 resize-none" />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── Organization Details ── */}
            {isOrg && (
              <div className="border border-blue-100 rounded-2xl overflow-hidden">
                <button type="button" onClick={() => setOrgExpanded(x => !x)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-blue-50 hover:bg-blue-100 transition-colors">
                  <div className="flex items-center gap-2">
                    <Building2 size={15} className="text-blue-600" />
                    <span className="text-sm font-semibold text-blue-800">Organization Information</span>
                    <span className="text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">Required</span>
                  </div>
                  {orgExpanded ? <ChevronUp size={15} className="text-blue-600" /> : <ChevronDown size={15} className="text-blue-600" />}
                </button>
                {orgExpanded && (
                  <div className="p-4 grid grid-cols-2 gap-3">
                    <div className="col-span-2">
                      <label className={labelCls}>Organization Name *</label>
                      <div className="relative">
                        <Building2 size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="text" placeholder="e.g. Hope Children's Home"
                          value={form.org_name} onChange={set('org_name')} className={inputCls} />
                      </div>
                    </div>
                    <div>
                      <label className={labelCls}>Organization Type</label>
                      <div className="relative">
                        <Briefcase size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        <select value={form.org_type} onChange={set('org_type')} className={`${inputCls} appearance-none`}>
                          {ORG_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className={labelCls}>Registration No.</label>
                      <div className="relative">
                        <Hash size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="text" placeholder="e.g. NGO-2024-001"
                          value={form.org_registration_number} onChange={set('org_registration_number')} className={inputCls} />
                      </div>
                    </div>
                    <div className="col-span-2">
                      <label className={labelCls}>Address</label>
                      <div className="relative">
                        <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="text" placeholder="Street address"
                          value={form.org_address} onChange={set('org_address')} className={inputCls} />
                      </div>
                    </div>
                    <div>
                      <label className={labelCls}>City</label>
                      <div className="relative">
                        <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="text" placeholder="e.g. Addis Ababa"
                          value={form.org_city} onChange={set('org_city')} className={inputCls} />
                      </div>
                    </div>
                    <div>
                      <label className={labelCls}>Phone</label>
                      <div className="relative">
                        <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="tel" placeholder="+251 9xx xxx xxx"
                          value={form.org_phone} onChange={set('org_phone')} className={inputCls} />
                      </div>
                    </div>
                    <div>
                      <label className={labelCls}>Organization Email</label>
                      <div className="relative">
                        <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="email" placeholder="org@example.com"
                          value={form.org_email} onChange={set('org_email')} className={inputCls} />
                      </div>
                    </div>
                    <div>
                      <label className={labelCls}>Website <span className="text-gray-400 font-normal">(optional)</span></label>
                      <div className="relative">
                        <Globe size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="url" placeholder="https://example.org"
                          value={form.org_website} onChange={set('org_website')} className={inputCls} />
                      </div>
                    </div>
                    <div>
                      <label className={labelCls}>Established Year</label>
                      <div className="relative">
                        <Hash size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="number" placeholder="e.g. 2005"
                          value={form.org_established_year} onChange={set('org_established_year')} className={inputCls} />
                      </div>
                    </div>
                    <div className="col-span-2">
                      <label className={labelCls}>Description <span className="text-gray-400 font-normal">(optional)</span></label>
                      <textarea rows={2} placeholder="Brief description of the organization..."
                        value={form.org_description} onChange={set('org_description')}
                        className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 placeholder-gray-300 resize-none" />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── Verification Document ── */}
            {form.role !== 'ADMIN' && (
            <div>
              <label className={labelCls}>
                Verification Document <span className="text-red-500">*</span>
                <span className="text-gray-400 font-normal ml-1">(ID, license, authorization letter, etc.)</span>
              </label>
              <label className={`flex items-center gap-3 w-full px-4 py-3 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
                docFile ? 'border-green-400 bg-green-50' : 'border-gray-200 hover:border-green-300 hover:bg-green-50'
              }`}>
                <input type="file" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" className="hidden"
                  onChange={e => setDocFile(e.target.files?.[0] ?? null)} />
                {docFile ? (
                  <>
                    <FileText size={18} className="text-green-600 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-green-700 truncate">{docFile.name}</p>
                      <p className="text-xs text-green-500">{(docFile.size / 1024).toFixed(1)} KB · Click to change</p>
                    </div>
                  </>
                ) : (
                  <>
                    <Upload size={18} className="text-gray-400 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500">Click to upload document</p>
                      <p className="text-xs text-gray-400">PDF, DOC, JPG, PNG accepted</p>
                    </div>
                  </>
                )}
              </label>
            </div>
            )}

            {/* Submit */}
            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors shadow-md shadow-green-200 text-sm mt-1">
              {loading ? <Spinner size="sm" /> : <UserPlus size={16} />}
              {loading ? 'Creating...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-xs text-gray-500 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-green-600 font-semibold hover:underline">Sign in &rsaquo;</Link>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-5 mt-6 text-xs text-gray-400">
        <a href="#" className="hover:text-gray-600 transition-colors">Privacy Policy</a>
        <a href="#" className="hover:text-gray-600 transition-colors">Terms of Service</a>
        <a href="#" className="hover:text-gray-600 transition-colors">Help Center</a>
      </div>

      <div className="mt-4 flex items-center gap-2 bg-white border border-gray-100 shadow-sm rounded-full px-4 py-2">
        <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
          <Shield size={12} className="text-white" />
        </div>
        <span className="text-xs font-semibold text-gray-700">Official Partner</span>
      </div>

      <p className="mt-4 text-[11px] text-gray-400">© 2026 Ye Ethiopia Lij. All rights reserved.</p>
    </div>
  )
}
