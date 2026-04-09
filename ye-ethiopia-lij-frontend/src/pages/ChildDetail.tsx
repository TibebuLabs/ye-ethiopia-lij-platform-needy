import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import Spinner from '../components/Spinner'
import { getChild, sponsorChild, resubmitChild, pmFlagChild } from '../api/children'
import { mediaUrl } from '../api/axios'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import {
  MapPin, User, Heart, FileText, ArrowLeft,
  Calendar, Shield, Building2, Users, CheckCircle,
  XCircle, Clock, Star, ExternalLink, ChevronDown, ChevronUp,
  Upload, X, CreditCard, Smartphone, Landmark, AlertTriangle, RefreshCw, MessageSquare, Download,
} from 'lucide-react'
import { downloadFile } from '../utils/download'
import type { ChildProfile, ChildStatus, PaymentProvider } from '../types'

const TRUNCATE_AT = 250

function TextCard({
  icon, iconBg, title, text,
}: {
  icon: React.ReactNode; iconBg: string; title: string; text: string
}) {
  const [expanded, setExpanded] = useState(false)
  const isLong = text.length > TRUNCATE_AT
  const displayed = isLong && !expanded ? text.slice(0, TRUNCATE_AT) + '…' : text

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      {/* Header */}
      <h2 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
        <div className={`w-7 h-7 ${iconBg} rounded-lg flex items-center justify-center flex-shrink-0`}>
          {icon}
        </div>
        {title}
      </h2>

      {/* Content — always inside the card */}
      <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap break-words">
        {displayed}
      </p>

      {/* Toggle only when text is long */}
      {isLong && (
        <button
          onClick={() => setExpanded((e) => !e)}
          className="mt-3 flex items-center gap-1 text-xs font-semibold text-green-600 hover:text-green-700 transition-colors"
        >
          {expanded
            ? <><ChevronUp size={13} /> Show less</>
            : <><ChevronDown size={13} /> Show more</>}
        </button>
      )}
    </div>
  )
}

const STATUS_CONFIG: Record<ChildStatus, { label: string; color: string; icon: typeof CheckCircle }> = {
  PUBLISHED:  { label: 'Available',  color: 'bg-green-100 text-green-700 border-green-200',  icon: CheckCircle },
  PENDING:    { label: 'Pending',    color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: Clock },
  SPONSORED:  { label: 'Sponsored',  color: 'bg-blue-100 text-blue-700 border-blue-200',      icon: Star },
  REJECTED:   { label: 'Rejected',   color: 'bg-red-100 text-red-700 border-red-200',         icon: XCircle },
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">{label}</span>
      <span className="text-sm font-semibold text-gray-800">{value || '—'}</span>
    </div>
  )
}

