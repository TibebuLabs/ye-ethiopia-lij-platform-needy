/**
 * Polls the backend every 15s for new notifications.
 * Plays a sound and fires a callback when the unread count increases.
 * Works without WebSockets — pure REST polling.
 */
import { useEffect, useRef, useCallback } from 'react'
import { unreadCount, listNotifications } from '../api/children'
import type { Notification } from '../types'

const POLL_INTERVAL = 15_000 // 15 seconds

/** Generates a soft notification "ding" using Web Audio API — no file needed */
function playNotificationSound() {
  try {
    const ctx = new AudioContext()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.type = 'sine'
    osc.frequency.setValueAtTime(880, ctx.currentTime)          // A5
    osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.3) // A4

    gain.gain.setValueAtTime(0.4, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5)

    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.5)

    osc.onended = () => ctx.close()
  } catch {
    // AudioContext not available (e.g. SSR) — ignore
  }
}

interface Options {
  enabled: boolean
  onNewNotifications: (notifications: Notification[], newCount: number) => void
}

export function useNotificationPoller({ enabled, onNewNotifications }: Options) {
  const prevUnreadRef = useRef<number | null>(null)
  const onNewRef = useRef(onNewNotifications)
  onNewRef.current = onNewNotifications

  const poll = useCallback(async () => {
    try {
      const res = await unreadCount()
      const current = res.data.unread_count ?? 0

      if (prevUnreadRef.current === null) {
        // First load — just store, don't alert
        prevUnreadRef.current = current
        return
      }

      if (current > prevUnreadRef.current) {
        const diff = current - prevUnreadRef.current
        prevUnreadRef.current = current

        // Fetch the latest notifications to pass to the callback
        const notifRes = await listNotifications()
        const data = notifRes.data
        const all: Notification[] = Array.isArray(data) ? data : (data as { results: Notification[] }).results
        const newest = all.filter((n) => !n.is_read).slice(0, diff)

        playNotificationSound()
        onNewRef.current(newest, diff)
      } else {
        prevUnreadRef.current = current
      }
    } catch {
      // Network error — skip this poll cycle
    }
  }, [])

  useEffect(() => {
    if (!enabled) return

    // Poll immediately on mount, then on interval
    poll()
    const id = setInterval(poll, POLL_INTERVAL)
    return () => clearInterval(id)
  }, [enabled, poll])

  /** Call this to force-reset the stored count (e.g. after marking all read) */
  const resetCount = useCallback((count = 0) => {
    prevUnreadRef.current = count
  }, [])

  return { resetCount }
}
