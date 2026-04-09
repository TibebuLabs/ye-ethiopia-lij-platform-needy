import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import Spinner from '../components/Spinner'
import { mySponsorships, resubmitSponsorship } from '../api/children'
import { mediaUrl } from '../api/axios'
import toast from 'react-hot-toast'
import {
  Heart, User, Clock, CheckCircle, XCircle, FileText,
  ExternalLink, Upload, X, CreditCard, Smartphone, Landmark,
  RefreshCw,
} from 'lucide-react'
import type { Sponsorship, VerificationStatus, PaymentProvider } from '../types'

const VERIFICATION_CONFIG: Record<VerificationStatus, { label: string; color: string; icon: typeof Clock }> = {
  PENDING:  { label: 'Pending Review', color: 'bg-amber-100 text-amber-700',  icon: Clock },
  VERIFIED: { label: 'Verified',       color: 'bg-green-100 text-green-700',  icon: CheckCircle },
  REJECTED: { label: 'Rejected',       color: 'bg-red-100 text-red-700',      icon: XCircle },
}

const PROVIDER_LABELS: Record<string, string> = {
  TELEBIRR: 'Telebirr',
  CBE: 'Commercial Bank of Ethiopia',
  BANK: 'Bank Transfer',
}

// ── Resubmit Modal ────────────────────────────────────────────────────────────
function ResubmitModal({ sponsorship, onClose, onSuccess }: {
  sponsorship: Sponsorship
  onClose: () => void
  onSuccess: (updated: Sponsorship) => void
}) {
  const [amount, setAmount] = useState(sponsorship.commitment_amount)
  const [provider, setProvider] = useState<PaymentProvider | ''>(sponsorship.payment_provider ?? '')
  const [proofFile, setProofFile] = useState<File | null>(null)
  const [proofPreview, setProofPreview] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf']
    if (!allowed.includes(file.type)) {
      toast.error('Only image files or PDF are allowed')
      return
    }
    setProofFile(file)
    setProofPreview(file.type.startsWith('image/') ? URL.createObjectURL(file) : null)
  }

  const handleSubmit = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast.error('Enter a valid commitment amount')
      return
    }
    if (!provider) { toast.error('Please select a payment provider'); return }
    if (!proofFile) { toast.error('Proof of payment is required'); return }

    setSubmitting(true)
    try {
      const fd = new FormData()
      fd.append('commitment_amount', amount)
      fd.append('payment_provider', provider)
      fd.append('payment_proof', proofFile)
      const res = await resubmitSponsorship(sponsorship.id, fd)
      toast.success('Resubmitted successfully! Awaiting admin review.')
      onSuccess(res.data.data)
      onClose()
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: { message?: string } } } })
        ?.response?.data?.error?.message ?? 'Resubmission failed'
      toast.error(msg)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-slideIn"
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-400 rounded-t-2xl p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <RefreshCw size={18} className="text-white" />
            </div>
            <div>
              <h2 className="font-bold">Resubmit Sponsorship</h2>
              <p className="text-orange-100 text-xs">{sponsorship.child_name}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white"><X size={20} /></button>
        </div>

        <div className="p-6 space-y-5">
          {/* Rejection reason */}
          {sponsorship.verification_notes && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
              <p className="font-semibold mb-0.5">Rejection reason:</p>
              <p>{sponsorship.verification_notes}</p>
            </div>
          )}

          {/* Amount */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Monthly Commitment (ETB) *</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">ETB</span>
              <input type="number" placeholder="e.g. 500" value={amount}
                onChange={e => setAmount(e.target.value)} min="1" className="input-field pl-12" />
            </div>
          </div>

          {/* Provider */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Payment Provider *</label>
            <div className="grid grid-cols-3 gap-2">
              {([
                { value: 'TELEBIRR', label: 'Telebirr', icon: Smartphone },
                { value: 'CBE',      label: 'CBE',      icon: Landmark },
                { value: 'BANK',     label: 'Bank',     icon: CreditCard },
              ] as { value: PaymentProvider; label: string; icon: typeof Smartphone }[]).map(({ value, label, icon: Icon }) => (
                <button key={value} type="button" onClick={() => setProvider(value)}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all text-sm font-medium ${
                    provider === value
                      ? 'border-orange-500 bg-orange-50 text-orange-700'
                      : 'border-gray-200 text-gray-500 hover:border-orange-300'
                  }`}>
                  <Icon size={18} />{label}
                </button>
              ))}
            </div>
          </div>

          {/* Proof upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              New Proof of Payment * <span className="text-xs font-normal text-gray-400">(screenshot or PDF)</span>
            </label>
            {!proofFile ? (
              <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-xl p-6 cursor-pointer hover:border-orange-400 hover:bg-orange-50 transition-all">
                <Upload size={24} className="text-gray-400" />
                <span className="text-sm text-gray-500">Click to upload new transaction screenshot</span>
                <span className="text-xs text-gray-400">JPG, PNG, PDF accepted</span>
                <input type="file" accept="image/*,application/pdf" className="hidden" onChange={handleFileChange} />
              </label>
            ) : (
              <div className="border border-orange-200 rounded-xl overflow-hidden">
                {proofPreview
                  ? <img src={proofPreview} alt="proof" className="w-full max-h-40 object-contain bg-gray-50" />
                  : <div className="flex items-center gap-2 p-3 bg-orange-50">
                      <FileText size={16} className="text-orange-600" />
                      <span className="text-sm text-orange-800 truncate">{proofFile.name}</span>
                    </div>
                }
                <div className="flex items-center justify-between px-3 py-2 bg-white border-t border-orange-100">
                  <span className="text-xs text-gray-500 truncate">{proofFile.name}</span>
                  <button onClick={() => { setProofFile(null); setProofPreview(null) }}
                    className="text-red-400 hover:text-red-600 ml-2"><X size={14} /></button>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
            <button onClick={handleSubmit} disabled={submitting}
              className="flex-1 flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 rounded-xl transition-colors disabled:opacity-60">
              {submitting ? <Spinner size="sm" /> : <RefreshCw size={15} />}
              {submitting ? 'Submitting...' : 'Resubmit'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function MySponsorships() {
  const navigate = useNavigate()
  const [list, setList] = useState<Sponsorship[]>([])
  const [loading, setLoading] = useState(true)
  const [resubmitting, setResubmitting] = useState<Sponsorship | null>(null)

  useEffect(() => {
    mySponsorships()
      .then(r => {
        const d = r.data
        const list: Sponsorship[] = Array.isArray(d) ? d : d.results
        list.sort((a, b) => new Date(b.created_at ?? b.start_date ?? 0).getTime() - new Date(a.created_at ?? a.start_date ?? 0).getTime())
        setList(list)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleResubmitSuccess = (updated: Sponsorship) => {
    setList(prev => prev.map(s => s.id === updated.id ? updated : s))
  }

  const verified = list.filter(s => s.verification_status === 'VERIFIED').length
  const pending  = list.filter(s => s.verification_status === 'PENDING').length
  const rejected = list.filter(s => s.verification_status === 'REJECTED').length

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Sponsorships</h1>
        <p className="text-gray-500 text-sm">
          {verified} active · {pending} pending review · {rejected} rejected
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : list.length === 0 ? (
        <div className="card text-center py-16">
          <Heart size={48} className="text-gray-200 mx-auto mb-4" />
          <p className="text-gray-500">You haven't sponsored any children yet.</p>
          <button onClick={() => navigate('/browse')} className="btn-primary mt-4">Browse Children</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {list.map(s => {
            const vcfg = VERIFICATION_CONFIG[s.verification_status] ?? VERIFICATION_CONFIG.PENDING
            const VIcon = vcfg.icon
            const isRejected = s.verification_status === 'REJECTED'

            return (
              <div key={s.id} className={`card hover:shadow-md transition-shadow ${isRejected ? 'border-red-200' : ''}`}>
                {/* Child info */}
                <div className="flex items-center gap-3 mb-4">
                  {s.child_photo ? (
                    <img src={mediaUrl(s.child_photo)!} alt={s.child_name} className="w-12 h-12 rounded-full object-cover" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                      <User size={20} className="text-green-600" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 truncate">{s.child_name}</p>
                    <p className="text-xs text-gray-400">Since {new Date(s.start_date).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Amount & provider */}
                <div className="space-y-2 text-sm mb-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Monthly commitment</span>
                    <span className="font-bold text-green-700">ETB {s.commitment_amount}</span>
                  </div>
                  {s.payment_provider && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Payment via</span>
                      <span className="text-gray-700 font-medium">{PROVIDER_LABELS[s.payment_provider] || s.payment_provider}</span>
                    </div>
                  )}
                </div>

                {/* Status badge */}
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold w-fit ${vcfg.color}`}>
                  <VIcon size={12} /> {vcfg.label}
                </div>

                {/* Rejection reason */}
                {isRejected && s.verification_notes && (
                  <p className="mt-2 text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2 leading-relaxed">
                    <span className="font-semibold">Reason: </span>{s.verification_notes}
                  </p>
                )}

                {/* Payment proof link */}
                {s.payment_proof && (
                  <a href={s.payment_proof} target="_blank" rel="noopener noreferrer"
                    className="mt-3 flex items-center gap-2 text-xs text-green-600 hover:underline">
                    <FileText size={12} /> View payment proof <ExternalLink size={11} />
                  </a>
                )}

                <div className="mt-4 flex gap-2">
                  <button onClick={() => navigate(`/children/${s.child}`)}
                    className="btn-secondary flex-1 text-sm py-2">
                    View Profile
                  </button>
                  {/* Resubmit button — only on rejected */}
                  {isRejected && (
                    <button
                      onClick={() => setResubmitting(s)}
                      className="flex items-center gap-1.5 px-3 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-xl transition-colors"
                    >
                      <RefreshCw size={13} /> Resubmit
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {resubmitting && (
        <ResubmitModal
          sponsorship={resubmitting}
          onClose={() => setResubmitting(null)}
          onSuccess={handleResubmitSuccess}
        />
      )}
    </Layout>
  )
}
