import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import Spinner from '../components/Spinner'
import { useAuth } from '../context/AuthContext'
import {
  listFinancialDocs, approveFinancialDoc, rejectFinancialDoc, pmReviewFinancialDoc,
} from '../api/extended'
import type { FinancialDocument } from '../api/extended'
import { pendingSponsorships, pmReviewSponsorship, verifySponsorship } from '../api/children'
import { mediaUrl } from '../api/axios'
import toast from 'react-hot-toast'
import type { Sponsorship } from '../types'
import {
  FileText, CheckCircle, XCircle, ExternalLink, Filter,
  AlertTriangle, MessageSquare, ThumbsUp, ThumbsDown,
  Heart, Download, ChevronDown, CreditCard,
} from 'lucide-react'
import { downloadFile } from '../utils/download'
import DocLink from '../components/DocLink'

const STATUS_COLORS: Record<string, string> = {
  PENDING:  'bg-yellow-100 text-yellow-700',
  APPROVED: 'bg-green-100 text-green-700',
  REJECTED: 'bg-red-100 text-red-700',
  ARCHIVED: 'bg-gray-100 text-gray-600',
  VERIFIED: 'bg-green-100 text-green-700',
}

const DOC_TYPE_LABELS: Record<string, string> = {
  SPONSORSHIP_AGREEMENT: 'Sponsorship Agreement',
  PAYMENT_RECEIPT:       'Payment Receipt',
  BANK_STATEMENT:        'Bank Statement',
  INVOICE:               'Invoice',
  REPORT:                'Financial Report',
}

const PROVIDER_LABELS: Record<string, string> = {
  TELEBIRR: 'Telebirr',
  CBE:      'Commercial Bank of Ethiopia',
  BANK:     'Bank Transfer',
}

// ── PM review modal (mark VALID / INVALID + notes) ────────────────────────────
interface PMModal { id: string; label: string; decision: 'VALID' | 'INVALID'; type: 'sponsorship' | 'document' }