export default function ChildDetail() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [child, setChild] = useState<ChildProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [showResubmit, setShowResubmit] = useState(false)
  const [showPMFlag, setShowPMFlag] = useState(false)
  const [pmNotes, setPmNotes] = useState('')
  const [pmFlagging, setPmFlagging] = useState(false)

  // Resubmit form state (mirrors RegisterChild fields)
  const [resubmitForm, setResubmitForm] = useState({
    full_name: '', age: '', gender: 'MALE', location: '',
    biography: '', vulnerability_status: '', guardian_info: '',
  })
  const [resubmitPhoto, setResubmitPhoto] = useState<File | null>(null)
  const [resubmitDocs, setResubmitDocs] = useState<File | null>(null)
  const [resubmitting, setResubmitting] = useState(false)

  // Sponsorship form state
  const [amount, setAmount] = useState('')
  const [provider, setProvider] = useState<PaymentProvider | ''>('')
  const [proofFile, setProofFile] = useState<File | null>(null)
  const [proofPreview, setProofPreview] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!id) return
    getChild(id)
      .then((r) => {
        setChild(r.data)
        // Pre-fill resubmit form with existing data
        const c = r.data
        setResubmitForm({
          full_name: c.full_name,
          age: String(c.age),
          gender: c.gender,
          location: c.location,
          biography: c.biography,
          vulnerability_status: c.vulnerability_status,
          guardian_info: c.guardian_info,
        })
      })
      .catch(() => toast.error('Child not found'))
      .finally(() => setLoading(false))
  }, [id])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf']
    if (!allowed.includes(file.type)) {
      toast.error('Only image files (JPG, PNG, GIF, WEBP) or PDF are allowed')
      return
    }
    setProofFile(file)
    if (file.type.startsWith('image/')) {
      setProofPreview(URL.createObjectURL(file))
    } else {
      setProofPreview(null)
    }
  }

  const handleResubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!id || !child) return
    setResubmitting(true)
    try {
      const fd = new FormData()
      Object.entries(resubmitForm).forEach(([k, v]) => fd.append(k, v))
      if (resubmitPhoto) fd.append('photo', resubmitPhoto)
      if (resubmitDocs) fd.append('supporting_docs', resubmitDocs)
      const res = await resubmitChild(id, fd)
      setChild(res.data.data)
      setShowResubmit(false)
      toast.success('Profile resubmitted for review!')
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: { message?: string } } } })
          ?.response?.data?.error?.message ?? 'Resubmission failed'
      toast.error(msg)
    } finally {
      setResubmitting(false)
    }
  }

  const handleSponsor = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast.error('Enter a valid commitment amount')
      return
    }
    if (!provider) {
      toast.error('Please select a payment provider')
      return
    }
    if (!proofFile) {
      toast.error('Proof of payment is required')
      return
    }
    if (!id || !child) return

    setSubmitting(true)
    try {
      const fd = new FormData()
      fd.append('commitment_amount', amount)
      fd.append('payment_provider', provider)
      fd.append('payment_proof', proofFile)

      await sponsorChild(id, fd)
      toast.success('Sponsorship request submitted! An admin will review your payment.')
      setShowModal(false)
      navigate('/my-sponsorships')
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: { message?: string } } } })
          ?.response?.data?.error?.message ?? 'Submission failed'
      toast.error(msg)
    } finally {
      setSubmitting(false)
    }
  }

  const handlePMFlag = async () => {
    if (!pmNotes.trim() || !id) return
    setPmFlagging(true)
    try {
      await pmFlagChild(id, pmNotes)
      toast.success('Notes sent to Admin for review')
      setShowPMFlag(false)
      setPmNotes('')
      // Refresh child data to show updated pm_notes
      const r = await getChild(id)
      setChild(r.data)
    } catch {
      toast.error('Failed to send notes')
    } finally {
      setPmFlagging(false)
    }
  }

  if (loading) return (
    <Layout>
      <div className="flex justify-center items-center py-32">
        <Spinner size="lg" />
      </div>
    </Layout>
  )

  if (!child) return (
    <Layout>
      <div className="text-center py-32 text-gray-400">
        <User size={48} className="mx-auto mb-3 opacity-30" />
        <p>Child not found</p>
      </div>
    </Layout>
  )

  const statusCfg = STATUS_CONFIG[child.status] ?? STATUS_CONFIG.PENDING
  const StatusIcon = statusCfg.icon
  const photoUrl = child.photo ? mediaUrl(child.photo) : null

  return (
    <Layout>
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-green-600 mb-6 transition-colors group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
        Back to Children
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Left column ─────────────────────────────────────────────── */}
        <div className="space-y-4">

          {/* Photo card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {photoUrl ? (
              <img
                src={photoUrl}
                alt={child.full_name}
                className="w-full h-64 object-cover"
              />
            ) : (
              <div className="w-full h-64 bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
                <User size={72} className="text-green-300" />
              </div>
            )}

            <div className="p-5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h1 className="text-xl font-bold text-gray-900 leading-tight">{child.full_name}</h1>
                  <p className="text-gray-500 text-sm mt-0.5 flex items-center gap-1">
                    <Calendar size={13} /> {child.age} years old · {child.gender}
                  </p>
                </div>
                <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${statusCfg.color} whitespace-nowrap`}>
                  <StatusIcon size={11} /> {statusCfg.label}
                </span>
              </div>

              <div className="flex items-center gap-1.5 mt-3 text-sm text-gray-500">
                <MapPin size={14} className="text-green-500 flex-shrink-0" />
                {child.location}
              </div>

              {child.organization_name && (
                <div className="flex items-center gap-1.5 mt-2 text-sm text-gray-500">
                  <Building2 size={14} className="text-green-500 flex-shrink-0" />
                  {child.organization_name}
                </div>
              )}
            </div>
          </div>

          {/* Quick stats */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Quick Info</h3>
            <div className="space-y-3">
              <InfoRow label="Gender" value={child.gender} />
              <InfoRow label="Age" value={`${child.age} years`} />
              <InfoRow label="Location" value={child.location} />
              <InfoRow label="Vulnerability" value={child.vulnerability_status} />
              <InfoRow label="Organization" value={child.organization_name} />
            </div>
          </div>

          {/* Supporting docs */}
          {child.supporting_docs && (
            <div className="flex items-center gap-3 bg-white rounded-2xl shadow-sm border border-gray-100 p-4 hover:border-green-300 hover:shadow-md transition-all group">
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <FileText size={18} className="text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800">Supporting Documents</p>
                <p className="text-xs text-gray-400">View or download</p>
              </div>
              <div className="flex items-center gap-2">
                <a href={mediaUrl(child.supporting_docs)!} target="_blank" rel="noreferrer"
                  className="p-1.5 rounded-lg hover:bg-green-50 text-gray-400 hover:text-green-600 transition-colors" title="Open">
                  <ExternalLink size={14} />
                </a>
                <button
                  onClick={() => downloadFile(mediaUrl(child.supporting_docs)!).catch(() => {})}
                  className="p-1.5 rounded-lg hover:bg-green-50 text-gray-400 hover:text-green-600 transition-colors" title="Download"
                >
                  <Download size={14} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── Right column ────────────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-5">

          {/* Biography */}
          <TextCard
            iconBg="bg-green-100"
            icon={<User size={14} className="text-green-600" />}
            title={`About ${child.full_name.split(' ')[0]}`}
            text={child.biography || 'No biography provided.'}
          />

          {/* Guardian info */}
          <TextCard
            iconBg="bg-blue-100"
            icon={<Users size={14} className="text-blue-600" />}
            title="Guardian Information"
            text={child.guardian_info || 'No guardian information provided.'}
          />

          {/* Vulnerability & protection */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <div className="w-7 h-7 bg-orange-100 rounded-lg flex items-center justify-center">
                <Shield size={14} className="text-orange-500" />
              </div>
              Vulnerability Status
            </h2>
            <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-100 text-orange-700 text-sm font-medium px-4 py-2 rounded-xl">
              <Shield size={14} />
              {child.vulnerability_status || 'Not specified'}
            </div>
          </div>

          {/* PM Notes banner — visible to Admin when PM has flagged the profile */}
          {user?.role === 'ADMIN' && child.pm_notes && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 bg-yellow-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MessageSquare size={16} className="text-yellow-600" />
                </div>
                <div>
                  <p className="font-semibold text-yellow-800">Project Manager Review Notes</p>
                  <p className="text-yellow-700 text-sm mt-1 whitespace-pre-wrap">{child.pm_notes}</p>
                </div>
              </div>
            </div>
          )}

          {/* PM Flag for Review — visible to PM on PENDING profiles */}
          {user?.role === 'PROJECT_MANAGER' && child.status === 'PENDING' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-9 h-9 bg-yellow-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MessageSquare size={16} className="text-yellow-600" />
                </div>
                <div>
                  <p className="font-semibold text-yellow-800">Review this Profile</p>
                  <p className="text-yellow-600 text-sm mt-0.5">
                    {child.pm_notes
                      ? 'You have already added notes. You can update them below.'
                      : 'Add your review notes and forward to Admin for final decision.'}
                  </p>
                  {child.pm_notes && (
                    <p className="text-xs text-yellow-700 mt-2 bg-yellow-100 rounded-lg px-3 py-2 whitespace-pre-wrap">
                      Current notes: {child.pm_notes}
                    </p>
                  )}
                </div>
              </div>
              {!showPMFlag ? (
                <button
                  onClick={() => { setShowPMFlag(true); setPmNotes(child.pm_notes || '') }}
                  className="flex items-center gap-2 text-sm font-semibold text-white bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded-xl transition-colors"
                >
                  <MessageSquare size={14} />
                  {child.pm_notes ? 'Update Notes' : 'Add Review Notes'}
                </button>
              ) : (
                <div className="space-y-3">
                  <textarea
                    rows={3}
                    value={pmNotes}
                    onChange={(e) => setPmNotes(e.target.value)}
                    placeholder="Describe your findings or concerns for the Admin..."
                    className="w-full px-3 py-2 text-sm border border-yellow-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none bg-white"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowPMFlag(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handlePMFlag}
                      disabled={!pmNotes.trim() || pmFlagging}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-yellow-500 hover:bg-yellow-600 rounded-xl disabled:opacity-50"
                    >
                      {pmFlagging && <Spinner size="sm" />}
                      Send to Admin
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Rejection reason banner — visible to org staff on rejected profiles */}
          {child.status === 'REJECTED' && child.rejection_reason && user?.role === 'ORG_STAFF' && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-9 h-9 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <AlertTriangle size={16} className="text-red-600" />
                </div>
                <div>
                  <p className="font-semibold text-red-800">Profile Rejected</p>
                  <p className="text-red-600 text-sm mt-0.5">{child.rejection_reason}</p>
                </div>
              </div>
              <button
                onClick={() => setShowResubmit(true)}
                className="flex items-center gap-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl transition-colors"
              >
                <RefreshCw size={14} /> Edit & Resubmit
              </button>
            </div>
          )}

          {/* Sponsor CTA — only for SPONSOR role on PUBLISHED children */}
          {user?.role === 'SPONSOR' && child.status === 'PUBLISHED' && (
            <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-2xl p-6 text-white shadow-lg shadow-green-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Heart size={20} className="text-white fill-white" />
                </div>
                <div>
                  <h2 className="font-bold text-lg">Sponsor {child.full_name.split(' ')[0]}</h2>
                  <p className="text-green-100 text-sm">Make a lasting difference in their life</p>
                </div>
              </div>

              <div className="bg-white/10 rounded-xl p-4 mb-4 text-sm text-green-50 space-y-1">
                <p className="flex items-center gap-2"><CheckCircle size={13} className="text-green-300" /> Education & school supplies covered</p>
                <p className="flex items-center gap-2"><CheckCircle size={13} className="text-green-300" /> Healthcare & nutrition support</p>
                <p className="flex items-center gap-2"><CheckCircle size={13} className="text-green-300" /> Regular progress updates</p>
              </div>

              <button
                onClick={() => setShowModal(true)}
                className="w-full flex items-center justify-center gap-2 bg-white text-green-700 font-bold px-6 py-3 rounded-xl hover:bg-green-50 transition-colors shadow"
              >
                <Heart size={16} className="fill-green-600 text-green-600" />
                Sponsor Now
              </button>
            </div>
          )}

          {/* Already sponsored banner */}
          {child.status === 'SPONSORED' && (
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Star size={18} className="text-blue-600 fill-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-blue-800">This child is already sponsored</p>
                <p className="text-blue-600 text-sm">Thank you to the sponsor making a difference!</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Resubmit Modal ────────────────────────────────────────────── */}
      {showResubmit && child && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowResubmit(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-red-600 to-red-500 rounded-t-2xl p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <RefreshCw size={18} className="text-white" />
                </div>
                <div>
                  <h2 className="font-bold">Edit & Resubmit Profile</h2>
                  <p className="text-red-100 text-xs">Make corrections and resubmit for review</p>
                </div>
              </div>
              <button onClick={() => setShowResubmit(false)} className="text-white/70 hover:text-white">
                <X size={20} />
              </button>
            </div>

            {/* Rejection reason reminder */}
            {child.rejection_reason && (
              <div className="mx-6 mt-5 bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2">
                <AlertTriangle size={14} className="text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700"><span className="font-semibold">Rejection reason:</span> {child.rejection_reason}</p>
              </div>
            )}

            <form onSubmit={handleResubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input className="input-field" value={resubmitForm.full_name}
                    onChange={(e) => setResubmitForm({ ...resubmitForm, full_name: e.target.value })} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Age *</label>
                  <input type="number" className="input-field" min="0" max="18" value={resubmitForm.age}
                    onChange={(e) => setResubmitForm({ ...resubmitForm, age: e.target.value })} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
                  <select className="input-field" value={resubmitForm.gender}
                    onChange={(e) => setResubmitForm({ ...resubmitForm, gender: e.target.value })}>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                  <input className="input-field" value={resubmitForm.location}
                    onChange={(e) => setResubmitForm({ ...resubmitForm, location: e.target.value })} required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vulnerability Status *</label>
                <input className="input-field" value={resubmitForm.vulnerability_status}
                  onChange={(e) => setResubmitForm({ ...resubmitForm, vulnerability_status: e.target.value })} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Biography *</label>
                <textarea className="input-field min-h-[90px] resize-none" value={resubmitForm.biography}
                  onChange={(e) => setResubmitForm({ ...resubmitForm, biography: e.target.value })} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Guardian Info *</label>
                <textarea className="input-field min-h-[70px] resize-none" value={resubmitForm.guardian_info}
                  onChange={(e) => setResubmitForm({ ...resubmitForm, guardian_info: e.target.value })} required />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Photo (optional)</label>
                  <label className="flex items-center gap-2 cursor-pointer border border-dashed border-gray-300 rounded-lg px-4 py-3 hover:border-green-400 transition-colors">
                    <Upload size={15} className="text-gray-400" />
                    <span className="text-sm text-gray-500">{resubmitPhoto ? resubmitPhoto.name : 'Replace photo'}</span>
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => setResubmitPhoto(e.target.files?.[0] ?? null)} />
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Supporting Docs (optional)</label>
                  <label className="flex items-center gap-2 cursor-pointer border border-dashed border-gray-300 rounded-lg px-4 py-3 hover:border-green-400 transition-colors">
                    <Upload size={15} className="text-gray-400" />
                    <span className="text-sm text-gray-500">{resubmitDocs ? resubmitDocs.name : 'Replace document'}</span>
                    <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={(e) => setResubmitDocs(e.target.files?.[0] ?? null)} />
                  </label>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowResubmit(false)} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" disabled={resubmitting} className="btn-primary flex-1 flex items-center justify-center gap-2">
                  {resubmitting && <Spinner size="sm" />}
                  {resubmitting ? 'Resubmitting...' : 'Resubmit for Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Sponsorship Modal ──────────────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-slideIn"
            onClick={e => e.stopPropagation()}>

            {/* Modal header */}
            <div className="bg-gradient-to-r from-green-600 to-green-500 rounded-t-2xl p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Heart size={18} className="text-white fill-white" />
                </div>
                <div>
                  <h2 className="font-bold">Sponsor {child.full_name.split(' ')[0]}</h2>
                  <p className="text-green-100 text-xs">Submit payment proof for admin review</p>
                </div>
              </div>
              <button onClick={() => setShowModal(false)} className="text-white/70 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Step indicators */}
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span className="w-5 h-5 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-xs">1</span>
                <span className="text-gray-600 font-medium">Fill details</span>
                <div className="flex-1 h-px bg-gray-200" />
                <span className="w-5 h-5 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-xs">2</span>
                <span className="text-gray-600 font-medium">Upload proof</span>
                <div className="flex-1 h-px bg-gray-200" />
                <span className="w-5 h-5 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-bold text-xs">3</span>
                <span>Admin review</span>
              </div>

              {/* Monthly amount */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Monthly Commitment (ETB) *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">ETB</span>
                  <input
                    type="number"
                    placeholder="e.g. 500"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    min="1"
                    className="input-field pl-12"
                  />
                </div>
              </div>

              {/* Payment provider */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Payment Provider *</label>
                <div className="grid grid-cols-3 gap-2">
                  {([
                    { value: 'TELEBIRR', label: 'Telebirr', icon: Smartphone },
                    { value: 'CBE',      label: 'CBE',      icon: Landmark },
                    { value: 'BANK',     label: 'Bank',     icon: CreditCard },
                  ] as { value: PaymentProvider; label: string; icon: typeof Smartphone }[]).map(({ value, label, icon: Icon }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setProvider(value)}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all text-sm font-medium ${
                        provider === value
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-gray-200 text-gray-500 hover:border-green-300'
                      }`}
                    >
                      <Icon size={18} />
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Proof upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Proof of Payment * <span className="text-xs font-normal text-gray-400">(screenshot or PDF)</span>
                </label>
                {!proofFile ? (
                  <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-xl p-6 cursor-pointer hover:border-green-400 hover:bg-green-50 transition-all">
                    <Upload size={24} className="text-gray-400" />
                    <span className="text-sm text-gray-500">Click to upload transaction screenshot</span>
                    <span className="text-xs text-gray-400">JPG, PNG, PDF accepted</span>
                    <input type="file" accept="image/*,application/pdf" className="hidden" onChange={handleFileChange} />
                  </label>
                ) : (
                  <div className="border border-green-200 rounded-xl overflow-hidden">
                    {proofPreview ? (
                      <img src={proofPreview} alt="proof" className="w-full max-h-40 object-contain bg-gray-50" />
                    ) : (
                      <div className="flex items-center gap-2 p-3 bg-green-50">
                        <FileText size={16} className="text-green-600" />
                        <span className="text-sm text-green-800 truncate">{proofFile.name}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between px-3 py-2 bg-white border-t border-green-100">
                      <span className="text-xs text-gray-500 truncate">{proofFile.name}</span>
                      <button onClick={() => { setProofFile(null); setProofPreview(null) }}
                        className="text-red-400 hover:text-red-600 ml-2 flex-shrink-0">
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Info box */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-700 flex items-start gap-2">
                <Clock size={14} className="flex-shrink-0 mt-0.5" />
                <p>Your request will be marked as <strong>Pending Manual Verification</strong>. An administrator will review your payment proof and activate the sponsorship.</p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-1">
                <button onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
                <button
                  onClick={handleSponsor}
                  disabled={submitting}
                  className="btn-primary flex-1 flex items-center justify-center gap-2"
                >
                  {submitting ? <Spinner size="sm" /> : <Heart size={15} />}
                  {submitting ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}
