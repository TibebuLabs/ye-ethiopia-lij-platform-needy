/**
 * Global notification context.
 * Polls every 15s via REST (no WebSocket — backend is WSGI).
 * Prepends new items in real-time, plays a sound, fires toast popups.
 */
import {
  createContext, useContext, useState, useEffect,
  useRef, useCallback, ReactNode,
} from 'react'
import {
  listNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from '../api/children'
import type { Notification } from '../types'

const POLL_MS = 15_000

// ── Sound ─────────────────────────────────────────────────────────────────────
function playDing() {
  try {
    const ctx = new AudioContext()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = 'sine'
    osc.frequency.setValueAtTime(880, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.25)
    gain.gain.setValueAtTime(0.3, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.4)
    osc.onended = () => ctx.close()
  } catch { /* ignore — AudioContext may not be available */ }
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function extractList(data: unknown): Notification[] {
  if (!data) return []
  if (Array.isArray(data)) return data as Notification[]
  const d = data as { results?: Notification[] }
  if (Array.isArray(d.results)) return d.results
  return []
}

// ── Context types ─────────────────────────────────────────────────────────────
interface NotificationCtx {
  notifications: Notification[]
  unreadCount: number
  loading: boolean
  markRead: (id: string) => Promise<void>
  markAllRead: () => Promise<void>
  clearBadge: () => void
  setToastHandler: (fn: (items: Notification[]) => void) => void
}

const Ctx = createContext<NotificationCtx | null>(null)

export function useNotifications() {
  const c = useContext(Ctx)
  if (!c) throw new Error('useNotifications must be inside NotificationProvider')
  return c
}

// ── Provider ──────────────────────────────────────────────────────────────────
export function NotificationProvider({
  children,
  enabled,
}: {
  children: ReactNode
  enabled: boolean
}) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const knownIdsRef = useRef<Set<string>>(new Set())
  const toastHandlerRef = useRef<((items: Notification[]) => void) | null>(null)
  const initializedRef = useRef(false)

  const fetchAndMerge = useCallback(async () => {
    try {
      const res = await listNotifications()
      const fresh = extractList(res.data)

      // Sort newest first
      fresh.sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      )

      if (!initializedRef.current) {
        // First load — populate silently
        initializedRef.current = true
        knownIdsRef.current = new Set(fresh.map((n) => n.id))
        setNotifications(fresh)
        setLoading(false)
        return
      }

      // Find genuinely new items
      const newItems = fresh.filter((n) => !knownIdsRef.current.has(n.id))

      if (newItems.length > 0) {
        newItems.forEach((n) => knownIdsRef.current.add(n.id))
        setNotifications((prev) => {
          const existingIds = new Set(prev.map((x) => x.id))
          const toAdd = newItems.filter((n) => !existingIds.has(n.id))
          return toAdd.length ? [...toAdd, ...prev] : prev
        })
        playDing()
        toastHandlerRef.current?.(newItems)
      }

      // Sync read-status changes from other sessions
      setNotifications((prev) =>
        prev.map((p) => {
          const updated = fresh.find((f) => f.id === p.id)
          return updated ? { ...p, is_read: updated.is_read } : p
        }),
      )
    } catch {
      // Network error or 401 — skip this cycle
      if (!initializedRef.current) {
        setLoading(false)
      }
    }
  }, [])

  useEffect(() => {
    if (!enabled) {
      // Reset when user logs out
      setNotifications([])
      setLoading(true)
      initializedRef.current = false
      knownIdsRef.current = new Set()
      return
    }
    fetchAndMerge()
    const id = setInterval(fetchAndMerge, POLL_MS)
    return () => clearInterval(id)
  }, [enabled, fetchAndMerge])

  const markRead = useCallback(async (id: string) => {
    try {
      await markNotificationRead(id)
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)),
      )
    } catch { /* silent */ }
  }, [])

  const markAllRead = useCallback(async () => {
    await markAllNotificationsRead()
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })))
  }, [])

  const clearBadge = useCallback(() => {
    // Badge is driven by is_read — no separate state needed
  }, [])

  const setToastHandler = useCallback((fn: (items: Notification[]) => void) => {
    toastHandlerRef.current = fn
  }, [])

  const unreadCount = notifications.filter((n) => !n.is_read).length

  return (
    <Ctx.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        markRead,
        markAllRead,
        clearBadge,
        setToastHandler,
      }}
    >
      {children}
    </Ctx.Provider>
  )
}
