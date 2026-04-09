import { useState } from 'react'
import Layout from '../components/Layout'
import Spinner from '../components/Spinner'
import { useNotifications } from '../context/NotificationContext'
import { Bell, CheckCheck, X, Clock } from 'lucide-react'
import toast from 'react-hot-toast'
import type { Notification } from '../types'

const TYPE_COLORS: Record<string, string> = {
  PROFILE_APPROVED:       'bg-green-100 text-green-700',
  PROFILE_REJECTED:       'bg-red-100 text-red-700',
  SPONSORED:              'bg-blue-100 text-blue-700',
  INTERVENTION_ADDED:     'bg-purple-100 text-purple-700',
  REPORT_SUBMITTED:       'bg-yellow-100 text-yellow-700',
  STATUS_UPDATED:         'bg-gray-100 text-gray-700',
  USER_REGISTERED:        'bg-teal-100 text-teal-700',
  ACCOUNT_APPROVED:       'bg-green-100 text-green-700',
  ACCOUNT_REJECTED:       'bg-red-100 text-red-700',
  ACCOUNT_SUSPENDED:      'bg-orange-100 text-orange-700',
  ORG_CREATED:            'bg-indigo-100 text-indigo-700',
  ORG_APPROVED:           'bg-green-100 text-green-700',
  ORG_REJECTED:           'bg-red-100 text-red-700',
  SCHOOL_PROFILE_CREATED: 'bg-cyan-100 text-cyan-700',
  SCHOOL_PROFILE_UPDATED: 'bg-cyan-100 text-cyan-700',
}

const TYPE_ICONS: Record<string, string> = {
  PROFILE_APPROVED:       '✅',
  PROFILE_REJECTED:       '❌',
  SPONSORED:              '💚',
  INTERVENTION_ADDED:     '🏥',
  REPORT_SUBMITTED:       '📄',
  STATUS_UPDATED:         '🔔',
  USER_REGISTERED:        '👤',
  ACCOUNT_APPROVED:       '✅',
  ACCOUNT_REJECTED:       '❌',
  ACCOUNT_SUSPENDED:      '⚠️',
  ORG_CREATED:            '🏢',
  ORG_APPROVED:           '✅',
  ORG_REJECTED:           '❌',
  SCHOOL_PROFILE_CREATED: '🏫',
  SCHOOL_PROFILE_UPDATED: '🏫',
}

const TYPE_LABELS: Record<string, string> = {
  PROFILE_APPROVED:       'Profile Approved',
  PROFILE_REJECTED:       'Profile Rejected',
  SPONSORED:              'Sponsored',
  INTERVENTION_ADDED:     'Intervention',
  REPORT_SUBMITTED:       'Report',
  STATUS_UPDATED:         'Status Update',
  USER_REGISTERED:        'New User',
  ACCOUNT_APPROVED:       'Account Approved',
  ACCOUNT_REJECTED:       'Account Rejected',
  ACCOUNT_SUSPENDED:      'Account Suspended',
  ORG_CREATED:            'Org Registered',
  ORG_APPROVED:           'Org Approved',
  ORG_REJECTED:           'Org Rejected',
  SCHOOL_PROFILE_CREATED: 'School Profile',
  SCHOOL_PROFILE_UPDATED: 'School Updated',
}

const getColor = (type: string) => TYPE_COLORS[type] ?? 'bg-gray-100 text-gray-600'
const getIcon  = (type: string) => TYPE_ICONS[type]  ?? '🔔'
const getLabel = (type: string) => TYPE_LABELS[type]  ?? type?.replace(/_/g, ' ')

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export default function Notifications() {
  const { notifications, loading, unreadCount, markRead, markAllRead } = useNotifications()
  const [selected, setSelected] = useState<Notification | null>(null)
  const [markingAll, setMarkingAll] = useState(false)

  const handleClick = async (n: Notification) => {
    setSelected(n)
    if (!n.is_read) {
      try { await markRead(n.id) } catch { /* silent */ }
    }
  }

  const handleMarkAll = async () => {
    setMarkingAll(true)
    try {
      await markAllRead()
      toast.success('All notifications marked as read')
    } catch {
      toast.error('Failed to mark all as read')
    } finally {
      setMarkingAll(false)
    }
  }

  return (
    <Layout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-500 text-sm">{unreadCount} unread</p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAll}
            disabled={markingAll}
            className="flex items-center gap-2 text-sm text-green-700 hover:text-green-800 border border-green-200 hover:border-green-400 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
          >
            {markingAll ? <Spinner size="sm" /> : <CheckCheck size={15} />}
            Mark all read
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : notifications.length === 0 ? (
        <div className="card text-center py-16">
          <Bell size={48} className="text-gray-200 mx-auto mb-4" />
          <p className="text-gray-500">No notifications yet.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => handleClick(n)}
              className={`card cursor-pointer flex items-start gap-4 transition-all hover:shadow-md hover:border-green-200 ${
                !n.is_read ? 'border-l-4 border-l-green-400 bg-green-50/40' : 'opacity-75'
              }`}
            >
              <div className="mt-1 flex-shrink-0">
                <span className={`w-2.5 h-2.5 rounded-full block ${!n.is_read ? 'bg-green-500' : 'bg-gray-200'}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getColor(n.notification_type)}`}>
                    {getIcon(n.notification_type)} {getLabel(n.notification_type)}
                  </span>
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Clock size={11} /> {timeAgo(n.created_at)}
                  </span>
                </div>
                <p className="font-medium text-gray-800 text-sm mt-1">{n.title}</p>
                <p className="text-gray-500 text-sm mt-0.5 line-clamp-2">{n.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-slideIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getColor(selected.notification_type)}`}>
                {getIcon(selected.notification_type)} {getLabel(selected.notification_type)}
              </span>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            <h2 className="text-lg font-semibold text-gray-900 mb-2">{selected.title}</h2>
            <p className="text-gray-600 text-sm leading-relaxed">{selected.message}</p>

            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <Clock size={12} /> {new Date(selected.created_at).toLocaleString()}
              </span>
              {selected.is_read && (
                <span className="flex items-center gap-1 text-green-600">
                  <CheckCheck size={12} /> Read
                </span>
              )}
            </div>

            <button
              onClick={() => setSelected(null)}
              className="mt-4 w-full btn-secondary text-sm py-2"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </Layout>
  )
}