function PMReviewModal({
  modal, onConfirm, onCancel,
}: { modal: PMModal; onConfirm: (notes: string) => void; onCancel: () => void }) {
  const [notes, setNotes] = useState('')
  const isValid = modal.decision === 'VALID'

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isValid ? 'bg-green-100' : 'bg-red-100'}`}>
              {isValid ? <ThumbsUp size={20} className="text-green-600" /> : <ThumbsDown size={20} className="text-red-600" />}
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Mark as {isValid ? 'Valid' : 'Invalid'} & Forward to Admin
              </h3>
              <p className="text-xs text-gray-500">{modal.label}</p>
            </div>
          </div>

          <div className={`rounded-xl p-3 mb-4 text-sm flex items-start gap-2 ${isValid ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'}`}>
            <MessageSquare size={14} className="mt-0.5 flex-shrink-0" />
            <p>
              Your review notes will be sent as a <strong>notification to Admin</strong> for final approval or rejection.
              You are reviewing — not making the final decision.
            </p>
          </div>

          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Review Notes <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={isValid
                ? 'e.g. Payment proof verified. Amount matches commitment. Document appears authentic.'
                : 'e.g. Payment proof is blurry. Amount does not match the commitment amount.'}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none"
            />
          </div>
          <div className="flex gap-3">
            <button onClick={onCancel}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl">
              Cancel
            </button>
            <button
              onClick={() => onConfirm(notes)}
              disabled={!notes.trim()}
              className="flex-1 px-4 py-2.5 text-sm font-semibold rounded-xl disabled:opacity-50 bg-yellow-500 hover:bg-yellow-600 text-white flex items-center justify-center gap-2"
            >
              <MessageSquare size={14} /> Forward to Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Admin confirm modal (approve / reject financial doc) ──────────────────────
interface AdminModal { doc: FinancialDocument; action: 'approve' | 'reject' }

function AdminReviewModal({
  modal, onConfirm, onCancel,
}: { modal: AdminModal; onConfirm: (notes: string) => void; onCancel: () => void }) {
  const [notes, setNotes] = useState('')
  const isReject = modal.action === 'reject'
  const pmNote = modal.doc.review_notes?.startsWith('[PM Review') ? modal.doc.review_notes : ''

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isReject ? 'bg-red-100' : 'bg-green-100'}`}>
              <AlertTriangle size={20} className={isReject ? 'text-red-600' : 'text-green-600'} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">{isReject ? 'Reject Document' : 'Approve Document'}</h3>
              <p className="text-xs text-gray-500">{DOC_TYPE_LABELS[modal.doc.document_type] ?? modal.doc.document_type}</p>
            </div>
          </div>
          <div className="bg-gray-50 rounded-xl p-3 mb-4 space-y-1">
            <p className="text-sm text-gray-600">Child: <span className="font-medium text-gray-800">{modal.doc.child_name}</span></p>
            {modal.doc.amount && <p className="text-sm text-gray-600">Amount: <span className="font-medium">{modal.doc.amount} ETB</span></p>}
            {modal.doc.document_file && (
              <a href={modal.doc.document_file} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm text-green-600 font-medium">
                <ExternalLink size={13} /> View Document
              </a>
            )}
          </div>
          {pmNote && (
            <div className={`rounded-xl p-3 mb-4 text-sm ${pmNote.includes('VALID]') && !pmNote.includes('INVALID]') ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'}`}>
              <p className="font-semibold text-xs mb-1">PM Review Note</p>
              <p>{pmNote.replace(/^\[PM Review — (VALID|INVALID)\] /, '')}</p>
            </div>
          )}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              {isReject ? 'Rejection reason' : 'Notes (optional)'}
              {isReject && <span className="text-red-500 ml-1">*</span>}
            </label>
            <textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)}
              placeholder={isReject ? 'Explain why...' : 'Optional notes...'}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 resize-none" />
          </div>
          <div className="flex gap-3">
            <button onClick={onCancel} className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl">Cancel</button>
            <button onClick={() => onConfirm(notes)} disabled={isReject && !notes.trim()}
              className={`flex-1 px-4 py-2.5 text-sm font-semibold rounded-xl disabled:opacity-50 ${isReject ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-green-600 hover:bg-green-700 text-white'}`}>
              {isReject ? 'Reject & Notify' : 'Approve & Notify'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Sponsorship payment card (PM view) ────────────────────────────────────────
function SponsorshipCard({
  s,
  onReview,
  onVerify,
  processing,
  isAdmin,
}: {
  s: Sponsorship
  onReview: (id: string, label: string, decision: 'VALID' | 'INVALID') => void
  onVerify?: (id: string, action: 'verify' | 'reject') => void
  processing: string | null
  isAdmin?: boolean
}) {
  const [expanded, setExpanded] = useState(false)
  const pmNote = s.verification_notes?.startsWith('[PM Review') ? s.verification_notes : null
  const pmDecision = pmNote?.match(/^\[PM Review — (VALID|INVALID)\]/)?.[1] as 'VALID' | 'INVALID' | undefined
  const pmNoteText = pmNote?.replace(/^\[PM Review — (VALID|INVALID)\] /, '') ?? ''
  const label = `${s.sponsor_name} → ${s.child_name}`

  return (
    <div className={`card border-l-4 ${s.verification_status === 'VERIFIED' ? 'border-l-green-400' : s.verification_status === 'REJECTED' ? 'border-l-red-400' : 'border-l-amber-400'}`}>
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-gray-800">{s.child_name}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[s.verification_status ?? 'PENDING']}`}>
              {s.verification_status ?? 'PENDING'}
            </span>
            {pmDecision && (
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${pmDecision === 'VALID' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                PM: {pmDecision}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-0.5">
            Sponsor: <span className="font-medium text-gray-700">{s.sponsor_name}</span>
            {' · '}ETB <span className="font-medium text-gray-700">{s.commitment_amount}</span>/month
            {s.payment_provider && ` · ${PROVIDER_LABELS[s.payment_provider] ?? s.payment_provider}`}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">Submitted {new Date(s.created_at).toLocaleDateString()}</p>
        </div>
        <button onClick={() => setExpanded(p => !p)}
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 flex-shrink-0 self-start sm:self-center">
          <ChevronDown size={16} className={`transition-transform ${expanded ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-gray-100 space-y-4">
          {/* Payment proof */}
          {s.payment_proof ? (
            <div>
              <p className="text-xs text-gray-400 mb-2 font-medium">Payment Proof</p>
              <div className="border border-green-100 rounded-xl overflow-hidden">
                {/\.(jpg|jpeg|png|gif|webp)$/i.test(s.payment_proof) ? (
                  <img src={mediaUrl(s.payment_proof) ?? s.payment_proof} alt="payment proof"
                    className="w-full max-h-64 object-contain bg-gray-50" />
                ) : (
                  <div className="flex items-center gap-2 p-3 bg-green-50">
                    <FileText size={16} className="text-green-600" />
                    <span className="text-sm text-green-800">Document file</span>
                  </div>
                )}
                <div className="flex items-center gap-3 px-3 py-2 bg-white border-t border-green-100">
                  <a href={s.payment_proof} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-green-600 hover:underline">
                    <ExternalLink size={12} /> Open
                  </a>
                  <button
                    onClick={() => downloadFile(s.payment_proof!).catch(() => {})}
                    className="flex items-center gap-1 text-xs text-green-600 hover:underline"
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

          {/* PM review note (already submitted) */}
          {pmDecision && (
            <div className="rounded-xl px-3 py-2 text-sm bg-yellow-50 border border-yellow-200 flex items-start gap-2">
              <MessageSquare size={14} className="text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold text-yellow-700 mb-0.5">Your Review — {pmDecision}</p>
                <p className="text-gray-600">{pmNoteText}</p>
              </div>
            </div>
          )}

          {/* PM actions — only for PENDING and not yet reviewed */}
          {(s.verification_status === 'PENDING' || s.verification_status == null) && (
            <div className="flex gap-3 flex-wrap">
              {isAdmin ? (
                <>
                  {pmDecision && (
                    <div className={`flex-1 rounded-xl px-3 py-2 text-sm flex items-start gap-2 ${pmDecision === 'VALID' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                      <MessageSquare size={14} className={`mt-0.5 flex-shrink-0 ${pmDecision === 'VALID' ? 'text-green-600' : 'text-red-600'}`} />
                      <div>
                        <p className={`text-xs font-semibold mb-0.5 ${pmDecision === 'VALID' ? 'text-green-700' : 'text-red-700'}`}>PM Review — {pmDecision}</p>
                        <p className="text-gray-600 text-xs">{pmNoteText}</p>
                      </div>
                    </div>
                  )}
                  <button
                    onClick={() => onVerify?.(s.id, 'verify')}
                    disabled={processing === s.id}
                    className="flex items-center gap-1.5 text-sm px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold"
                  >
                    {processing === s.id ? <Spinner size="sm" /> : <CheckCircle size={15} />}
                    Verify & Activate
                  </button>
                  <button
                    onClick={() => onVerify?.(s.id, 'reject')}
                    disabled={processing === s.id}
                    className="flex items-center gap-1.5 text-sm px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg font-semibold border border-red-200"
                  >
                    {processing === s.id ? <Spinner size="sm" /> : <XCircle size={15} />}
                    Reject
                  </button>
                </>
              ) : (
                pmDecision ? (
                  <p className="text-xs text-gray-400 italic">
                    You already submitted a review. Admin will make the final decision.
                  </p>
                ) : (
                  <>
                    <button
                      onClick={() => onReview(s.id, label, 'VALID')}
                      disabled={processing === s.id}
                      className="flex items-center gap-1.5 text-sm px-4 py-2 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg font-medium"
                    >
                      {processing === s.id ? <Spinner size="sm" /> : <ThumbsUp size={15} />}
                      Mark Valid
                    </button>
                    <button
                      onClick={() => onReview(s.id, label, 'INVALID')}
                      disabled={processing === s.id}
                      className="flex items-center gap-1.5 text-sm px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg font-medium"
                    >
                      {processing === s.id ? <Spinner size="sm" /> : <ThumbsDown size={15} />}
                      Mark Invalid
                    </button>
                  </>
                )
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function FinancialDocuments() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'ADMIN'
  const isPM    = user?.role === 'PROJECT_MANAGER'

  const [tab, setTab] = useState<'sponsorships' | 'documents'>('sponsorships')

  const [sponsorships, setSponsorships]   = useState<Sponsorship[]>([])
  const [spLoading, setSpLoading]         = useState(false)
  const [spFilter, setSpFilter]           = useState<'PENDING' | 'VERIFIED' | 'REJECTED' | 'all'>('PENDING')
  const [pmModal, setPmModal]             = useState<PMModal | null>(null)
  const [processing, setProcessing]       = useState<string | null>(null)

  const [docs, setDocs]                   = useState<FinancialDocument[]>([])
  const [docsLoading, setDocsLoading]     = useState(false)
  const [docFilter, setDocFilter]         = useState<'PENDING' | 'APPROVED' | 'REJECTED' | 'all'>('PENDING')
  const [adminModal, setAdminModal]       = useState<AdminModal | null>(null)
  const [docProcessing, setDocProcessing] = useState<string | null>(null)

  // Fetch sponsorships (PM + Admin)
  const fetchSponsorships = () => {
    setSpLoading(true)
    const params: Record<string, string> = spFilter !== 'all' ? { status: spFilter } : {}
    pendingSponsorships(spFilter !== 'all' ? spFilter : undefined)
      .then(r => {
        const d = r.data
        const list: Sponsorship[] = Array.isArray(d) ? d : d.results
        list.sort((a, b) => new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime())
        setSponsorships(list)
      })
      .catch(() => toast.error('Failed to load sponsorships'))
      .finally(() => setSpLoading(false))
  }

  // Fetch financial docs
  const fetchDocs = () => {
    setDocsLoading(true)
    const params: Record<string, string> = docFilter !== 'all' ? { status: docFilter } : {}
    listFinancialDocs(params)
      .then(r => {
        const d = r.data
        const list: FinancialDocument[] = Array.isArray(d) ? d : (d as { results: FinancialDocument[] }).results
        list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        setDocs(list)
      })
      .catch(() => toast.error('Failed to load financial documents'))
      .finally(() => setDocsLoading(false))
  }

  useEffect(() => { if (tab === 'sponsorships') fetchSponsorships() }, [tab, spFilter])
  useEffect(() => { if (tab === 'documents') fetchDocs() }, [tab, docFilter])

  useEffect(() => {
    setTab('sponsorships')
  }, [isPM, isAdmin])

  // PM: review sponsorship payment OR financial doc
  const handlePMSponsorshipConfirm = async (notes: string) => {
    if (!pmModal) return
    const { id, decision, type } = pmModal
    setPmModal(null)
    setProcessing(id)
    try {
      if (type === 'sponsorship') {
        await pmReviewSponsorship(id, decision, notes)
      } else {
        await pmReviewFinancialDoc(id, decision, notes)
      }
      toast.success(`Marked as ${decision} — Admin has been notified`)
      if (type === 'sponsorship') fetchSponsorships()
      else fetchDocs()
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: { message?: string } } } })
        ?.response?.data?.error?.message ?? 'Failed to submit review'
      toast.error(msg)
    } finally {
      setProcessing(null)
    }
  }

  // Admin: approve/reject financial doc
  const handleAdminDocConfirm = async (notes: string) => {
    if (!adminModal) return
    const { doc, action } = adminModal
    setAdminModal(null)
    setDocProcessing(doc.id)
    try {
      if (action === 'approve') {
        await approveFinancialDoc(doc.id, notes)
        toast.success('Document approved — sponsor notified')
      } else {
        await rejectFinancialDoc(doc.id, notes)
        toast.success('Document rejected — sponsor notified')
      }
      fetchDocs()
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: { message?: string } } } })
        ?.response?.data?.error?.message ?? 'Action failed'
      toast.error(msg)
    } finally {
      setDocProcessing(null)
    }
  }

  // Parse PM review note
  const parsePMNote = (doc: FinancialDocument) => {
    if (!doc.review_notes?.startsWith('[PM Review')) return null
    const match = doc.review_notes.match(/^\[PM Review — (VALID|INVALID)\] (.+)$/)
    if (!match) return null
    return { decision: match[1] as 'VALID' | 'INVALID', note: match[2] }
  }

  const handleAdminVerify = async (id: string, action: 'verify' | 'reject') => {
    const notes = action === 'reject' ? prompt('Rejection reason (required):') : ''
    if (action === 'reject' && !notes?.trim()) return
    setProcessing(id)
    try {
      await verifySponsorship(id, action, notes ?? '')
      toast.success(action === 'verify' ? 'Sponsorship verified and activated' : 'Sponsorship rejected')
      fetchSponsorships()
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: { message?: string } } } })
        ?.response?.data?.error?.message ?? 'Action failed'
      toast.error(msg)
    } finally {
      setProcessing(null)
    }
  }

  return (
    <Layout>
      {pmModal && (
        <PMReviewModal modal={pmModal} onConfirm={handlePMSponsorshipConfirm} onCancel={() => setPmModal(null)} />
      )}
      {adminModal && (
        <AdminReviewModal modal={adminModal} onConfirm={handleAdminDocConfirm} onCancel={() => setAdminModal(null)} />
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Financial Documents</h1>
          <p className="text-gray-500 text-sm">
            {isPM
              ? 'Review payment proofs and financial documents, then forward your decision to Admin for final approval'
              : 'Review and verify sponsorship payment proofs and financial documents'}
          </p>
        </div>
      </div>

      {(isPM || isAdmin) && (
        <div className="flex gap-2 mb-5">
          <button
            onClick={() => setTab('sponsorships')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${
              tab === 'sponsorships'
                ? 'bg-green-50 text-green-700 border-green-300'
                : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
            }`}
          >
            <Heart size={14} /> Payment Verification
          </button>
          <button
            onClick={() => setTab('documents')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${
              tab === 'documents'
                ? 'bg-green-50 text-green-700 border-green-300'
                : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
            }`}
          >
            <CreditCard size={14} /> Financial Documents
          </button>
        </div>
      )}

      {isPM && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 mb-5 flex items-start gap-3">
          <MessageSquare size={16} className="text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-yellow-800">PM Review Workflow</p>
            <p className="text-xs text-yellow-700 mt-0.5">
              Review each payment proof or financial document, then click <strong>Mark Valid</strong> or <strong>Mark Invalid</strong>.
              Your notes will be sent as a notification to Admin who makes the final decision.
            </p>
          </div>
        </div>
      )}

      {/* ── Sponsorship Payments tab (PM) ── */}
      {tab === 'sponsorships' && (
        <>
          <div className="card mb-5 flex items-center gap-3">
            <Filter size={15} className="text-gray-400" />
            <select className="input-field w-40 py-2 text-sm" value={spFilter}
              onChange={e => setSpFilter(e.target.value as typeof spFilter)}>
              <option value="PENDING">Pending</option>
              <option value="VERIFIED">Verified</option>
              <option value="REJECTED">Rejected</option>
              <option value="all">All</option>
            </select>
          </div>

          {spLoading ? (
            <div className="flex justify-center py-20"><Spinner size="lg" /></div>
          ) : sponsorships.length === 0 ? (
            <div className="card text-center py-16">
              <Heart size={48} className="text-gray-200 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">No sponsorships found</p>
              <p className="text-gray-400 text-sm mt-1">No sponsorship payments match the selected filter.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sponsorships.map(s => (
                <SponsorshipCard
                  key={s.id}
                  s={s}
                  onReview={(id, label, decision) => setPmModal({ id, label, decision, type: 'sponsorship' })}
                  onVerify={isAdmin ? handleAdminVerify : undefined}
                  processing={processing}
                  isAdmin={isAdmin}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* ── Financial Documents tab (Admin always, PM secondary) ── */}
      {tab === 'documents' && (
        <>
          <div className="card mb-5 flex items-center gap-3">
            <Filter size={15} className="text-gray-400" />
            <select className="input-field w-40 py-2 text-sm" value={docFilter}
              onChange={e => setDocFilter(e.target.value as typeof docFilter)}>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
              <option value="all">All</option>
            </select>
          </div>

          {docsLoading ? (
            <div className="flex justify-center py-20"><Spinner size="lg" /></div>
          ) : docs.length === 0 ? (
            <div className="card text-center py-16">
              <FileText size={48} className="text-gray-200 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">No financial documents</p>
              <p className="text-gray-400 text-sm mt-1">No documents match the selected filter.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {docs.map(doc => {
                const pmNote = parsePMNote(doc)
                return (
                  <div key={doc.id} className="card hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-gray-800">
                            {DOC_TYPE_LABELS[doc.document_type] ?? doc.document_type}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[doc.status] ?? 'bg-gray-100 text-gray-600'}`}>
                            {doc.status}
                          </span>
                          {pmNote && (
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${pmNote.decision === 'VALID' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                              PM: {pmNote.decision}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">Child: <span className="text-gray-700 font-medium">{doc.child_name}</span></p>
                        {doc.amount && <p className="text-sm text-gray-500">Amount: <span className="text-gray-700 font-medium">{doc.amount} ETB</span></p>}
                        {doc.description && <p className="text-sm text-gray-500">{doc.description}</p>}
                        <p className="text-xs text-gray-400">
                          Submitted {new Date(doc.created_at).toLocaleDateString()}
                          {doc.document_date && ` · Doc date: ${new Date(doc.document_date).toLocaleDateString()}`}
                        </p>

                        {/* Admin sees PM review note as banner */}
                        {isAdmin && pmNote && (
                          <div className={`mt-2 rounded-xl px-3 py-2 text-sm flex items-start gap-2 ${pmNote.decision === 'VALID' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                            <MessageSquare size={14} className={`mt-0.5 flex-shrink-0 ${pmNote.decision === 'VALID' ? 'text-green-600' : 'text-red-600'}`} />
                            <div>
                              <p className={`text-xs font-semibold mb-0.5 ${pmNote.decision === 'VALID' ? 'text-green-700' : 'text-red-700'}`}>
                                PM Review — {pmNote.decision}
                              </p>
                              <p className="text-gray-600">{pmNote.note}</p>
                            </div>
                          </div>
                        )}

                        {/* PM sees their own submitted note */}
                        {isPM && pmNote && (
                          <div className="mt-2 rounded-xl px-3 py-2 text-sm bg-yellow-50 border border-yellow-200 flex items-start gap-2">
                            <MessageSquare size={14} className="text-yellow-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-xs font-semibold text-yellow-700 mb-0.5">Your Review — {pmNote.decision}</p>
                              <p className="text-gray-600">{pmNote.note}</p>
                            </div>
                          </div>
                        )}

                        {!pmNote && doc.review_notes && (
                          <p className="text-xs text-gray-500 italic mt-1">Review note: {doc.review_notes}</p>
                        )}
                      </div>

                      {doc.document_file && (
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <a href={doc.document_file} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-sm text-green-600 hover:text-green-700 font-medium">
                            <ExternalLink size={14} /> View
                          </a>
                          <button
                            onClick={() => downloadFile(doc.document_file!).catch(() => {})}
                            className="flex items-center gap-1.5 text-sm text-green-600 hover:text-green-700 font-medium"
                          >
                            <Download size={14} /> Download
                          </button>
                        </div>
                      )}
                    </div>

                    {/* PM: mark valid/invalid on financial docs */}
                    {isPM && doc.status === 'PENDING' && (
                      <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100">
                        {pmNote ? (
                          <p className="text-xs text-gray-400 italic">Already reviewed. Admin will decide.</p>
                        ) : (
                          <>
                            <button onClick={() => setPmModal({ id: doc.id, label: DOC_TYPE_LABELS[doc.document_type] ?? doc.document_type, decision: 'VALID', type: 'document' })}
                              disabled={docProcessing === doc.id}
                              className="flex items-center gap-1.5 text-sm px-4 py-2 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg font-medium">
                              {docProcessing === doc.id ? <Spinner size="sm" /> : <ThumbsUp size={15} />} Mark Valid
                            </button>
                            <button onClick={() => setPmModal({ id: doc.id, label: DOC_TYPE_LABELS[doc.document_type] ?? doc.document_type, decision: 'INVALID', type: 'document' })}
                              disabled={docProcessing === doc.id}
                              className="flex items-center gap-1.5 text-sm px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg font-medium">
                              {docProcessing === doc.id ? <Spinner size="sm" /> : <ThumbsDown size={15} />} Mark Invalid
                            </button>
                          </>
                        )}
                      </div>
                    )}

                    {/* Admin: final approve/reject */}
                    {isAdmin && doc.status === 'PENDING' && (
                      <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100">
                        <button onClick={() => setAdminModal({ doc, action: 'approve' })} disabled={docProcessing === doc.id}
                          className="flex items-center gap-1.5 text-sm px-4 py-2 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg font-medium">
                          {docProcessing === doc.id ? <Spinner size="sm" /> : <CheckCircle size={15} />} Approve
                        </button>
                        <button onClick={() => setAdminModal({ doc, action: 'reject' })} disabled={docProcessing === doc.id}
                          className="flex items-center gap-1.5 text-sm px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg font-medium">
                          {docProcessing === doc.id ? <Spinner size="sm" /> : <XCircle size={15} />} Reject
                        </button>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}
    </Layout>
  )
}
