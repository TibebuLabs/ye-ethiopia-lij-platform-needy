import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import Spinner from '../components/Spinner'
import { pendingSponsorships, verifySponsorship } from '../api/children'
import { mediaUrl } from '../api/axios'
import toast from 'react-hot-toast'
import {
  Heart, User, CheckCircle, XCircle, FileText,
  ExternalLink, Clock, Download, ChevronDown,
} from 'lucide-react'
import { downloadFile } from '../utils/download'
import type { Sponsorship, VerificationStatus } from '../types'

const PROVIDER_LABELS: Record<string, string> = {
  TELEBIRR: 'Telebirr',
  CBE: 'Commercial Bank of Ethiopia',
  BANK: 'Bank Transfer',
}

const STATUS_TABS: { value: '' | VerificationStatus; label: string; color: string }[] = [
  { value: '',         label: 'All',      color: 'bg-gray-100 text-gray-700' },
  { value: 'PENDING',  label: 'Pending',  color: 'bg-amber-100 text-amber-700' },
  { value: 'VERIFIED', label: 'Verified', color: 'bg-green-100 text-green-700' },
  { value: 'REJECTED', label: 'Rejected', color: 'bg-red-100 text-red-700' },
]

const STATUS_BADGE: Record<VerificationStatus, { label: string; color: string; icon: typeof Clock }> = {
  PENDING:  { label: 'Pending',  color: 'bg-amber-100 text-amber-700',  icon: Clock },
  VERIFIED: { label: 'Verified', color: 'bg-green-100 text-green-700',  icon: CheckCircle },
  REJECTED: { label: 'Rejected', color: 'bg-red-100 text-red-700',      icon: XCircle },
}

