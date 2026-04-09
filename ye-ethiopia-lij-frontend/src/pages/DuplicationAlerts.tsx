import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import Spinner from '../components/Spinner'
import { pendingAlerts, listDuplicationAlerts, resolveDuplicate, pmPublishChild, returnForCorrection } from '../api/extended'
import type { DuplicationAlert } from '../api/extended'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { CheckCircle, XCircle, Filter, ArrowUpCircle, RotateCcw, AlertTriangle } from 'lucide-react'

const STATUS_COLORS: Record<string, string> = {
  PENDING:       'bg-yellow-100 text-yellow-700',
  CONFIRMED:     'bg-red-100 text-red-700',
  FALSE_POSITIVE:'bg-gray-100 text-gray-600',
  MERGED:        'bg-blue-100 text-blue-700',
  RESOLVED:      'bg-green-100 text-green-700',
}

function ScoreBar({ score }: { score: number }) {
  const color = score >= 85 ? 'bg-red-500' : score >= 70 ? 'bg-orange-400' : 'bg-yellow-400'
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${score}%` }} />
      </div>
      <span className="text-xs font-semibold text-gray-700 w-10 text-right">{score}%</span>
    </div>
  )
}

// ── Inline action modal ───────────────────────────────────────────────────────
interface ActionModal {
  alertId: string
  duplicateChildId: string
  duplicateChildName: string
  primaryChildName: string
  type: 'merge' | 'false_positive' | 'publish' | 'return'
}

function ConfirmModal({
  modal,
  onConfirm,
  onCancel,
}: {
  modal: ActionModal
  onConfirm: (notes: string) => void
  onCancel: () => void
}) {
  const [notes, setNotes] = useState('')
  const isReturn = modal.type === 'return'
  const isMerge  = modal.type === 'merge'

  const config = {
    merge:         { title: 'Confirm Duplicate',        color: 'red',    btnLabel: 'Confirm & Merge',       requireNotes: false },
    false_positive:{ title: 'Mark as Not a Duplicate',  color: 'green',  btnLabel: 'Confirm Unique',        requireNotes: false },
    publish:       { title: 'Approve & Post Profile',   color: 'green',  btnLabel: 'Approve & Publish',     requireNotes: false },
    return:        { title: 'Return for Correction',    color: 'yellow', btnLabel: 'Send Back',             requireNotes: true  },
  }[modal.type]

  const canSubmit = !config.requireNotes || notes.trim().length > 0

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-${config.color}-100`}>
              <AlertTriangle size={20} className={`text-${config.color}-600`} />
            </div>
            <h3 className="text-lg font-bold text-gray-900">{config.title}</h3>
          </div>

          {/* Side-by-side comparison */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-blue-50 rounded-xl p-3">
              <p className="text-xs text-blue-400 font-medium mb-1">Existing child</p>
              <p className="font-semibold text-gray-800 text-sm">{modal.primaryChildName}</p>
            </div>
            <div className="bg-orange-50 rounded-xl p-3">
              <p className="text-xs text-orange-400 font-medium mb-1">Newly registered</p>
              <p className="font-semibold text-gray-800 text-sm">{modal.duplicateChildName}</p>
            </div>
          </div>

          {isMerge && (
            <p className="text-sm text-gray-500 mb-4">
              This will mark <span className="font-medium text-gray-700">{modal.duplicateChildName}</span> as a duplicate
              and remove them from the system. The org staff will be notified.
            </p>
          )}
          {modal.type === 'publish' && (
            <p className="text-sm text-gray-500 mb-4">
              This will approve <span className="font-medium text-gray-700">{modal.duplicateChildName}</span> as a unique
              child and publish their profile. The org staff will be notified.
            </p>
          )}

          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              {isReturn ? 'Reason for correction' : 'Notes'}{isReturn && <span className="text-red-500 ml-1">*</span>}
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={isReturn ? 'Explain what needs to be corrected...' : 'Optional notes...'}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 resize-none"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => onConfirm(notes)}
              disabled={!canSubmit}
              className={`flex-1 px-4 py-2.5 text-sm font-semibold rounded-xl transition-colors disabled:opacity-50 ${
                config.color === 'red'    ? 'bg-red-600 hover:bg-red-700 text-white' :
                config.color === 'yellow'? 'bg-yellow-500 hover:bg-yellow-600 text-white' :
                                           'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {config.btnLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function DuplicationAlerts() {
  const { user } = useAuth()
  const isPM = user?.role === 'PROJECT_MANAGER'

  const [alerts, setAlerts]     = useState<DuplicationAlert[]>([])
  const [loading, setLoading]   = useState(true)
  const [filter, setFilter]     = useState<'pending' | 'all'>('pending')
  const [resolving, setResolving] = useState<string | null>(null)
  const [modal, setModal]       = useState<ActionModal | null>(null)

  const fetchAlerts = () => {
    setLoading(true)
    const req = filter === 'pending' ? pendingAlerts() : listDuplicationAlerts()
    req
      .then((r) => {
        const data = r.data
        const list: DuplicationAlert[] = Array.isArray(data) ? data : (data as { results: DuplicationAlert[] }).results
        list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        setAlerts(list)
      })
      .catch(() => toast.error('Failed to load duplication alerts'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchAlerts() }, [filter])

  const openModal = (alert: DuplicationAlert, type: ActionModal['type']) => {
    setModal({
      alertId: alert.id,
      duplicateChildId: alert.duplicate_child,
      duplicateChildName: alert.duplicate_child_name,
      primaryChildName: alert.primary_child_name,
      type,
    })
  }

  const handleConfirm = async (notes: string) => {
    if (!modal) return
    setModal(null)
    setResolving(modal.alertId)
    try {
      if (modal.type === 'merge') {
        await resolveDuplicate(modal.alertId, { action: 'merge', notes })
        toast.success('Marked as duplicate — org staff notified')
      } else if (modal.type === 'false_positive') {
        await resolveDuplicate(modal.alertId, { action: 'false_positive', notes })
        toast.success('Marked as unique — org staff notified')
      } else if (modal.type === 'publish') {
        await pmPublishChild(modal.duplicateChildId)
        await resolveDuplicate(modal.alertId, { action: 'false_positive', notes: 'Approved as unique by PM' })
        toast.success(`${modal.duplicateChildName} published — org staff notified`)
      } else if (modal.type === 'return') {
        await returnForCorrection(modal.duplicateChildId, notes)
        toast.success('Profile returned for correction — org staff notified')
      }
      fetchAlerts()
    } catch {
      toast.error('Action failed. Please try again.')
    } finally {
      setResolving(null)
    }
  }

  return (
    <Layout>
      {modal && (
        <ConfirmModal
          modal={modal}
          onConfirm={handleConfirm}
          onCancel={() => setModal(null)}
        />
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Duplication Alerts</h1>
          <p className="text-gray-500 text-sm">
            {alerts.length} {filter === 'pending' ? 'pending' : 'total'} alert{alerts.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Filter size={15} className="text-gray-400" />
          <select
            className="input-field w-36 py-2 text-sm"
            value={filter}
            onChange={(e) => setFilter(e.target.value as 'pending' | 'all')}
          >
            <option value="pending">Pending only</option>
            <option value="all">All alerts</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : alerts.length === 0 ? (
        <div className="card text-center py-16">
          <CheckCircle size={48} className="text-green-200 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">No duplication alerts</p>
          <p className="text-gray-400 text-sm mt-1">All registered children appear to be unique.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div key={alert.id} className="card hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                {/* Children comparison */}
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-xl p-3">
                    <p className="text-xs text-blue-400 font-medium mb-1">Existing child</p>
                    <p className="font-semibold text-gray-800">{alert.primary_child_name}</p>
                  </div>
                  <div className="bg-orange-50 rounded-xl p-3">
                    <p className="text-xs text-orange-400 font-medium mb-1">Newly registered</p>
                    <p className="font-semibold text-gray-800">{alert.duplicate_child_name}</p>
                  </div>
                </div>

                {/* Score + status */}
                <div className="sm:w-48 space-y-2 flex-shrink-0">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Similarity score</p>
                    <ScoreBar score={alert.similarity_score} />
                  </div>
                  <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[alert.status] ?? 'bg-gray-100 text-gray-600'}`}>
                    {alert.status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* Matching fields */}
              {Array.isArray(alert.matching_fields) && alert.matching_fields.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="text-xs text-gray-400">Matching fields:</span>
                  {(alert.matching_fields as string[]).map((f) => (
                    <span key={f} className="text-xs bg-yellow-50 text-yellow-700 border border-yellow-200 px-2 py-0.5 rounded-full">
                      {f.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              )}

              <p className="text-xs text-gray-400 mt-2">
                Detected {new Date(alert.created_at).toLocaleDateString()}
              </p>

              {/* Actions — only for PENDING */}
              {alert.status === 'PENDING' && (
                <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-gray-100">
                  {isPM ? (
                    <>
                      <button
                        onClick={() => openModal(alert, 'publish')}
                        disabled={resolving === alert.id}
                        className="flex items-center gap-1.5 text-sm px-4 py-2 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg transition-colors font-medium"
                      >
                        {resolving === alert.id ? <Spinner size="sm" /> : <ArrowUpCircle size={15} />}
                        Approve & Post
                      </button>
                      <button
                        onClick={() => openModal(alert, 'return')}
                        disabled={resolving === alert.id}
                        className="flex items-center gap-1.5 text-sm px-4 py-2 bg-yellow-50 text-yellow-700 hover:bg-yellow-100 rounded-lg transition-colors font-medium"
                      >
                        {resolving === alert.id ? <Spinner size="sm" /> : <RotateCcw size={15} />}
                        Return for Correction
                      </button>
                      <button
                        onClick={() => openModal(alert, 'merge')}
                        disabled={resolving === alert.id}
                        className="flex items-center gap-1.5 text-sm px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors font-medium"
                      >
                        {resolving === alert.id ? <Spinner size="sm" /> : <XCircle size={15} />}
                        Confirm Duplicate
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => openModal(alert, 'merge')}
                        disabled={resolving === alert.id}
                        className="flex items-center gap-1.5 text-sm px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors font-medium"
                      >
                        {resolving === alert.id ? <Spinner size="sm" /> : <XCircle size={15} />}
                        Confirm Duplicate
                      </button>
                      <button
                        onClick={() => openModal(alert, 'false_positive')}
                        disabled={resolving === alert.id}
                        className="flex items-center gap-1.5 text-sm px-4 py-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg transition-colors font-medium"
                      >
                        {resolving === alert.id ? <Spinner size="sm" /> : <CheckCircle size={15} />}
                        Not a Duplicate
                      </button>
                    </>
                  )}
                </div>
              )}

              {alert.resolution_notes && (
                <p className="text-xs text-gray-500 mt-2 italic">Note: {alert.resolution_notes}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </Layout>
  )
}