export default function SponsorshipVerification() {
  const [list, setList] = useState<Sponsorship[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState<string | null>(null)
  const [notes, setNotes] = useState<Record<string, string>>({})
  const [expanded, setExpanded] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'' | VerificationStatus>('')

  const fetchAll = () => {
    setLoading(true)
    pendingSponsorships()  // always fetch all
      .then(r => {
        const d = r.data
        const list: Sponsorship[] = Array.isArray(d) ? d : d.results
        list.sort((a, b) => new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime())
        setList(list)
      })
      .catch(() => toast.error('Failed to load sponsorships'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchAll() }, [])

  const handle = async (id: string, action: 'verify' | 'reject') => {
    if (action === 'reject' && !notes[id]?.trim()) {
      toast.error('Please enter rejection notes before rejecting')
      return
    }
    setProcessing(id)
    try {
      const res = await verifySponsorship(id, action, notes[id] || '')
      toast.success(res.data.message)
      // Update in-place — don't remove, just update the status
      setList(prev => prev.map(s => s.id === id ? res.data.data : s))
      setExpanded(null)
    } catch {
      toast.error('Failed to process verification')
    } finally {
      setProcessing(null)
    }
  }

  const getStatus = (s: Sponsorship): VerificationStatus =>
    s.verification_status ?? 'PENDING'

  const counts = {
    '':         list.length,
    PENDING:    list.filter(s => getStatus(s) === 'PENDING').length,
    VERIFIED:   list.filter(s => getStatus(s) === 'VERIFIED').length,
    REJECTED:   list.filter(s => getStatus(s) === 'REJECTED').length,
  }

  // Client-side filter based on active tab
  const displayed = activeTab ? list.filter(s => getStatus(s) === activeTab) : list

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Sponsorship Verification</h1>
        <p className="text-gray-500 text-sm">{list.length} total sponsorship requests</p>
      </div>

      {/* Filter tabs */}
      <div className="card mb-5 flex flex-wrap gap-2">
        {STATUS_TABS.map(tab => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all border-2 ${
              activeTab === tab.value
                ? `${tab.color} border-current`
                : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
            }`}
          >
            {tab.label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
              activeTab === tab.value ? 'bg-white/60' : 'bg-gray-100'
            }`}>
              {counts[tab.value]}
            </span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : displayed.length === 0 ? (
        <div className="card text-center py-16">
          <Heart size={48} className="text-gray-200 mx-auto mb-4" />
          <p className="text-gray-500">No sponsorships found for this filter.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {displayed.map(s => {
            const vs = getStatus(s)
            const badge = STATUS_BADGE[vs] ?? STATUS_BADGE.PENDING
            const BadgeIcon = badge.icon
            const isPending = vs === 'PENDING'

            return (
              <div key={s.id} className={`card border-l-4 ${
                vs === 'VERIFIED' ? 'border-l-green-400' :
                vs === 'REJECTED' ? 'border-l-red-400' :
                'border-l-amber-400'
              }`}>
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  {/* Child */}
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {s.child_photo ? (
                      <img src={mediaUrl(s.child_photo)!} alt={s.child_name}
                        className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <User size={20} className="text-green-600" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-800">{s.child_name}</p>
                      <p className="text-xs text-gray-400">Child</p>
                    </div>
                  </div>

                  {/* Sponsor */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-700 truncate">{s.sponsor_name}</p>
                    <p className="text-xs text-gray-400">Sponsor</p>
                  </div>

                  {/* Amount */}
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-green-700 text-lg">ETB {s.commitment_amount}</p>
                    <p className="text-xs text-gray-400">/month</p>
                  </div>

                  {/* Status badge */}
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold flex-shrink-0 ${badge.color}`}>
                    <BadgeIcon size={12} /> {badge.label}
                  </div>

                  {/* Expand toggle */}
                  <button
                    onClick={() => setExpanded(prev => prev === s.id ? null : s.id)}
                    className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 flex-shrink-0"
                  >
                    <ChevronDown size={16} className={`transition-transform ${expanded === s.id ? 'rotate-180' : ''}`} />
                  </button>
                </div>

                {/* Expanded details */}
                {expanded === s.id && (
                  <div className="mt-4 pt-4 border-t border-gray-100 space-y-4">
                    {/* Payment info */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-xs text-gray-400 mb-0.5">Payment Provider</p>
                        <p className="font-medium text-gray-700">
                          {s.payment_provider ? PROVIDER_LABELS[s.payment_provider] || s.payment_provider : '—'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-0.5">Submitted</p>
                        <p className="font-medium text-gray-700">{new Date(s.created_at).toLocaleString()}</p>
                      </div>
                      {s.verified_at && (
                        <div>
                          <p className="text-xs text-gray-400 mb-0.5">
                            {vs === 'VERIFIED' ? 'Verified' : 'Rejected'} at
                          </p>
                          <p className="font-medium text-gray-700">{new Date(s.verified_at).toLocaleString()}</p>
                        </div>
                      )}
                      {s.verified_by_name && (
                        <div>
                          <p className="text-xs text-gray-400 mb-0.5">Reviewed by</p>
                          <p className="font-medium text-gray-700">{s.verified_by_name}</p>
                        </div>
                      )}
                    </div>

                    {/* Existing notes (for verified/rejected) */}
                    {s.verification_notes && (
                      <div className={`rounded-xl px-3 py-2 text-sm ${
                        vs === 'REJECTED' ? 'bg-red-50 text-red-700' : 
                        s.verification_notes.startsWith('[PM Review') ? 'bg-yellow-50 text-yellow-800 border border-yellow-200' :
                        'bg-green-50 text-green-700'
                      }`}>
                        {s.verification_notes.startsWith('[PM Review') ? (
                          <>
                            <p className="font-semibold text-xs mb-1">
                              PM Review — {s.verification_notes.includes('VALID]') && !s.verification_notes.includes('INVALID]') ? '✅ VALID' : '❌ INVALID'}
                            </p>
                            <p>{s.verification_notes.replace(/^\[PM Review — (VALID|INVALID)\] /, '')}</p>
                          </>
                        ) : (
                          <><span className="font-semibold">Notes: </span>{s.verification_notes}</>
                        )}
                      </div>
                    )}

                    {/* Payment proof */}
                    {s.payment_proof ? (
                      <div>
                        <p className="text-xs text-gray-400 mb-2">Payment Proof</p>
                        <div className="border border-green-100 rounded-xl overflow-hidden">
                          {/\.(jpg|jpeg|png|gif|webp)$/i.test(s.payment_proof) ? (
                            <img src={s.payment_proof} alt="payment proof"
                              className="w-full max-h-64 object-contain bg-gray-50" />
                          ) : (
                            <div className="flex items-center gap-2 p-3 bg-green-50">
                              <FileText size={16} className="text-green-600" />
                              <span className="text-sm text-green-800">PDF Document</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2 px-3 py-2 bg-white border-t border-green-100">
                            <a href={s.payment_proof} target="_blank" rel="noopener noreferrer"
                              className="flex items-center gap-1 text-xs text-green-600 hover:underline">
                              <ExternalLink size={12} /> Open
                            </a>
                            <button
                              onClick={() => downloadFile(s.payment_proof!).catch(() => {})}
                              className="flex items-center gap-1 text-xs text-green-600 hover:underline ml-3"
                            >
                              <Download size={12} /> Download
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-dashed border-gray-200 text-gray-400 text-sm">
                        <FileText size={14} /> No payment proof uploaded
                      </div>
                    )}

                    {/* Action buttons — only for PENDING */}
                    {isPending && (
                      <>
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">
                            Notes <span className="text-red-400">(required for rejection)</span>
                          </label>
                          <textarea
                            rows={2}
                            placeholder="Add verification notes or rejection reason..."
                            value={notes[s.id] || ''}
                            onChange={e => setNotes(prev => ({ ...prev, [s.id]: e.target.value }))}
                            className="input-field text-sm resize-none"
                          />
                        </div>
                        <div className="flex gap-3">
                          <button
                            onClick={() => handle(s.id, 'verify')}
                            disabled={processing === s.id}
                            className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 rounded-xl transition-colors disabled:opacity-60"
                          >
                            {processing === s.id ? <Spinner size="sm" /> : <CheckCircle size={15} />}
                            Verify & Activate
                          </button>
                          <button
                            onClick={() => handle(s.id, 'reject')}
                            disabled={processing === s.id}
                            className="flex-1 flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 font-semibold py-2.5 rounded-xl transition-colors disabled:opacity-60 border border-red-200"
                          >
                            <XCircle size={15} /> Reject
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </Layout>
  )
}
